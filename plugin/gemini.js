/**
 * 示例插件
 * 插件命名: ai.js(如gemini.js)
 * 必须包含
 * 格式化函数(起始函数) getAIchat
 * 获取聊天函数 getAIChatResponse
 * 流式获取AI函数 streamGetAIChatResponse
 * 
 * 只需导出getAIchat
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI("");// API(必填)
/**
 * @param userRequest 用户传入的格式
 * @return response流或response
 */
async function getAIchat(userRequest,chatStream = true) {
    const geminiReq = {
        message: userRequest.message,
        history: userRequest.history,
        model : userRequest.model,
        config: userRequest.config
    };
    if (chatStream) {
        return getAIChatstream(geminiReq);
    } else {
        return getAIChatResponse(geminiReq);
    }
}

/**
 * @function getAIChatResponse 正常获取信息
 * @param geminiReq 适配gemini的参数
 * @return 官方返回的response
 */
async function getAIChatResponse(geminiReq) {
    try {
        console.log("start get response")
        const config = geminiReq.config
        const aiModel = geminiReq.model
        const model = genAI.getGenerativeModel({ model: aiModel,config});
        const chat = model.startChat({
            history: geminiReq.history,
            generationConfig: { maxOutputTokens: 1000, },
        });
        const result = await chat.sendMessage(geminiReq.message)
        const response = await result.response
        console.log(response.text())
        return response
    } catch (error) {
        const response = { "err": error.message }
        return response
    }
}
/**
 * @function getAIChatstream 流式传输获取信息
 * @param geminiReq 适配gemini的格式
 * @return 官方返回的response流
 */
async function getAIChatstream(geminiReq) {
    try {
        console.log("start get stream response")
        const config = geminiReq.config
        const aiModel = geminiReq.model
        const model = genAI.getGenerativeModel({ model: aiModel,config});
        const chat = model.startChat({
            history: geminiReq.history,
            generationConfig: { maxOutputTokens: 1000, },
        });
        console.log("get message stream")
        const response = await chat.sendMessageStream(geminiReq.message);
        console.log(response)
        console.log('return stream')
        return response;
    }
    catch (error) {
        const response = { "err": error.message }
        return response
    }

}

module.exports ={getAIchat}