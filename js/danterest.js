/*
 * danterest.js 
 * Root module for Danterest
 * The shell of Danterest is responsible for following:
 ** initializing shell module
 */

/*jslint browser: true, continue: true,
    devel: true, indent: 2, maxerr: 50,
    newcap: true, nomen: true, plusplus: true,
    regexp: true, sloppy: true, vars: false,
    white: true
*/

/* required global $ */

var danterest = (function () {
  var initModule = function ($container){
    danterest.shell.initModule($container);
  };
  return { initModule : initModule };
}());