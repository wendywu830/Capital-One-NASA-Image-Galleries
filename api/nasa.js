var request = require('request');

queue = [];

// indicates whether we are about to close the queue
var closing = false;

var i = setInterval(function () {
  if (queue.length > 0) {
    closing = false;
    fn = queue.shift();
    fn();
    console.log('request processed')
  }
}, 1000);

var imageSearch = function (parameter, query, cb) {
  var f = function () {
    var callback = this.cb
    var url = 'https://images-api.nasa.gov/search?' + parameter + '=' + query;
    request(url, function (error, response, body) {
      callback(error, response, body, url);
    });
  }.bind({ cb: cb })
  queue.push(f);
}

var imageSearch = function (body, cb) {
  let parameterQueryList = createParameterQueryList(body);
  console.log(parameterQueryList);

  var f = function () {
    var callback = this.cb
    if (parameterQueryList.length === 0) {
      callback(new Error('empty'), null, null);
    }
    let url = 'https://images-api.nasa.gov/search?';

    parameterQueryList.forEach(function(pair) {
      if (url.charAt(url.length - 1) !== '?') {
        url += '&'
      }
      url = url + pair.parameter + '=' + pair.query;
    });
    request(url, function (error, response, body) {
      callback(error, response, body);
    });
  }.bind({ cb: cb })
  queue.push(f);
}

var createParameterQueryList = function (body) {
  var list = [];
  if (body.term) {
    list.push({parameter: "q", query: body.term});
  }
  if (body.location) {
    list.push({parameter: "location", query: body.location});
  }
  if (body.center) {
    list.push({parameter: "center", query: body.center});
  }
  if (body.year_start) {
    list.push({parameter: "year_start", query: body.year_start});
  }
  if (body.year_end) {
    list.push({parameter: "year_end", query: body.year_end});
  }
  if (body.keywords) {
    list.push({parameter: "keywords", query: body.keywords});
  } 
  if (body.nasa_id) {
    list.push({parameter: "nasa_id", query: body.nasa_id});
  }
  if (body.photographer) {
    list.push({parameter: "photographer", query: body.photographer});
  }
  return list;
}

module.exports = {
  imageSearch: imageSearch
}
