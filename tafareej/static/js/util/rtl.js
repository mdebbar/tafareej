(function(global) {

  const RTL_REGEX = new RegExp(
    '^[^' +
      // exclude LTR chars
      'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF' +
    ']*[' +
      // include RTL chars
      '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC' +
    ']'
  );
  global.isRTL = function(s) {
    return RTL_REGEX.test(s);
  };

  global.markDirection = function(elem) {
    var $elem = elem instanceof $ ? elem : $(elem);
    var text = $elem.val() || $elem.text();
    $elem.removeClass('rtl');
    isRTL(text) && $elem.addClass('rtl');
  };

})(this);
