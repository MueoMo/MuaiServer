"use strict";
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors')
const config = require("./config/config")

const app = express();
app.use(cors());
app.use(bodyParser.json());

//  适配器名 和 模型   
const MODEL_LIST = {
    "gemini": ["gemini-pro", "gemini-pro-vision"],
    "claude":["claude-2.1","claude-2.0","claude-v1.3","claude-v1.3-100k","claude-v1.2"]
}

const listenUrl = config.Listen ? '0.0.0.0' : '127.0.0.1';

// 启动服务
app.listen(config.Port,listenUrl,() => {
    console.log(`Mueai is listening on ${listenUrl}:${config.Port}/v1`);
});

// chat 请求 
app.post('/v1/chat/completions', (userRequest, res) => {
    console.log('Chat Post')
    const userRep = userRequest.body

    if (config.AuthenTication) {
        if (userRep.proxy_password !== config.SeverPassword) {
            res.send({ "err": "password wrong" })
            
        return res.end()
        }
    }

    const chatStream = userRep.stream;
    const AIName = getAIName(userRep.model);
    if (AIName == null) {
        res.send({'err':'not find model'});
        return res.end();
    }
    // 匹配
    const aiAdapterPath = path.format({ dir: path.join(__dirname, './adapter'), name: AIName, ext: '.js' })
    const chatAdapter = require(aiAdapterPath)

    // 处理结果
    chatAdapter.getAIchat(userRep, chatStream).then(data => {
    resData(data, res,chatStream)    
    })
});

// connect 请求
app.get('/v1/models', (userRequest, res) => {
    console.log('----Get Models----')
    

    if (config.AuthenTication) {
    if (userRequest.body.proxy_password !== config.SeverPassword) {
        res.send({"err": "password wrong"})
        return res.end()
        }
    }
    const data = convertToDataList(MODEL_LIST)
    res.send({ data })
    console.log({data})
    console.log('------------------')
    return res.end
})


// 结果处理
async function resData(response, res,chatStream) {
    // 错误判断
    if (response.err) {
            console.log(response.err)
            res.send(response);
            return res.end();
        } else if (!response) {
            res.send({ err: '服务器内部错误' });
            return res.end();
    }
        if (chatStream) {// 流式输出
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

// 获取AI名称
function getAIName(repModel) {
    console.log(`Get AI Name: ${repModel}`);
    for (const [aiName, models] of Object.entries(MODEL_LIST)) {
        if (models.includes(repModel)) {
            console.log(`AI Name:  ${aiName}`)
            return aiName
        }
    }
    return '';
}

// 格式化模型列表
function convertToDataList(model_list) {
    const data = [];
     for (const [ai, models] of Object.entries(model_list)) {
    for (const model of models) {data.push({id: model}); }}
    return data;
}