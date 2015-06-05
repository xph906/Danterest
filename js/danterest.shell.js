/*
 * danterest.shell.js 
 * Shell module for Danterest
 * The shell of Danterest is responsible for following:
 ** rendering application
 ** managing application state
 ** coordinating feature modules
 */

/*jslint browser: true, continue: true,
    devel: true, indent: 2, maxerr: 50,
    newcap: true, nomen: true, plusplus: true,
    regexp: true, sloppy: true, vars: false,
    white: true
*/

/* required global $, danterest */

danterest.shell = (function () {
  /*** Begin Module Scope Variables ***/
  var configMap = {
        main_html : String()
          +'<div class="danterest-shell-head">'
          +'  <div class="danterest-shell-logo"></div>'
          +'  <div class="danterest-shell-search"></div>'
          +'  <div class="danterest-shell-menu"></div>'
          +'  <div class="danterest-shell-acct"></div>'
          +'  <div class="danterest-shell-setting"></div>'
          +'</div>'
          +'<div class="danterest-shell-main">'
          +'   <div class="danterest-shell-main-nav"></div>'
          +'   <div class="danterest-shell-main-content"></div>'
          +'</div>'
          +'<div class="danterest-shell-chat"></div>'
      },
      stateMap = { $container : null },
      jqueryMap = {},
      setJqueryMap, initModule;
  /*** End Module Scope Variables ***/

  /*** Begin Utility Methods ***/
  /*** End Utility Methods ***/

  /*** Begin DOM Methods ***/
  setJqueryMap = function () {
    $container = stateMap.$container;
    jqueryMap.$container = $container;
  };
  /*** End DOM Methods ***/

  /*** Begin EVENT Handlers ***/
  /*** End EVENT Handlers ***/

  /*** Begin PUBLIC Methods ***/
  initModule = function ( $container ) {
    stateMap.$container = $container;
    stateMap.$container.html(configMap.main_html);
    setJqueryMap();
  };
  return { initModule : initModule };
  /*** End PUBLIC Methods ***/
}());