var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('danilovaDB', ['users']);
var session = require('express-session');
var objId = mongojs.ObjectId;

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "myapp",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    if (session.uniqueUser) {
        res.render('pages/welcome', {
            title: "Welcome",
            user: session.uniqueUser
        })
    } else {
        res.render('pages/loginForm', {
            title: "Login Form"
        });
    }
});
app.get('/login', function(req, res) {
    res.render('pages/loginForm', {
        title: "Login Form"
    });
});
app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.users.findOne({
        username: username,
        password: password
    }, function(err, docs) {

        if (err) throw err;
        if (docs) {
            session.uniqueUser = username;
            session.userId = docs._id;
            res.redirect('/welcome');
        } else {
            res.redirect('/login');
        }
    })
});
app.post('/saveUser', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.users.insert({
        username: username,
        password: password,
        points: 0,
        level: 1
    }, function(err, docs) {

        if (err) res.redirect('/errorPage');
        session.uniqueUser = username;
        session.userId = docs._id;
        res.redirect('/welcome');
    })
})
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
})
app.get('/register', function(req, res) {
    res.render('pages/registerForm', {
        title: "Registration Form"
    });
});
app.get('/welcome', function(req, res) {
    res.render('pages/welcome', {
        title: "Welcome Page",
        user: session.uniqueUser
    })
});
app.get('/game', function(req, res) {
    console.log(session.userId);
    db.users.find({}, function(err, docs) {
        if (err) throw err;
        res.render('pages/game', {
            docs: docs
        });
    })
});
app.post("/savePoints", function(req, res) {
    var points = parseInt(req.body.points);
    console.log(points);
    console.log(objId(session.userId));
    db.users.find({
        _id: objId(session.userId)
    }, function(err, user) {
        console.log(user);
    })
    db.users.update({
        _id: objId(session.userId)
    }, {
        $inc: {
            points: +points
        }
    }, function(err, docs) {
        if (err) throw err;
        console.log(docs);
        res.send("Updated");
    });
})
var port = process.env.port || 3000;
app.listen(port, function() {
    console.log("Listening on port 3000");
});