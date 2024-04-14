/**
 * AI适配器 - 以Gemini举例
 * 
 * exports getAIchat
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI("");// API(必填)

// 适配器配置
const adapterConfig = {
    // 如: 使用cookie登录
    
}
/**
 * @param userRequest 用户传入的格式
 * @return response流或response
 */
async function getAIchat(userRequest, chatStream = false) {
    const geminiReq = toGemini(userRequest)
    console.log(userRequest.model)
    if (chatStream) {
        return getAIChatstream(geminiReq);
    } else {
        return getAIChatResponse(geminiReq);
    }
}

/**
 * @param userRequest 用户传入的格式
 * @return 适合该AI适配器的格式
 */
function toGemini(userRequest) {
    // WIP
    const data = {
        model: userRequest.model,
        message : userRequest.message
    }
    return data;
}

/**
 * @param geminiReq 适配gemini的格式
 * @return 官方返回的response
 */
async function getAIChatResponse(geminiReq) {
    try {
        console.log("start get response")
        const config = geminiReq.config
        const aiModel = geminiReq.model
        const model = genAI.getGenerativeModel({ model: aiModel });
        console.log("000")
        const chat = model.startChat({
            history: geminiReq.history,
            generationConfig: { maxOutputTokens: 1000, },
        });
        const result = await chat.sendMessage(geminiReq.message)
        const response = await result.response
        console.log(response.text())
        return response
    } catch (error) {
        const response = { err : error.message }
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
        console.log('return stream')
        return response;
    }
    catch (error) {
        const response = { err: error.message }
        return response
    }

}
module.exports ={getAIchat}