'use strict';
/* global process */
/* global __dirname */
/*******************************************************************************
 * Copyright (c) 2016 esse.io.
 *
 * All rights reserved.
 *
 * Contributors:
 *   Bryan HUANG - Initial implementation
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  		 http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *******************************************************************************/

var express = require('express');
var session = require('express-session');
var compression = require('compression');
var serve_static = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var compression = require('compression');
var http = require('http');
var app = express();
var url = require('url');
var async = require('async');

var setup = require('./setup');
var wsrv = require('./ws/wsrv');

//// Set Server Parameters ////
var host = setup.OPTIONS.HOST;
var port = setup.OPTIONS.PORT;

////////  Pathing and Module Setup  ////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.engine('.html', require('pug').__express);
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
function setCustomCC(res, path) {
    if (serve_static.mime.lookup(path) === 'image/jpeg')
        res.setHeader('Cache-Control', 'public, max-age=2592000');        //30 days cache
    else if (serve_static.mime.lookup(path) === 'image/png')
        res.setHeader('Cache-Control', 'public, max-age=2592000');
    else if (serve_static.mime.lookup(path) === 'image/x-icon')
        res.setHeader('Cache-Control', 'public, max-age=2592000');
}
app.use(serve_static(path.join(__dirname, 'public'), {maxAge: '1d', setHeaders: setCustomCC}));                         //1 day cache

// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());
///////////  Configure Webserver  ///////////
app.use(function (req, res, next) {
    var keys;
    console.log('------------------------------------------ incoming request ------------------------------------------');
    console.log('New ' + req.method + ' request for', req.url);
    req.bag = {};                                           //create my object for my stuff
    req.bag.session = req.session;

    var url_parts = url.parse(req.url, true);
    req.parameters = url_parts.query;
    keys = Object.keys(req.parameters);
    if (req.parameters && keys.length > 0)
        console.log({parameters: req.parameters});       //print request parameters
    keys = Object.keys(req.body);
    if (req.body && keys.length > 0)
        console.log({body: req.body});                     //print request body
    next();
});

//// Router ////
var router = require('./routes/site_router');
app.use('/', router);

////////////////////////////////////////////
////////////// Error Handling //////////////
////////////////////////////////////////////
app.use(function (req, res, next) {
    console.log("404 Error Handeler -", req.url);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    console.log(err);
    console.log("Error Handeler -", req.url);
    var errorCode = err.status || 500;
    res.status(errorCode);
    req.bag.error = {msg: err.stack, status: errorCode};
    if (req.bag.error.status == 404)
        req.bag.error.msg = "Sorry, I cannot locate that file";
    req.bag.setup = setup;
    res.render('template/error', {title: 'Websockets tester', bag: req.bag});
});

// ============================================================================================================================
//                                                      Launch Webserver
// ============================================================================================================================
var server = http.createServer(app).listen(port, function () {
});
console.log("Starting web server on port " + port);
server.timeout = 240000;
wsrv.start(server);
console.log("Starting websocket server ...")

// ======================================================
//register your handlers here
wsrv.register("echo", function(data){
    data.type = "echoback";
    return data;
});
