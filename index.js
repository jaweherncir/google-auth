const express=require('express')
const path =require('path')
const app=express()
const passport=require('passport')
const session = require('express-session');
require('./auth')
app.use(express.json())
app.use(express.static(path.join(__dirname,"client")))
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}
app.get('/',(req,res)=>{
res.sendFile('index.html')
})
app.use(session({
    secret:'mysecret',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))
app.use(passport.initialize());

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));
app.get('/auth/google/failure',(req,res)=>{
    console.log("somthing went worrng")
})
app.get('/auth/protected',isLoggedIn,(req,res)=>{
    let name = req.user.displayName();
    console.log(`Hello ${name}`);
    res.send(`Hello ${name}`);
})

app.get('/auth/logout',(req,res)=>{
req.session.destroy();
res.send('see you again')
})






app.listen(5000,()=>{
    console.log("listening")
})


