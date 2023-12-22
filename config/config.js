/**
 * MuaiServer-Dev 0.1.0
 * 
 * by: Mueo   2023/12/22
 */

// 服务端口 - 默认:8000
const port = 8000;

// 用户验证 - 默认true
const authenTication = false;

// 用户信息 - 支持多用户(但不建议！)    // 待完成
const userInfo = { 'user1': 'pwd1', };

// 是否使用流式传输 - 默认开
const chatStream = true


module.exports = {port,userInfo,authenTication,chatStream};