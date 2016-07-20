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
/////////////////////////////////////////
///////////// Setup Node.js /////////////
/////////////////////////////////////////

var url = require('url');
var async = require('async');
var fs = require("fs");
var ws = require('ws');
var wss = {};
var wapp = {};
var handlers = {}
var async = require('async');

module.exports.start = function (server) {
    wss = new ws.Server({server: server});

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received ws msg:', message);
            var data = JSON.parse(message);
            process_msg(ws, data);
        });

        ws.on('close', function () {
        });
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            try {
                data.v = '2';
                client.send(JSON.stringify(data));
            }
            catch (e) {
                console.log('error broadcast ws', e);
            }
        });
    };

};

module.exports.register = function (dataType, handler) {
    console.log(' - Registering handler for', dataType);
    handlers[dataType] = handler;
};

module.exports.broadcast = function (data) {
    wss.broadcast(data);
}

module.exports.sendMessage = function (data) {
    function sendMsg(json) {
        if (ws) {
            try {
                ws.send(JSON.stringify(json));
            } catch (e) {
                console.log('error ws', e);
            }
        }
    }
}

//processing the websocket messages
function process_msg (ws, data) {
    if (!data.type || data.type === '') {
        sendMsg({type: "error", error: "type not provided in message"});
        return;
    }
    // Process the message
    console.log('message type:', data.type);
    if (handlers[data.type]) {
        var res = handlers[data.type](data);
        sendMsg(res);
        return;
    } else if (handlers['*']) {
        var res = handlers['*'](data);
        sendMsg(res);
        return;
    } else {
        console.log("No handler registered for", data.type);
        sendMsg({type: "error", error: "No handler registered for " + data.type});
        return;
    }
    //send a message, socket might be closed...
    function sendMsg(json) {
        if (ws) {
            try {
                ws.send(JSON.stringify(json));
            } catch (e) {
                console.log('error ws', e);
            }
        }
    }
};
