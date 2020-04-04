var { API } = require("../../index")

let api = new API("myproject", "http://localhost:4122")

const queueEvent = async () => {
  try {
    const res = await api.queueEvent("my_type", { "key1": "value1" }).apply()
    console.log("Event Queue Response", res)
  } catch (error) {
    console.log("Error", error)
  }
}

queueEvent()
