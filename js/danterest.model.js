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
      user : null,
      people_cid_map : {},
      people_db : TAFFY()
    },
    isFakeData = true,
    personProto, makePerson, people, initModule;

  personProto = {
    get_is_user : function () {
      return this.cid === stateMap.user.cid;
    },
    get_is_anon : function () {
      return this.cid === stateMap.anon_user.cid;
    }
  };

  makePerson = function (person_map) {
    var person,
      cid = person_map.cid,
      id = person_map.id,
      name = person_map.name,
      email = person_map.email,
      status = (person_map.state === undefined ?
        "offline" : person_map.status ),
      role = person_map.role;

    if (cid === undefined || !name ) {
      throw makeError("Bad Person Info", 
        "Client ID and name are required", null);
    }

    person = Object.create(personProto);
    person.cid = cid;
    person.name = name;
    person.email = email;

    if (id) {
      person.id = id;
    }

    stateMap.people_cid_map[cid] = person;
    stateMap.people_db.insert(person);
    return person;
  };

  people = {
    get_db : function () { return stateMap.people_db; },
    get_cid_map : function () { return stateMap.people_cid_map; }
  };

  initModule = function () {
    var i, people_list, person_map;
    stateMap.anon_user = makePerson({
      cid : configMap.anon_id,
      id : configMap.anon_id,
      name : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;

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
    initModule initModule,
    people : people
  };

}());