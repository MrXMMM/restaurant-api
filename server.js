require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const multer =require('multer')
const upload = multer({ dest: 'uploads/' })
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

// Enable CORS middleware
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies
    next();
});

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/root"))
app.use('/auth', require('./routes/authRoutes'))
app.use('/employee', require('./routes/empRoutes'))
app.use('/note', require('./routes/noteRoutes'))
app.use('/owner', require('./routes/ownerRoutes'))
app.use('/table', require('./routes/tableRoutes'))
app.use('/order', require('./routes/orderRoutes'))
app.use('/ordermenu', require('./routes/orderMenuRoutes'))
app.use('/menu', require('./routes/menuRoutes'))
app.use('/menucategory', require('./routes/menuCategoryRoutes'))
app.use('/menuaddoncategory', require('./routes/menuAddonCategoryRoutes'))
app.use('/addon', require('./routes/addonRoutes'))
app.use('/addoncategory', require('./routes/addonCategoryRoutes'))
app.use('/forgetpassword', require('./routes/forgetPasswordRoutes'))
app.use('/resetpassword', require('./routes/resetPasswordRoutes'))
app.use('/uploads', express.static('uploads'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "404.html"))
    }
    else if (req.accepts("json")){
        res.json({ message: '404 Not Found' })
    }
    else{
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})

mongoose.connection.on('err', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})