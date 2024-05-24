if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// Requiring important modules
const express = require("express");
const path  = require("path");
const Campground = require("./Model/campgrounds");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./Utils/catchAsync");
const ExpressError = require("./Utils/AppError");
const joi = require("joi");
const {campgroundSchema, reviewSchema} = require("./schemas");
const mongoose  = require("mongoose");
const { PassThrough } = require("stream");
const { error } = require("console");
const Review  = require("./Model/review");
const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/review");
const session = require("express-session");
const flash  = require("connect-flash");
const passport = require("passport");
const localStrategy  = require("passport-local");
const User = require("./Model/user");
const userRouter = require("./routes/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.Mongo_Db_Atlas_connection || 'mongodb://127.0.0.1:27017/yelp-camp';

// Mongo connection
mongoose.connect(dbUrl,{
    
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
}) 

// Setting certain parameters and tools
app.set("views", path.join(__dirname,'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}));


// setting up some security features
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://cdnjs.cloudflare.com"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqkino7im/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// setting mongo store for storing the sessions
const secret = process.env.session_SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

// configuring session
const sessonConfig = {
    store,
    name:"session",
    secret: secret,
    resave:  false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 7*24*60*60_1000 ,
        maxAge:  7*24*60*60_1000
    }

};


app.use(session(sessonConfig));
app.use(flash());


// passport tool config.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// setting to store and destore a user from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// For using layouts
app.engine('ejs', ejsMate);

// starting the server
app.listen(3000,()=>{
    console.log("Server Started!");
})

// middleware for flash
app.use((req,res,next)=>{
    res.locals.currUser = req.user;   
    res.locals.success = req.flash("success");  
    res.locals.error = req.flash("error"); 
    next();      
})           

// using routers for routing
app.use("/campgrounds",campgroundRouter);
app.use("/campgrounds/:id/review",reviewRouter);
app.use("/", userRouter); 
app.use(express.static(path.join(__dirname,'public')));

// Home route
app.get("/",(req,res)=>{
    res.render("Home.ejs");
})

// if some undefinded route is hit
app.all("*", (req,res,next)=>{
    next(new ExpressError("Oops! Page not found :(",404));
})

// error handling , middleware 
app.use((err,req,res,next)=>{
    let {status=400, message="Something is wrong! :)"} = err;
    res.status(status).render("error.ejs",{err});
})


  
