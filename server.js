"use strict";
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const config = require("./config/config")

const app = express();
app.use(bodyParser.json());
//  return:aiResponse 
app.post('/chat', (userRequest, res, next) => {
    
    let response;
    // 格式通用化
    const userRep = {
        message: userRequest.body.message,
        history: userRequest.body.history,
        model: userRequest.body.model,
        ai:userRequest.body.ai,
        config: userRequest.body.config
    };
    if (!userRep.message) { response = { "err": "no message" } ; }
    if (!userRep.history) { response = { "err": "no history" } ; }
    require(path.format({ dir: path.join(__dirname, './plugin'),name: userRep.ai,ext: '.js'})).getAIchat(userRep,config.chatStream)
        .then(airesponse => {
      if (!airesponse) {
          res.status(500).json({ err: '服务器内部错误' });
          res.end();
        }
            if (config.chatStream) {// 流式输出
                const { PassThrough } = require('stream');
                const stream = new PassThrough();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                stream.pipe(res);
                getStream()
            async function getStream() {
                for await (const chunk of airesponse.stream) {
                stream.write(chunk.text());
                }
                stream.end();
          }
            }else {
             res.json(airesponse);// 非流式
             res.end();
            }
    })
    .catch(next);
    
});
// 启动服务 127.0.0.1:3000/chat 
app.listen(3000, () => {
    console.log('server running on 127.0.0.1:3000/chat');
});
