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
    main_html : String()
      +'<div class="danterest-chat">'
      + '<div class="danterest-chat-head">'
      + '  <div class="danterest-chat-head-toggle">+</div>'
      + '  <div class="danterest-chat-head-title">Chat</div>'
      + '</div>'
      + '<div class="danterest-chat-closer">X</div>'
      + '<div class="danterest-chat-sizer">'
      + '  <div class="danterest-chat-msg">Msg....</div>'
      + '  <div class="danterest-chat-box">'
      + '    <input type="text"/>'
      + '    <div>Send</div> '
      + '  </div>   '
      + '</div>'
      +'</div>',

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
      $slider : null,
      position_type : 'closed',
      px_per_em : 0,
      slider_closed_px : 0,
      slider_opened_px : 0
    },

    jqueryMap = {},
    setJqueryMap, setSliderPosition, setPxSizes,
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
      $slider : stateMap.$slider,
      $head   : stateMap.$slider.find( '.danterest-chat-head' ),
      $toggle : stateMap.$slider.find( '.danterest-chat-head-toggle' ),
      $title  : stateMap.$slider.find( '.danterest-chat-head-title' ),
      $sizer  : stateMap.$slider.find( '.danterest-chat-sizer' ),
      $msg   : stateMap.$slider.find( '.danterest-chat-msg' ),
      $box    : stateMap.$slider.find( '.danterest-chat-box' ),
      $input  : stateMap.$slider.find( '.danterest-chat-input input[type=text]'),
      $window : $(window)
    };
  };

  /* DOM method /setPxSizes/
   * Purpose: set `slider_XX_px` and height of `jQueryMap.$sizer`
   *    in stateMap based on current window size.
   * Action: Changes stateMap
   * Arguments: None
   * Returns: None
   */
  setPxSizes = function () {
    var px_per_em, window_height_em, opened_height_em;

    px_per_em = danterest.util_b.
      getEmSize(jqueryMap.$slider.get(0));
    window_height_em = Math.floor(
      jqueryMap.$window.height() / px_per_em) + 0.5;

    opened_height_em =
      window_height_em > configMap.window_height_min_em
        ? configMap.slider_opened_em
        : configMap.slider_opened_min_em;

    jqueryMap.$sizer.css({
      height : (opened_height_em - 2) * px_per_em
    });

    stateMap.px_per_em = px_per_em;
    stateMap.slider_closed_px = 
      configMap.slider_closed_em * px_per_em;
    stateMap.slider_opened_px = 
      opened_height_em * px_per_em;
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
    var height_px, animation_time, slider_title, px_per_em,
      toggle_text;
    if (position_type === stateMap.$position_type ){
      return true;
    }

    switch (position_type){
      case 'opened' :
        height_px = stateMap.slider_opened_px;
        animation_time = configMap.slider_open_time;
        slider_title = configMap.slider_opened_title;
        toggle_text = "=";
        break;
      case 'closed' :
        height_px = stateMap.slider_closed_px;
        animation_time = configMap.slider_close_time;
        slider_title = configMap.slider_closed_title;
        toggle_text = "+";
        break;
      case 'hidden' :
        height_px = 0;
        slider_title = '';
        animation_time = configMap.slider_close_time;
        toggle_text = "+";
        break;
      default : return false;
    }

    stateMap.position_type = 'sliding...';
    jqueryMap.$slider.animate(
      {height : height_px}, animation_time,
      function () {
        jqueryMap.$toggle.prop('title',slider_title);
        jqueryMap.$toggle.text( toggle_text);
        stateMap.position_type = position_type;
        if (callback) {
          callback(jqueryMap.$slider);
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
    $container.append(configMap.main_html);
    stateMap.$container = $container;
    stateMap.$slider = $container.find( '.danterest-chat' );
    stateMap.position_type = 'closed';
    setJqueryMap();
    setPxSizes();

    //register event listener
    jqueryMap.$head.bind('utap', onTapToggle);
    //stateMap.$container.click(onTapToggle);
  };
  /*** End PUBLIC Methods ***/

  return {
    configModule : configModule,
    initModule : initModule,
    setSliderPosition : setSliderPosition
  };
}());