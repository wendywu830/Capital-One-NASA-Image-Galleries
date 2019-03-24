var express = require('express');
var bodyParser = require('body-parser');
var nasa = require('./api/nasa');

var app = express();

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.render('index');
})

app.get('/home', function (req, res, next) {
  res.render('index');
})

app.post('/search', function(req, res, next) {
  getSearchResults(req, res, next, 'search');
});

app.get('/search', function (req, res, next) {
  res.render('search');
})

app.get('/advanced-search', function (req, res, next) {
  res.render('advanced-search');
})

app.post('/advanced-search', function(req, res, next) {
  getSearchResults(req, res, next, 'advanced-search');
});

var getSearchResults = function(req, res, next, page) {
  var body = req.body;
  var callback = function(error, response) {
    if (error) {
      if (error.message === 'empty') {
        res.render(page);
      }
    } else {
      res.render(page, {searchResults: JSON.parse(response.JSON).collection.items});
    }
  }
  var searchResults = function(body, callback) {
      nasa.imageSearch(body, function (error, response, body) {
      if (error != null) {
        callback(error, null);
      } else if (response.statusCode != 200) {
        callback(new Error('Status code not 200'), null);
      } else {
        callback(null, {JSON: body});
      }
    });
  }
  searchResults(body, callback);
}


app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
