/**
 * danterest.util.js
 * JavaScript non-browser utility library
 * This library is composed of the following:
 ** 
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

danterest.util = (function () {
	var makeError, setConfigMap;
	
	/* Public method /makeError/
	 * Purpose: create error object
	 * Arguments:
	 *	* name_text - name of the error
	 *  * msg_text - long error message
	 *	* data - optional data
	 * Returns: None
	 */
	makeError = function (name_text, msg_text, data) {
		var error = new Error();
		error.name = name_text;
		error.message = msg_text;
		if (data){
			error.data = data;
		}
		return error;
	};

	/* Public method /setConfigMap/
	 * Purpose: set attributes of `input_map` into `config_map`
	 *	if they are in settable_map
	 * Arguments:
	 *	* input_map - map of key-values to set in config
	 *  * settable_map - map of allowable keys to set
	 *	* config_map - map to apply settings to
	 * Returns: None
	 * Throws: Exception if input key not allow
	 */
	setConfigMap = function (
		input_map, settable_map, config_map){
		var key_name, error;

		for (key_name in input_map){
			if (input_map.hasOwnProperty(key_name)){
				if (settable_map.hasOwnProperty(key_name)){
					config_map[key_name] = input_map[key_name];
				}
				else {
					error = makeError('Bad Input',
						'Setting config key |'+key_name+'| is not supported');
					throw error;
				}
			}
		}
	};

	return {
		makeError : makeError,
		setConfigMap : setConfigMap
	};

}());