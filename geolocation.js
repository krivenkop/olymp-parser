var fs = require('fs');
var request = require('request');
var tress = require('tress');
var axios = require('axios');
var API_KEY = require('./export/API.js');
var API_ADDRESS = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
var currentLocation, data;

var q = tress((job, callback) => {
  currentLocation = {};
  url = API_ADDRESS + job.city + ',' + job.country + '&key=' + API_KEY();
  console.log('URL: ', url);
  request.get(
    url,
    {
      'user-agent':
        'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36',
    },
    (err, res, body) => {
      console.log('ITS a Body: ', body);
      data = JSON.parse(body);
      if (!err && data.status === 'OK') {
        console.log('Norm');
        currentLocation = data.results[0].geometry.location;
        obj[i].location = currentLocation;
        setTimeout(callback, 5000);
      } else if (data.status !== 'OK') {
        console.log('Zhopa');
        setTimeout(callback, 5000);
      } else console.log('HTTP Zhopa');
    }
  );
});

q.drain = function() {
  require('fs').writeFileSync(
    './results.json',
    JSON.stringify(results, null, 4)
  );
};

for (var i in obj) {
  q.push({ index: i, city: obj[i].city, country: obj[i].country });
}
