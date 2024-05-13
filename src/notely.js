const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();

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

