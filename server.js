var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use(session({
    secret: "myapp",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    
    if (req.session.uniqueUser) {
        res.render('pages/welcome', {
            title: "Welcome",
            user: req.session.uniqueUser
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
            req.session.uniqueUser = username;
            req.session.userId = docs._id;
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
        req.session.uniqueUser = username;
        req.session.userId = docs._id;
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
        user: req.session.uniqueUser
    })
});
app.get('/game', function(req, res) {
    console.log(req.session.userId);
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
    console.log(objId(req.session.userId));
    db.users.find({
        _id: objId(req.session.userId)
    }, function(err, user) {
        console.log(user);
    })
    db.users.update({
        _id: objId(req.session.userId)
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

app.listen(80, function() {
    console.log("Listening on port 80");
});
