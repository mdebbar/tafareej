/**
 * A plugin that writes webpack stats to disk
 */

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

const STATS_PATH = path.join(__dirname, '../stats/');

function writeFileEnsure(filepath, filename /* , data, options, callback */) {
  var args = Array.prototype.slice.call(arguments, 2);
  args.unshift(path.join(filepath, filename));
  
  mkdirp(filepath, function(err) {
    if (err) {
      throw err;
    }
    fs.writeFile.apply(fs, args);
  });
}

module.exports = function() {
  var spaces = this.options.debug ? 2 : 0;
  this.plugin('done', function(stats) {
    var statsJson = stats.toJson();
    writeFileEnsure(
      /* path */     STATS_PATH,
      /* filename */ 'assetsByChunkName.json',
      /* data */     JSON.stringify(statsJson.assetsByChunkName, null, spaces)
    );
  });
};