
简单的AI聊天后端，支持插件添加AI

## 使用

请在魔法环境下进行(建议为US)

### 安装依赖
```
npm install
```
### 运行
运行后端服务器
```
node server.js
```

### 本地测试

提供了一个流式传输的本地测试，运行`server.js`后运行即可
```
node app.js
```

## 参数

后端接受参数

| 参数 | 类型 | 是否必填 | 默认值 | 说明 |
|:--|:--|:--|:--|:--|
| message | String | 是 | 无 | 用户的对话 |
| history | Json | 是 | 无 | 历史记录 |   
| config | Json | 否 | 空 | 额外配置 |
| ai | String | 是 | 无 | AI名(如gemini) |
| model | String | 是 | 无 | 模型名(如gemini-pro) |

history参数

| 参数 | 类型 | 取值 | 是否必填 | 默认值 | 说明 |
|:--|:--|:--|:--|:--|:--|
| role | String | user/model | 是 | 无 | 角色 |
| parts | String | - | 是 | 无 | 聊天信息 |

history格式示例,必须`role`和`parts`必须成对出现
且第一个必须为 `user` ，第二个必须为 `model`
```
let data = [{
  role: "user",
  parts: "你好，开始聊天，请用简体中文交流",
}, {
    role: "model",
    parts: "好的收到"
  }]; 
```
