/* global process */
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

 exports.OPTIONS = {
    HOST: process.env.WSS_HOST || '0.0.0.0',
    PORT: process.env.WSS_PORT || 4080,
    EXTURI: process.env.WSS_EXTURI || 'localhost:4080',
    DESCRIPTION: 'A websocket server-client handlers framework based on Nodejs and Express'
};
