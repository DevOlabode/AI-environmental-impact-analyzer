const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path')

const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');

const passport = require('passport');
const localStrategy = require('passport-local');

const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');
const receiptRoutes = require('./routes/reciept')

const ExpressError = require('./utils/expressError');

const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/environmental-analyser')
    .then(() => {
        console.log("Mongo Connection Open")   
    }).catch((err) => {
        console.log("Error", err)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const sessionConfig = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    Cookie : {
        httpOnly: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning')
    next();
});

app.use('/', authRoutes);
app.use('/form', formRoutes);
app.use('/form', receiptRoutes);


app.get('/', (req, res)=>{
    res.render('home')
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something Went Wrong!'
    }
    res.status(statusCode).render('error', {err})
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});