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
          +'<div class="danterest-shell-foot"></div>'
      },
      stateMap = { $container : null },
      jqueryMap = {},
      setChatAnchor,
      setJqueryMap, initModule;
  /*** End Module Scope Variables ***/

  /*** Begin Utility Methods ***/
  /*** End Utility Methods ***/

  /*** Begin Callbacks ***/
  
  /* Begin callback method /setChatAnchor/
   * Example  : setChatAnchor( 'closed' );
   * Purpose  : Change the chat component of the anchor
   * Arguments:
   *  * position_type - may be 'closed' or 'opened'
   * Action   :
   * Changes the URI anchor parameter 'chat' to the requested
   *  value if possible.
   * Returns  :
   * * true  - requested anchor part was updated
   * * false - requested anchor part was not updated
   */
  setChatAnchor = function (position_type) {
    console.log("in danterest.shell.setChatAnchor: "+position_type);
  };
  /*** End Callbacks ***/

  /*** Begin DOM Methods ***/
  setJqueryMap = function () {
    $container = stateMap.$container;
    jqueryMap.$container = $container;
    jqueryMap.$chat_container = $container.find('.danterest-shell-chat');
    if($container === undefined){
      throw danterest.util.makeError('Undefined Container',
            'cannot initiate SHELL module with undefined container');
    }
  };
  /*** End DOM Methods ***/

  /*** Begin EVENT Handlers ***/
  /*** End EVENT Handlers ***/

  /*** Begin PUBLIC Methods ***/

  /* Public method /initModule/
   * Purpose: 
   *  * render the shell component, that is, the page
   *  * configure and init other feature components
   * Arguments:
   *  * $container - container DOM element
   * Returns: None
   */
  initModule = function ( $container ) {
    // render container
    stateMap.$container = $container;
    stateMap.$container.html(configMap.main_html);
    setJqueryMap();

    // configure & init feature component
    danterest.chat.configModule(
      {shell_set_chat_anchor : setChatAnchor});
    danterest.chat.initModule(jqueryMap.$chat_container);
  };
  return { initModule : initModule };
  /*** End PUBLIC Methods ***/
}());