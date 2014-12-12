/**
 * A plugin that beeps when a compilation error occurs. This is useful in watch mode.
 */

module.exports = function() {
  this.plugin('done', function(stats) {
    if(stats.hasErrors()) {
      process.stdout.write('\x07');
    }
  });
};