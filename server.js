const express = require('express');
const  bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('danilovaDB',['users']);
const session = require('express-session');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret : "myapp",
    resave : true,
    saveUninitialized : true
}));
app.use(express.static(__dirname + '/public'));
app.get('/',function (req,res) {
    if (session.uniqueUser) {
        res.render('pages/welcome',{
            title : "Welcome",
            user:session.uniqueUser
        })
    }else{
        res.render('pages/loginForm',{
            title : "Login Form"
        });
    }
});
app.get('/login',function (req,res) {
    res.render('pages/loginForm',{
        title : "Login Form"
    });
});
app.post('/login',function (req,res) {
    let username = req.body.username;
    let password = req.body.password;
    db.users.findOne({username : username,password:password},function (err,docs) {
        console.log(docs)
        if(err) throw err;
        if(docs){
            session.uniqueUser = username;
            res.redirect('/welcome');
        }else{
            res.redirect('/login');
        }
    })
});
app.get('/logout',function (req,res) {
    req.session.destroy();
    res.redirect('/login');
})
app.get('/register',function (req,res) {
   res.render('pages/registerForm',{
       title : "Registration Form"
   });
});
app.get('/welcome',function (req,res) {
   res.render('pages/welcome',{
       title : "Welcome Page",
       user : session.uniqueUser
   })
});
app.get('/game',function (req,res) {
    res.render('pages/game');
});
app.listen(3000,function () {
    console.log("Listening on port 3000");
});