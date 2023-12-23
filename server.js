"use strict";
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');

const config = require("./config/config")

const app = express();
app.use(bodyParser.json());

/**
 * 客户端请求->响应服务器->适配器->中间件处理->客户端
 */

app.post('/v1/models', (userRequest, res) => {

    // 格式通用化
    const userRep = {
        message: userRequest.body.message,
        history: userRequest.body.history,
        model: userRequest.body.model,
        ai: userRequest.body.ai,
        config: userRequest.body.config
    };
    if (!userRep.message) { res.send({ "err": "no message" }); return res.end(); }
    if (!userRep.history) { res.send({ "err": "no history" }); return res.end(); }
    
    // 自动调用适配器
    const aiAdapterPath = path.format({ dir: path.join(__dirname, './adapter'), name: userRep.ai, ext: '.js' })
    const chatAdapter = require(aiAdapterPath)

    // 处理结果
    chatAdapter.getAIchat(userRep, config.ChatStream).then(data => {
    resData(data, res)    
    })

});

// 结果处理
async function resData(response, res) {
    // 错误判断
    if (response.err) {
            console.log(response.err)
            res.send(response);
            return res.end();
        } else if (!response) {
            res.send({ err: '服务器内部错误' });
            return res.end();
    }
        if (config.ChatStream) {// 流式输出
            const { PassThrough } = require('stream');
            const stream = new PassThrough();
            stream.pipe(res);
            for await (const chunk of response.stream) {
                stream.write(chunk.text());
            }
            stream.end();
            return res.end();
        } else {
            res.send(response);// 非流式
            return res.end();
        }

}

// 启动服务 127.0.0.1:8000/chat 
app.listen(config.Port, () => {
    console.log('server running on 127.0.0.1:' + config.Port +'/v1/models');
});