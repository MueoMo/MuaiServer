/**
 * MuaiServer-Dev 0.1.0
 * 
 * by: Mueo   2023/12/22
 */

// 服务端口 - 默认:8000
const Port = 8000;

// 用户验证 - 默认true
const AuthenTication = true;

// 请求密码 - 开启用户验证则启用密码 
const RequestPassword = process.env.req_password

// 是否使用流式传输 - 默认开
const ChatStream = true

module.exports = {Port,RequestPassword,AuthenTication,ChatStream};