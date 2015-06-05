/*
 * danterest.chat.js 
 * Chat feature module for Danterest
 * The chat of Danterest is responsible for following:
 ** rendering chat component
 ** responding to events associated with chat component
 */

/*jslint browser: true, continue: true,
    devel: true, indent: 2, maxerr: 50,
    newcap: true, nomen: true, plusplus: true,
    regexp: true, sloppy: true, vars: false,
    white: true
*/

/* required global: $, danterest */
/* required module: danterest.util, danterest.util_b */

danterest.chat = (function () {
	/*** Begin Module Scope Variables ***/
  var configMap = {
      settable_map : {
        slider_open_time    : true,
        slider_close_time   : true,
        slider_opened_em    : true,
        slider_closed_em    : true,
        slider_opened_title : true,
        slider_closed_title : true,

        chat_model      : true,
        people_model    : true,
        shell_set_chat_anchor : true
      },

      slider_open_time     : 250,
      slider_close_time    : 250,
      slider_opened_em     : 18,
      slider_closed_em     : 2,
      slider_opened_title  : 'Tap to close',
      slider_closed_title  : 'Tap to open',
      slider_opened_min_em : 10,
      window_height_min_em : 20,

      shell_set_chat_anchor : null
    },
    stateMap = {
      $container : null,
      position_type : 'closed'
    },
    jqueryMap = {},
    setJqueryMap, setSliderPosition,
    onTapToggle,
    configureModule, initModule;
  /*** End Module Scope Variables ***/

  /*** Begin Utility Methods ***/
  /*** End Utility Methods ***/

  /*** Begin DOM Methods ***/

  /* DOM method /setJqueryMap/
   * Purpose: set jqueryMap
   * Arguments: None
   * Returns: None
   */
  setJqueryMap = function () {
    jqueryMap = {
      $container : stateMap.$container,
      $window : $(window)
    };
  };

  /* DOM & Public method /setSliderPosition/
   * Purpose: move slider to the requested position
   * Arguments:
   *  * position_type - slider's requested position
   *  * callback - optional callback to be run at the end of 
   *  *   slider move animation
   * Returns: 
   *  * true - succeeded
   *  * false - failed
   */
  setSliderPosition = function (position_type, callback) {
    var height_px, animation_time, slider_title;
    if (position_type === stateMap.$position_type ){
      return false;
    }

    switch (position_type){
      case 'opened' :
        height_px =
          danterest.util_b.getEmSize(configMap.slider_opened_em);
        animation_time = configMap.slider_open_time;
        slider_title = configMap.slider_opened_title;
        break;
      case 'closed' :
        height_px =
          danterest.util_b.getEmSize(configMap.slider_closed_em);
        animation_time = configMap.slider_close_time;
        slider_title = configMap.slider_closed_title;
        break;
      case 'hidden' :
        height_px = 0;
        slider_title = '';
        animation_time = configMap.slider_close_time;
        break;
      default : return false;
    }

    stateMap.position_type = 'sliding...';
    jqueryMap.$container.animate(
      {height : height_px}, animation_time,
      function () {
        jqueryMap.$container.prop('title',slider_title);
        stateMap.position_type = position_type;
        if (callback) {
          callback(jqueryMap.$container);
        }
      }
    );
    return true;
  };

  /*** End DOM Methods ***/

  /*** Begin EVENT Handlers ***/
  onTapToggle = function (event) {
    if (stateMap.position_type == "opened") {
      configMap.shell_set_chat_anchor("closed");
      console.log("to be closed");
    }
    else if(stateMap.position_type == "closed"){
      configMap.shell_set_chat_anchor("opened");
      console.log("to be opened");
    }
    return false;
  };
  /*** End EVENT Handlers ***/

  /*** Begin PUBLIC Methods ***/

  /* Public method /configModule/
   * Purpose: set attributes of `input` into `configMap.configMap`
   *  if their keys are in `configMap.settable_map`
   * Arguments:
   *  * input - map of key-values to set in config
   * Returns: 
   *  * true - succeeded
   *  * false - failed
   */
  configModule = function (input) {
    try {
      danterest.util.setConfigMap(
        input, configMap.settable_map,
        configMap);
      return true;
    }
    catch (error) {
      console.log("configModule failed: "
        + error.name + ": " + error.message);
      return false;
    }
  };

  /* Public method /initModule/
   * Purpose: 
   *  * render chat module
   *  * register event listener
   * Arguments:
   *  * $container - container DOM element
   * Returns: None
   */
  initModule = function ($container) {
    if ($container === undefined){
      throw danterest.util.makeError('Undefined Container',
            'cannot initiate CHAT module with undefined container');
    }
    //render chat module
    stateMap.$container = $container;
    stateMap.position_type = 'closed';
    setJqueryMap();

    //register event listener
    stateMap.$container.bind('utap', onTapToggle);
    //stateMap.$container.click(onTapToggle);
  };
  /*** End PUBLIC Methods ***/

  return {
    configModule : configModule,
    initModule : initModule
  };
}());