var URI = require('./URI');

var callbackPrefix = '__unexpected_callback_name__';
var id = 0;

var emptyFn = () => {};

// TODO: add the ability to handle failures/errors
window.loadScript = module.exports = function(url, callback, useJsonp) {
  callback = callback || emptyFn;
  var tag = document.createElement('script');
  if (useJsonp) {
    callbackName = callbackPrefix + ++id;
    tag.src = new URI(url, {callback: callbackName}).toString();
    window[callbackName] = callback;

    // clean up the temporary callback
    tag.onload = tag.onerror = function() {
      delete window[callbackName];
    };
  } else {
    tag.src = url;
    tag.onload = callback;
  }
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
