//required packages
const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv").config();

//notes
const createnote = require("./scripts/createnote.js");
const savenote = require("./scripts/savenote.js");
const listnotes = require("./scripts/listnotes.js");
const loadnote = require("./scripts/loadnote.js");
const deletenote = require("./scripts/deletenote.js");

//tags
const addtag = require("./scripts/tags/addtag.js");
const loadtags = require("./scripts/tags/loadtags.js");
const removetag = require("./scripts/tags/removetag.js");

//accounts
const signup = require("./scripts/account/signup.js");
const login = require("./scripts/account/login.js");

//toolkit
const toolkit = require("./scripts/reuseable/toolkit.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);

const requireAuth = (req, res, next) => {
    if (req.session.authtoken || process.env.NOACCOUNT == "true") {
        next();
    } else {
        message =
            "E018: An account is required when using the official NOTELY site. If this is a locally hosted instance please check the localhost guide on Github.";
        res.send({ message: message });
    }
};

app.use("/", express.static(path.resolve("src/public")));
app.use("/media", express.static(path.resolve("src/public/media")));
app.use("/scripts", express.static(path.resolve("src/public/scripts")));
app.use("/styles", express.static(path.resolve("src/public/styles")));

app.use("/landing", express.static(path.resolve("src/public/pages/landing")));
app.use("/about", express.static(path.resolve("src/public/pages/about")));
app.use("/tos", express.static(path.resolve("src/public/pages/tos")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("src/public/pages/landing/index.html"));
});

app.listen(process.env.PORT, () => {
    console.log("listening on", process.env.PORT);
});

app.use("/createnote", requireAuth, async function (req, res) {
    var code = await createnote.createNote(
        req.body.name,
        req.session.authtoken,
    );

    res.json({ message: await toolkit.transalateMessage(code) });
});

app.use("/savenote", requireAuth, async function (req, res) {
    var code = await savenote.saveNote(
        req.session.authtoken,
        req.body.UUID,
        req.body.body,
    );

    res.json({ message: await toolkit.transalateMessage(code) });
});

app.use("/listnotes", requireAuth, async function (req, res) {
    var notes = await listnotes.listNotes(req.session.authtoken);

    res.json({ notes });
});

app.use("/loadnote", requireAuth, async function (req, res) {
    var note = await loadnote.loadNote(req.session.authtoken, req.body.UUID);

    res.json(note);
});

app.use("/deletenote", requireAuth, async function (req, res) {
    var code = await deletenote.deleteNote(
        req.session.authtoken,
        req.body.UUID,
    );

    res.json(await toolkit.transalateMessage(code));
});

//TAGS

app.use("/addtag", requireAuth, async function (req, res) {
    var code = await addtag.addTag(
        req.session.authtoken,
        req.body.UUID,
        req.body.tag,
    );

    res.json(await toolkit.transalateMessage(code));
});

app.use("/loadtags", async function (req, res) {
    var message = await loadtags.loadTags(req.body.name);

    res.json(message);
});

app.use("/removetag", async function (req, res) {
    var code = await removetag.removeTag(
        req.session.authtoken,
        req.body.UUID,
        req.body.tag,
    );

    res.json(await toolkit.transalateMessage(code));
});

//ACCOUNT

app.use("/signup", async function (req, res) {
    try {
        var captchaResponse = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${process.env.GRECAPTCHASECRET}&response=${req.body.token}`,
            },
        );

        let captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
            return res.json(await toolkit.transalateMessage("E020"));
        }
    } catch (err) {
        return res.json(await toolkit.transalateMessage("E021"));
    }

    var code = await signup.signup(req.body.email, req.body.password);

    res.json(await toolkit.transalateMessage(code));
});

app.use("/login", async function (req, res) {
    if (process.env.NOACCOUNT == "true") {
        req.session.authtoken = "local";
        res.json({ message: "Logged in" });
    }

    var code = await login.login(req.body.email, req.body.password);

    if (code == "I006") {
        req.session.authtoken = req.body.email;
    }

    res.json(await toolkit.transalateMessage(code));
});

app.use("/logout", requireAuth, async function (req, res) {
    try {
        req.session.destroy();
    } catch {
        res.json(await toolkit.transalateMessage("I022"));
    }

    res.json(await toolkit.transalateMessage("I008"));
});
