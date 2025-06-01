require('dotenv').config({
    path:'./.env'
})

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
require('./lib/auth/passport.js')

const app=express()

const connectDB = require('./db/connect')

const CustomError = require('./errors/CustomError')
const NotFoundMiddleware = require('./middlewares/NotFound.js')
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandler.js')

app.use(cors({
     origin: 'http://localhost:5173', credentials: true 
}))
app.use(cookieParser())
app.use(express.json()) 
app.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
      res.send('Welcome to crm app')
})

require('./routes')(app);

app.use(ErrorHandlerMiddleware)
app.use(NotFoundMiddleware)

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"

const start = async () => {
    try {
        await connectDB(mongoURI)
        console.log('Connected to database')
        server.listen(
            port , ()=>{ console.log(`Server is listening to port - ${port} in ${envMode} mode`)}
        )
        } catch (error) {
        console.log('An error occured while connecting to database ', error)
    }
}

start()