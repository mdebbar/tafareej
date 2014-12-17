module.exports = function(url) {
  var tag = document.createElement('script');
  tag.src = url;
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
