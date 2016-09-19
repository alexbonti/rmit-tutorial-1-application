/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();


var watson = require('watson-developer-cloud');


var api_key='';
if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  for (var service_name in services) {
    if (service_name.indexOf('alchemy_api') === 0) {
      var service = services[service_name][0];
      api_key=service.credentials.apikey
    }
  }
}


var alchemy_language = watson.alchemy_language({
  api_key: api_key
});






var sentiment = require('sentiment');
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/sentiment', function (req, res) {
  var message=req.body.message;

  var parameters = {
    extract: 'keywords',
    sentiment: 1,
    maxRetrieve: 1,
    text: message
  };

  alchemy_language.combined(parameters, function (err, response) {
    if (err)
      console.log('error:', err);
    else
        var sentimentMessage=response.keywords[0].sentiment//JSON.stringify(response.keywords[0].sentiment.score);
        //res.json({ message: message,sentiment:sentimentMessage });
        console.log(JSON.stringify(response));
        if(sentimentMessage!=undefined){
          res.json({ message: message,sentiment:sentimentMessage });
        }else{
          sentimentMessage={
            score:'empty'
          }
          res.json({ message: "empty",sentiment:sentimentMessage});

        }
  });
})

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
