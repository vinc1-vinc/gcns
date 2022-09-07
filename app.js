var express = require('express')
    , bodyParser = require('body-parser')
    , app = express()
    , couchbase = require('couchbase')
    , port = process.env.PORT || 5009
    , compression = require('compression')

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.engine('ejs', require('ejs').__express)
app.set('view engine', 'ejs')

var cluster = new couchbase.Cluster("couchbase://devdb01.suites.digital");
	cluster.authenticate('Administrator','Suites');
var bucket = cluster.openBucket("ops");
bucket.on('error', function(err) {
  console.log(err, err.code);
});

module.exports.bucket = bucket;

app.use(require('./controllers'))
app.use(express.static(__dirname + '/public'))

app.listen(port, function() {
    console.log('Listening on port ' + port)
})


module.exports = app;