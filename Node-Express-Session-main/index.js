const express = require("express");
const mongoose = require("mongoose");
const ejs = require('ejs')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/User')
var bcrypt = require('bcryptjs');
const dns = require('node:dns');


const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

function redactMongoUri(uri) {
    if (!uri) return uri;
    try {
        const u = new URL(uri);
        if (u.username || u.password) {
            u.username = u.username ? '***' : '';
            u.password = u.password ? '***' : '';
        }
        return u.toString();
    } catch {
        return uri.replace(/\/\/([^:@/]+)(:([^@/]*))?@/g, '//***:***@');
    }
}

async function preflightMongoSrv(mongoUri) {
    if (!mongoUri || !mongoUri.startsWith('mongodb+srv://')) return;
    let hostname;
    try {
        hostname = new URL(mongoUri).hostname;
    } catch {
        return;
    }

    try {
        await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
    } catch (err) {
        if (err && err.code === 'ECONNREFUSED') {
            throw new Error(
                [
                    `DNS SRV lookup failed for "${hostname}" (querySrv ECONNREFUSED).`,
                    `This is commonly caused by DNS/network policy or Node's SRV resolution on some setups.`,
                    `Fix: use a standard (non-SRV) MongoDB connection string from MongoDB Atlas (Drivers -> "Standard connection string") and set it as MONGO_URI in .env.`
                ].join(' ')
            );
        }
        throw err;
    }
}

async function start() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('Missing env var MONGO_URI in .env');
        process.exit(1);
    }

    try {
        await preflightMongoSrv(mongoUri);
        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error(`MongoDB connect failed for ${redactMongoUri(mongoUri)}`);
        console.error(error?.message || String(error));
        process.exit(1);
    }

    const store = new MongoDBStore({
        uri: mongoUri,
        collection: "mySession"
    });

    store.on('error', (error) => {
        console.error('Session store connection error:');
        console.error(error?.message || String(error));
    });

    app.use(session({
        secret: process.env.SESSION_SECRET || "This is a secret",
        resave: false,
        saveUninitialized: true,
        store: store
    }));

    app.listen(PORT, () => {
        console.log(`Server started and running @ ${PORT}`);
    });
}

const checkAuth = (req, res, next) => {
    if (req.session.isAuthicated) {
        next()
    } else {
        res.redirect('/signup')
    }
}

app.get('/signup', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/dashboard', checkAuth, (req, res) => {
    res.render('welcome')
})

app.post('/register', async(req, res) => {
    const { username, email, password } = req.body

    let user = await User.findOne({ email })
    if (user) {
        return res.redirect('/signup')
    }
    const hashedPassword = await bcrypt.hash(password, 12)

    user = new User({
        username,
        email,
        password: hashedPassword
    })
    req.session.person = user.username
    await user.save()
    res.redirect('/login')

})

app.post('/user-login', async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.redirect('/signup')
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.redirect('/signup')
    }
    req.session.isAuthicated = true
    res.redirect('/dashboard')

})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/signup')
    })
})

start();
