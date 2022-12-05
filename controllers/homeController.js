const express = require('express');

const homeRouter = express();

// home route
exports.getHome = homeRouter.get('/', (req, res) => {
    res.send('Hey there, welcome to exel_comp!');
})