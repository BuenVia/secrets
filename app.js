//jshint esversion:6
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const encrypt = require('mongoose-encryption')

dotenv.config()

const app = express()
let port = 3000

app.set('view engine', 'ejs')
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_DB)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })


const User = new mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save((err) => {
        if(err) {
            console.log(err);
        } else {
            res.render('secrets')
        }
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne( { email: username }, (err, foundUser) => {
        if (err) {
            console.error(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets')
                }
            }
        }
    })

})

app.listen(port, (req, res) => {
    console.log(`App is listening on port: ${port}`)
})