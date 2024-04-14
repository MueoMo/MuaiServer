/**
 * Mueai-Dev 1.0.0
 * 
 * by: Mueo   2023/12/26
 */

// 监听 0.0.0.0 供外网访问 ,false则127.0.0.1
const Listen = true

// 服务端口 - 默认:8000
const Port = 2333;

// 用户验证 - 默认true
const AuthenTication = false;

// 请求密码 - 开启用户验证则启用密码 
const SeverPassword = 123

module.exports = {Port,SeverPassword,AuthenTication,Listen};