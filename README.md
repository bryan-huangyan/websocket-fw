# websocket-fw
A websocket server-client handlers framework based on Nodejs and Express

## Setup develop environment

```
$ npm install
$ gulp
```

## Configuration
Websockets server uses following system environment variables for host and port configuration:
* **WSS_HOST** hostname or ip address to bind the server, default: 0.0.0.0;
* **WSS_PORT** port number to listen with, default: 4080;
* **WSS_EXTURI** external URI for client to connect, default: localhost:4080.

**Example:**
```shell
export WSS_HOST=0.0.0.0
export WSS_PORT=9080
export WSS_EXTURI=wsshost:9080
```

## Implementation
### Server Side
#### Request Handlers
Request Handler is a function to client request (request is in JSON format, in the request must have a attribute "type", which is used to dispatch the request to handlers), example:
```javascript
    function echoHandler(data) {
        data.type = "echoback";
        return data;
    }
```

#### Handler Registering
At the end of [app.js](app.js) after Websockets server started, you can register your handlers like:
```javascript
    wsrv.register("echo", echoHandler);
```

**Note:** You can register the handler type as "*", to handler all request.

### Client Side
Refer to [public/js/wsclient.js](public/js/wsclient.js) and [views/test_wss.pug](views/test_wss.pug) for the example.

## Websockets Tester
Websockets Server embed a websocket testing page, you can browse to http://WSS_HOST:WSS_PORT to use the page.

License
-------------
<a href=/LICENSE target="_blank">Apache License, Version 2.0</a>.
