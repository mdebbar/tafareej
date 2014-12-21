var Bloodhound = require('../3rdparty/typeahead').Bloodhound;
var URL = require('./URL');

// A predefined bloodhound engine with default parameters.
// TODO: make this more configurable
module.exports = new Bloodhound({
  name: 'autocomplete',
  // local: [...] // pre-fill this with some data for fast lookup
  // prefetch: url // maybe use this instead of local
  remote: {
    url: URL.API.autocomplete('%QUERY'),
    ajax: {
      dataType: 'jsonp',
    },
    // response == [query, results, other]
    filter: (response) => response[1].map(
      function(result) { return {value: result[0]}; }
    ),
  },
  datumTokenizer: (d) => Bloodhound.tokenizers.whitespace(d.value),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 6,
  dupDetector: (match1, match2) => match1.value === match2.value,
});
