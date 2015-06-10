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
      people_cid_map : {},
      people_db : TAFFY(),
      visibility : "visible", /*visible, invisible*/
      status : "anonymous" /*anonymous, progressing, login*/
    },
    isFakeData = true,
    makeCid, clearPeopleDb, completeLogin, removePerson,
    friendProto, makeFriend, people, initModule,
    sio;

  friendProto = {
    get_is_user : function () {
      return this.cid === stateMap.user.cid;
    },
    get_is_anon : function () {
      return this.cid === stateMap.anon_user.cid;
    }
  };

  /* Create Friend object and add it to client-side
   * database 
   * Friend Properties:
   *  * id
   *  * cid
   *  * name
   *  * email
   *  * role
   */
  makeFriend = function (person_map) {
    var person,
      cid = person_map.cid,
      id = person_map.id,
      name = person_map.name,
      email = person_map.email,
      //status = (person_map.state === undefined ?
      //  "offline" : person_map.status ),
      role = person_map.role; /* teacher, student, parent */

    if (cid === undefined || !name ) {
      throw makeError("Bad Person Info", 
        "Client ID and name are required", null);
    }

    person = Object.create(personProto);
    person.cid = cid;
    person.name = name;
    person.email = email;
    person.role = role;

    if (id) {
      person.id = id;
    }

    stateMap.people_cid_map[cid] = person;
    stateMap.people_db.insert(person);
    return person;
  };

  /* Make client ID */
  makeCid = function () {
    return 'c' + String(stateMap.cid_serial++);
  };

  /* Remove all friend objects */
  clearPeopleDb = function () {
    var user = satteMap.user;
    stateMap.people_db = TAFFY();
    stateMap.people_cid_map = {};
    if (user) {
      stateMap.people_db.insert(user);
      stateMap.people_cid_map[user.cid] = user;
    }
  };

  /* This callback is called when backend sends confirmation
   *    that the user has logged in.
   * Action:
   *  1. update stateMap.user
   *  2. send login events to subscribers
   */
  completeLogin = function ( user_list ) {
    var user_map = user_list[0] ;
    //TODO: confirm user_map is current user!
    console.log("in Model completeLogin completeLogin");
    delete stateMap.people_cid_map[user_map.cid];
    stateMap.user.cid = user_map._id;
    stateMap.user.id = user_map._id;
    stateMap.user.role = user_map.role;
    stateMap.user.email = user_map.email;
    stateMap.user.name = user_map.name;
    stateMap.people_cid_map[ user_map._id ] = stateMap.user;
    stateMap.status = "login";

    $.gevent.publish('danterest-login',[stateMap.user]);
  };

  removePerson = function (person) {
    console.log("undone: removePerson: "+person.name);
    return true;
  }

  /*
   * Begin People Module
   *  * 1. get_by_cid(id)
   *  * 2. get_db()
   *  * 3. get_user()
   *  * 4. login({name})
   *  * 5. logout(name)
   *  * 6. change_visibility("new_visibility")
   */
  people = (function () {
    var get_by_cid, get_db, get_user,
      login, logout, change_visibility;

    get_by_cid = function(cid){
      return stateMap.people_cid_map[cid];
    };

    get_db = function () {
      return stateMap.people_db;
    };

    get_user = function () {
      return stateMap.user;
    };

    login = function (user_map) {
      stateMap.user = makePerson({
        cid : makeCid(),
        name : user_map.name,
        email : user_map.email,
        role  : user_map.role
      });

      /* Register callback completeLogin for backend notification */
      sio.on('userupdate', completeLogin);
      stateMap.status = "processing";
      /* Send `adduser` msg to backend */
      sio.emit('userlogin', {
        cid : stateMap.user.cid,
        name : stateMap.user.name,
        email : stateMap.user.email
      });
    };

    logout = function () {
      var is_removed, user = stateMap.user;

      is_removed = removePerson(user);
      sio.emit('userlogout', {
        cid : user.cid,
        name : user.name,
        email : user.email
      });
      stateMap.user = stateMap.anon_user;
      stateMap.status = "anonymous";
      $.gevent.publish("danterest-logout",[user]);
      return is_removed;
    };

    change_visibility = function (new_visibility) {

    };

    return {
      get_by_cid : get_by_cid,
      get_db : get_db,
      get_user : get_user,
      login : login,
      logout : logout
    };

  }());
  /* End People Module */

  initModule = function () {
    var i, people_list, person_map;
    stateMap.anon_user = makePerson({
      cid : configMap.anon_id,
      id : configMap.anon_id,
      name : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;

    sio = isFakeData ?
        danterest.fake.mockSio : danterest.data.getSio();

    if (isFakeData) {
      people_list = danterest.fake.getPeopleList();
      for (i=0; i<people_list.length; i++){
        person_map = people_list[i];
        makePerson({
          cid : person_map._id,
          id : person_map._id,
          email : person_map.name.toLowerCase()+'@gmail.com',
          name : person_map.name,
          role : person_map.role,
          status : person_map.status
        });
      }
    }
  };

  return {
    initModule : initModule,
    people : people
  };

}());