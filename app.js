const axios = require('axios');

const data = {
    "message": "你好啊，很高兴能和你聊天，请输出200字，让我测试下流式输出的效果",
    "history": [
        { "role": "user", "parts": "你好,开始聊天,请用简体中文交流" },
        { "role": "model", "parts": "好的收到" }],
    "ai": "gemini",
    "model": "gemini-pro"
}

axios.post('http://localhost:3000/chat', data, {
  responseType: 'stream'
})
  .then(res => {
    res.data.on('data', chunk => {
      console.log(chunk.toString()); 
    });
  });