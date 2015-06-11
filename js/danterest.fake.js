/*
 * danterest.fake.js
 * Fake module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, danterest */

danterest.fake = (function () {
  var 
    configMap = {
      online_state : "online",
      offline_state : "offline",
      away_state : "away",
      teacher_role : "teacher",
      student_role : "student",
      parent_role : "parent"
    },
    getPeopleList,
    peopleList, fakeIdSerial, makeFakeId, mockSio;

  fakeIdSerial = 9;

  peopleList = [
    { name : 'Betty', _id : 'id_01',
      role : configMap.teacher_role,
      visibility : "visible",
      status : configMap.online_state
    },
    { name : 'Mike', _id : 'id_02',
      role : configMap.teacher_role,
      visibility : "visible",
      status : configMap.online_state
    },
    { name : 'Pebbles', _id : 'id_03',
      role : configMap.teacher_role,
      visibility : "visible",
      status : configMap.online_state
    },
    { name : 'Wilma', _id : 'id_04',
      role : configMap.teacher_role,
      visibility : "visible",
      status : configMap.online_state
    },
    { name : 'Alice', _id : 'id_05',
      role : configMap.student_role,
      visibility : "visible",
      status : configMap.offline_state
    },
    { name : 'Bob', _id : 'id_06',
      role : configMap.student_role,
      visibility : "visible",
      status : configMap.offline_state
    },
    { name : 'John', _id : 'id_07',
      role : configMap.student_role,
      visibility : "visible",
      status : configMap.away_state
    },
    { name : 'Invisible', _id : 'id_08',
      role : configMap.student_role,
      visibility : "invisible",
      status : configMap.away_state
    }
  ];

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };

  getPeopleList = function () {
    return peopleList;
  };

  mockSio = (function (){
    var on_sio, emit_sio, callback_map = {};

    on_sio = function (msg_type, callback) {
      callback_map[msg_type] = callback;
    };

    emit_sio = function (msg_type, data) {
      if (msg_type === "userlogin") {
        if (callback_map.userupdate){
          console.log("receive userlogin signal in Fake Module");
          setTimeout( function () {
            callback_map.userupdate({
              _id : makeFakeId(),
              name : data.name,
              email : data.email,
              role  : data.role }, peopleList);
          }, 3000);
        }
      }
      else if (msg_type === "userlogout"){
        console.log("receive userlogout signal in Fake Module");
      }
    };

    return { emit : emit_sio, on : on_sio };
  }());

  return {
    getPeopleList : getPeopleList,
    mockSio : mockSio
  };
 
}());