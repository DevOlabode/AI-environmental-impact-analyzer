const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const path = require('path')

const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

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


const ExpressError = require('./utils/expressError');


app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning')
    next();
});


app.get('/', (req, res)=>{
    req.flash('success', 'The Homepage')
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