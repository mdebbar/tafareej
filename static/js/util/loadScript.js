module.exports = function(url, callback) {
  var tag = document.createElement('script');
  tag.src = url;
  if (callback) {
    tag.onload = callback;
  }
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
