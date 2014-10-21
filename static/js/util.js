function emptyFunction() {}

function truncate(text, max, suffix) {
  suffix = suffix || '';
  if (!text) {
    return text;
  }
  return text.length > max ?
    text.slice(0, max) + suffix :
    text;
}
