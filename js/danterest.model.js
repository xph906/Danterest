/*
 * danterest.model.js
 * Model module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global TAFFY, $, danterest */

danterest.model = (function () {
  var
    configMap = { anon_id : 'a0' },
    stateMap = {
      anon_user : null,
      cid_serial : 0,
      user : null,
      friend_cid_map : {},
      friend_db : TAFFY(),
      default_visibility : "visible",
      login_status : "anonymous" /*anonymous, progressing, login*/
    },
    isFakeData = true,
    makeCid, clearFriendDb, completeLogin, removeFriend,
    personProto, makePerson, people, initModule,
    sio;

  personProto = {
    get_is_user : function () {
      return this.cid === stateMap.user.cid;
    },
    get_is_anon : function () {
      return this.cid === stateMap.anon_user.cid;
    }
  };

  /* Create Person object
   *  The person can be 
   *    1). the user
   *    2). anonymous user
   *    3). friend, which will be added to client-side database
   * Person Properties:
   *  * id
   *  * cid
   *  * name
   *  * email
   *  * role : teacher, student, parent
   *  * visibility : visible, invisible
   *  * status: online, offline, invisible
   */
  makePerson = function (person_map, is_friend) {
    var person, cid = person_map.cid,
      id = person_map.id, name = person_map.name;

    if (cid === undefined || !name ) {
      console.log(cid+" "+name)
      throw danterest.util.makeError("Bad Person Info", 
        "Client ID and name are required", null);
    }
 
    person = Object.create(personProto);
    person.name = name;
    person.email = person_map.email;
    person.role = person_map.role;
    person.visibility = person_map.visibility;
    person.status = person_map.status;
    if (id) { person.id = id; }

    if ( is_friend) {
      stateMap.friend_cid_map[cid] = person;
      stateMap.friend_db.insert(person);     
    }
    else{
      console.log("makePerson creates a non-friend");
    }
    return person;
  };

  /* Make client ID */
  makeCid = function () {
    return 'c' + String(stateMap.cid_serial++);
  };

  /* Remove all friend objects */
  clearFriendDb = function () {
    stateMap.friend_db = TAFFY();
    stateMap.friend_cid_map = {};
  };

  /* This callback is called when backend sends confirmation
   *    that the user has logged in.
   * Action:
   *  1. update stateMap.user
   *  2. send login events to subscribers
   */
  completeLogin = function ( user, friend_list ) {
    var friend_map, user_map = user;
    //TODO: confirm user_map is current user!
    console.log("in Model completeLogin completeLogin");
    delete stateMap.friend_cid_map[user_map.cid];
    //TODO: delete the user from friendDb
    stateMap.user.cid = user_map._id;
    stateMap.user.id = user_map._id;
    stateMap.user.role = user_map.role;
    stateMap.user.email = user_map.email;
    stateMap.user.name = user_map.name;
    stateMap.login_status = "login";
 
    for (i=0; i<friend_list.length; i++){
      friend_map = friend_list[i];
      makePerson({
        cid : friend_map._id,
        id : friend_map._id,
        email : friend_map.name.toLowerCase()+'@gmail.com',
        name : friend_map.name,
        role : friend_map.role,
        status : friend_map.status
      }, true);
    }

    $.gevent.publish('danterest-login',[stateMap.user]);
  };

  removeFriend = function (friend) {
    //TODO:
    console.log("undone: removePerson: "+friend.name);
    return true;
  }

  /*
   * Begin friends Module
   *  * 1. get_by_cid(id)
   *  * 2. get_friend_db()
   *  * 3. get_user()
   *  * 4. login({name})
   *  * 5. logout(name)
   *  * 6. change_visibility("new_visibility")
   */
  people = (function () {
    var get_by_cid, get_friend_db, get_user,
      login, logout, change_visibility;

    get_by_cid = function(cid){
      if (cid === configMap.anon_id) {
        return configMap.anon_user;
      }
      else if (cid === stateMap.user.cid) {
        return stateMap.user;
      }
      return stateMap.friend_cid_map[cid];
    };

    get_friend_db = function () {
      return stateMap.friend_db;
    };

    get_user = function () {
      return stateMap.user;
    };

    login = function (user_map) {
      stateMap.user = makePerson({
        cid : makeCid(),
        name : user_map.name,
        email : user_map.email,
        role  : user_map.role,
        visibility : stateMap.default_visibility,
        status : "online"
      }, false);
      stateMap.login_status = "processing";

      /* Register callback completeLogin for backend notification */
      sio.on('userupdate', completeLogin);
      /* Send `adduser` msg to backend */
      sio.emit('userlogin', stateMap.user);
    };

    logout = function () {
      var user = stateMap.user;
      $.gevent.publish("danterest-logout",[user]);

      clearFriendDb();
      stateMap.login_status = "anonymous";
      stateMap.user = stateMap.anon_user;  

      sio.emit('userlogout', {
        cid : user.cid,
        name : user.name,
        email : user.email
      });

      return true;
    };

    change_visibility = function (new_visibility) {

    };

    return {
      get_by_cid : get_by_cid,
      get_friend_db : get_friend_db,
      get_user : get_user,
      login : login,
      logout : logout
    };

  }());
  /* End People Module */

  initModule = function () {
    var i, friend_list, friend_map;
    stateMap.anon_user = makePerson({
      cid : configMap.anon_id,
      id : configMap.anon_id,
      name : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;

    sio = isFakeData ?
        danterest.fake.mockSio : danterest.data.getSio();
  };

  return {
    initModule : initModule,
    people : people
  };

}());