/**
 * danterest.util_b.js
 * JavaScript browser utility library
 * This library is composed of the following:
 ** getEmSize: get size of em in px
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/* required global $, spa, getComputedStyle */

danterest.util_b = (function () {
  var getEmSize;

  getEmSize = function (elem) {
    return Number(
      getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0] );
  };

  return {
    getEmSize : getEmSize
  };
}());