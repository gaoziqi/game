var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var global = {
    "data": {
        "orientation": {"alpha": 0, "beta": 0, "gamma": 0},
        "motion": {"acc": {"x": 0, "y": 0, "z": 0}}
    }
};
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.get('/test', function (req, res) {
    console.log(req.query.name);
});
app.get('/phone', function (req, res) {
    res.sendFile(__dirname + "/public/phone.html");
});
app.post('/phone/orientation', function (req, res) {
    global.data.orientation = req.body;
    res.json(global.data.orientation);
});
app.post('/phone/motion', function (req, res) {
    global.data.motion = req.body;
    res.json(global.data.motion);
});
app.get('/main/data', function (req, res) {
    res.json(global["data"]);
});
app.get('/main', function (req, res) {
    res.sendFile(__dirname + "/public/main.html");
});

var server = app.listen(13017, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});