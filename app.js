const axios = require('axios');
const config = require('./config/config')

const data = {
    "message": "你好啊，很高兴能和你聊天，请输出200字，让我测试下流式输出的效果",
    "history": [
        { "role": "user", "parts": "你好,开始聊天,请用简体中文交流" },
        { "role": "model", "parts": "好的收到" }],
    "ai": "gemini",
    "model": "gemini-pro"
}
function streamPost() {
  axios.post('http://localhost:8000/v1/models', data, {
    responseType: 'stream'
  }).then(res => {
    // 处理错误
    if (res.status >= 400) {
      console.log(res.data.err);
    } else {
      res.data.on('data', chunk => {
        console.log(chunk.toString());
      });
    }
    
  });
}
function post() {
  axios.post('http://localhost:8000/v1/models', data).then(res => {
    if (res.data.err) {
      console.log(res.data.err.err)
    } else {
      console.log(res.data.text)
    }

  });
}
if (config.ChatStream) {
  streamPost()
} else {
  post()
}
