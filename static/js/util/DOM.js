module.exports = {
  attrFromAsc(node, attr) {
    while (node) {
      var value =  node.getAttribute(attr);
      if (value) {
        return value;
      }
      node = node.parentNode;
    }
  },
};
