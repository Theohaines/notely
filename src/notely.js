const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv').config();

//notes
const createnote = require('./scripts/createnote.js');
const savenote = require('./scripts/savenote.js');
const listnotes = require('./scripts/listnotes.js');
const loadnote = require('./scripts/loadnote.js');
const deletenote = require('./scripts/deletenote.js');

//tags
const addtag = require('./scripts/tags/addtag.js');
const loadtags = require('./scripts/tags/loadtags.js');
const removetag = require('./scripts/tags/removetag.js');

//accounts
const signup = require('./scripts/account/signup.js');
const login = require('./scripts/account/login.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const requireAuth = (req, res, next) => {
    if (req.session.authtoken || process.env.NOACCOUNT == "true") {
        next();
    } else {
        message = "Account is required when using the offical NOTELY site!";
        res.send({"message" : message});
    }
}

app.use('/', express.static(path.resolve('src/public')));
app.use('/media', express.static(path.resolve('src/public/media')));
app.use('/scripts', express.static(path.resolve('src/public/scripts')));
app.use('/styles', express.static(path.resolve('src/public/styles')));

app.use('/landing', express.static(path.resolve('src/public/pages/landing')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/public/pages/landing/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log("listening on", process.env.PORT);
});

app.use('/createnote', requireAuth, async function (req, res){
    var message = await createnote.createNote(req.body.name, req.session.authtoken);

    res.json({"message" : message});
});

app.use('/savenote', requireAuth, async function (req, res){
    var message = await savenote.saveNote(req.session.authtoken, req.body.UUID, req.body.body);

    res.json({"message" : message});
});

app.use('/listnotes', requireAuth, async function (req, res){
    var notes = await listnotes.listNotes(req.session.authtoken);

    res.json({notes});
});

app.use('/loadnote', requireAuth, async function (req, res){
    var note = await loadnote.loadNote(req.session.authtoken, req.body.UUID);

    res.json(note);
});

app.use('/deletenote', requireAuth, async function (req, res){
    var message = await deletenote.deleteNote(req.session.authtoken, req.body.UUID);

    res.json(message);
});

//TAGS

app.use('/addtag', requireAuth, async function (req, res){
    var message = await addtag.addTag(req.session.authtoken, req.body.UUID, req.body.tag);

    res.json(message);
});

app.use('/loadtags', async function (req, res){
    var message = await loadtags.loadTags(req.body.name);

    res.json(message);
});

app.use('/removetag', async function (req, res){
    var message = await removetag.removeTag(req.session.authtoken, req.body.UUID, req.body.tag);

    res.json(message);
});

//ACCOUNT

app.use('/signup', async function (req, res){
    var message = await signup.signup(req.body.email, req.body.password);

    res.json(message);
});

app.use('/login', async function (req, res){
    if (process.env.NOACCOUNT == "true"){
        req.session.authtoken = "local";
        res.json({"message" : "Logged in"})
    }

    var message = await login.login(req.body.email, req.body.password);

    if (message == "Account Loggedin"){
        req.session.authtoken = req.body.email;
    }

    res.json(message);
});

app.use('/logout', requireAuth, async function (req, res){
    var message = "logged out";

    req.session.destroy();

    res.json(message);
});
