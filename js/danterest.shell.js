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
          +'<div class="danterest-shell-foot"></div>'
      },
      stateMap = {
        $container : null,
        anchor_map : {}
      },
      jqueryMap = {},
      setChatAnchor,
      setJqueryMap, initModule;
  /*** End Module Scope Variables ***/

  /*** Begin Utility Methods ***/

  /* Utility method /copyAnchorMap/
   * Purpose    : deep copy stateMap.anchor_map
   * Arguments  : None
   * Returns    : None
   */
  copyAnchorMap = function () {
    return $.extend(true, {}, stateMap.anchor_map);
  };

  /* Utility method /deleteFromAnchorMap/
   * Purpose    : delete an item and its dependency from 
   *  stateMap.anchor_map
   * Arguments  : 
   *  * key - the key of the item that needs to be deleted
   *  * map - the map from which items are deleted
   * Returns    : None
   */
  deleteFromAnchorMap = function (key,map) {
    delete map[key];
    delete map['_'+key];
    delete map['_s_'+key];
  };

  /* Utility method /copyAnAnchorBetweenTwoMaps/
   * Purpose    : copy an item and its dependency from 
   *  one anchor map to another
   * Arguments  : 
   *  * key - the key of the item that needs to be copied
   *  * from_map - the source anchor map
   *  * to_map - the destination anchor map
   * Returns    :
   *  * true - succeeded
   *  * false - failed
   */
  copyAnAnchorBetweenTwoMaps = function (key,from_map,to_map) {
    var _key, _s_key;

    if (from_map === to_map){
      return false;
    }
    _key = '_'+key;
    _s_key = '_s'+_key;

    if (key in from_map) {
      to_map[key] = from_map[key];
    }
    if (_key in from_map) {
      to_map[_key] = from_map[_key];
    }
    if (_s_key in from_map) {
      to_map[_s_key] = from_map[_s_key];
    } 
    return true;
  };

  /* Utility method /processChatAnchor/
   * Purpose    : 
   *    process `chat` part of anchor when onHashchange event 
   *    gets fired. This method will NOT modify
   *    stateMap.anchorMap.chat. If new state has error and needs
   *    to revert, it returns the map to be reverted.
   * Arguments  : 
   *  * new_anchor_map - the new anchor map
   * Returns    :
   *  * map - anchor needs to be reverted as specified in map
   *  * null - everything is fine
   */
  processChatAnchor = function (new_anchor_map) {
    var _s_new_chat, _s_previous_chat, is_ok;

    _s_new_chat = new_anchor_map._s_chat;
    _s_previous_chat = stateMap.anchor_map._s_chat;
    if (_s_new_chat === _s_previous_chat ) {
      // nothing needs to change
      return null;
    }

    if (_s_new_chat === undefined ) {
      danterest.chat.setSliderPosition( 'closed' );
      return null;
    }

    switch (new_anchor_map.chat) {
      case 'opened':
        is_ok = danterest.chat.setSliderPosition('opened');
        break;
      case 'closed':
        is_ok = danterest.chat.setSliderPosition('closed');
        break;
      default:
        is_ok = false;
        break;  
    }

    if (!is_ok) {
      //begin revert
      copyAnAnchorBetweenTwoMaps('chat',
        stateMap.anchor_map,new_anchor_map);  
      return new_anchor_map;
    }
    else {
      return null;
    }
  };
  /*** End Utility Methods ***/

  /*** Begin Callbacks ***/
  
  /* callback method /setChatAnchor/
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
    changeAnchorPart({ chat : position_type });
  };
  /*** End Callbacks ***/

  /*** Begin DOM Methods ***/
  setJqueryMap = function () {
    $container = stateMap.$container;
    jqueryMap.$container = $container;
    jqueryMap.$chat_container = $container.find('.danterest-chat');
    if($container === undefined){
      throw danterest.util.makeError('Undefined Container',
            'cannot initiate SHELL module with undefined container');
    }
  };

  /* DOM method /changeAnchorPart/
   * Purpose    : Changes part of the URI anchor component
   * Arguments  :
   *  * arg_map - The map describing what part of the URI anchor
   *    we want changed.
   * Returns    :
   *  * true  - the Anchor portion of the URI was updated
   *  * false - the Anchor portion of the URI could not be updated
   * Actions    :
   *  The current anchor rep stored in stateMap.anchor_map.
   *  See uriAnchor for a discussion of encoding.
   */
  changeAnchorPart = function (arg_map) {
    var new_anchor_map = copyAnchorMap(stateMap.anchor_map),
      key_name, key_name_dep;
    
    for (key_name in arg_map){
      if (arg_map.hasOwnProperty(key_name)){
        if (key_name.indexOf('_') === 0) {
          continue;
        }
        new_anchor_map[key_name] = arg_map[key_name];
        key_name_dep = '_'+key_name;
        if (key_name_dep in arg_map) {
          new_anchor_map[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete new_anchor_map[key_name_dep];
          delete new_anchor_map['_s'+key_name_dep];  
        }
      }
    }
  
    try{
      $.uriAnchor.setAnchor(new_anchor_map);
    }
    catch (error) {
      $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
      return false;
    }
    return true;
  };

  /*** End DOM Methods ***/

  /*** Begin EVENT Handlers ***/
  
  /* Event handler /onHashchange/
   * Purpose    : Handles the hashchange event
   * Arguments  :
   *  * event - jQuery event object.
   * Settings   : none
   * Returns    : false
   * Actions    :
   *  * Parses the URI anchor component
   *  * Compares proposed application state with current
   *  * Adjust the application only where proposed state
   *  *   differs from existing and is allowed by anchor schema
   */
  onHashchange = function (event) {
    var previous_anchor_map = copyAnchorMap(stateMap.anchor_map),
      new_anchor_map, _s_new_chat, _s_previous_chat, revert_anchor_map;

    try {
      new_anchor_map = $.uriAnchor.makeAnchorMap();
    }
    catch (error) {
      $.uriAnchor.setAnchor(previous_anchor_map, null, true);
      return false;
    }

    /*** begin chat anchor ***/
    _s_new_chat = new_anchor_map._s_chat;
    _s_previous_chat = stateMap.anchor_map._s_chat;
    if (_s_new_chat !== _s_previous_chat ) {
      revert_anchor_map = processChatAnchor(new_anchor_map);
      if (revert_anchor_map != null) {
        console.log("revert to previous map: "+revert_anchor_map.chat);
        $.uriAnchor.setAnchor(revert_anchor_map, null, true);
        return false;
      }
    }
    /*** end chat anchor ***/

    /*** begin other anchor ***/
    //TODO: tests are required here
    /*** end other anchor ***/

    stateMap.anchor_map = new_anchor_map;
    return true;
  };

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
    danterest.chat.initModule(jqueryMap.$container);

    //register event handler
    $(window)
      .bind('hashchange',onHashchange)
      .trigger('hashchange');
  };
  return { initModule : initModule };
  /*** End PUBLIC Methods ***/
}());