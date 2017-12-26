var request = require('request');
var tress = require('tress');
var fs = require('fs');
var cheerio = require('cheerio');

var results = [];

var q = tress((url, callback) => {
  request(url, (err, res, body) => {
    if (err) throw err;

    const $ = cheerio.load(body);

    $('tbody tr').each(function(index, el) {
      var currentObj = {};

      current = $(this)
        .text()
        .trim()
        .split('\n');

      currentObj.rating = current[0];
      currentObj.name = $(this)
        .children('td:nth-child(2)')
        .text()
        .trim();
      currentObj.city = $(this)
        .children('td:nth-child(3)')
        .text()
        .trim();
      currentObj.country = $(this)
        .children('td:nth-child(3)')
        .children('img')
        .attr('title');

      results.push(currentObj);
    });

    callback();
  });
});

q.drain = function() {
  require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
};

for (var i = 0; i < 1000; i++) {
  var URL = 'https://www.e-olymp.com/ru/users/ranking?page=' + i;
  q.push(URL);
}
