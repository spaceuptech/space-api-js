var { API, cond, and, or } = require("../../index")

const api = new API("test", "http://localhost:4122")
const service = api.Service("echo-engine")
service.registerFunc("echo", (params, auth, cb) => {
  cb("response", { message: params })
})

service.start()