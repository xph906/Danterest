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
      student_role : "student"
    },
    getPeopleList,
    peopleList, fakeIdSerial, makeFakeId, mockSio;

  fakeIdSerial = 8;

  peopleList = [
    { name : 'Betty', _id : 'id_01',
      role : configMap.teacher_role,
      status : configMap.online_state
    },
    { name : 'Mike', _id : 'id_02',
      role : configMap.teacher_role,
      status : configMap.online_state
    },
    { name : 'Pebbles', _id : 'id_03',
      role : configMap.teacher_role,
      status : configMap.online_state
    },
    { name : 'Wilma', _id : 'id_04',
      role : configMap.teacher_role,
      status : configMap.online_state
    },
    { name : 'Alice', _id : 'id_05',
      role : configMap.student_role,
      status : configMap.offline_state
    },
    { name : 'Bob', _id : 'id_06',
      role : configMap.student_role,
      status : configMap.offline_state
    },
    { name : 'John', _id : 'id_07',
      role : configMap.student_role,
      status : configMap.away_state
    }
  ];

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };

  getPeopleList = function () {
    return peopleList;
  };

  return {
    getPeopleList : getPeopleList
  };
 
}());