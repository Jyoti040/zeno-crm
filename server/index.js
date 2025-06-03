require('dotenv').config({
    path:'./.env'
})

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const app=express()

const connectDB = require('./db/connect')

const CustomError = require('./error/CustomError')
const NotFoundMiddleware = require('./middlewares/NotFound.js')
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandler.js')

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:10000',
  'https://zeno-crm.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(cookieParser())
app.use(express.json({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false ,
    cookie: {
       maxAge: 1000 * 60 * 60 * 24, 
    secure: true,            
    httpOnly: true,
    sameSite: 'None'  
  }
}));
app.use(passport.initialize());
app.use(passport.session());

require('./lib/auth/passport.js')

app.get('/',(req,res)=>{
      res.send('Welcome to crm app')
})

require('./routes')(app);

app.use(ErrorHandlerMiddleware)
app.use(NotFoundMiddleware)

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI

const start = async () => {
    try {
        await connectDB(mongoURI)
        console.log('Connected to database')
        app.listen(
            port , ()=>{ console.log(`Server is listening to port - ${port}`)}
        )
        } catch (error) {
        console.log('An error occured while connecting to database ', error)
    }
}

start()