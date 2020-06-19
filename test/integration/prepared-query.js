var { API } = require("../../index")

const api = new API("test", "http://localhost:4122")
const db = api.DB("postgres");
db.preparedQuery("preparedQuery1").args({ id: "1" }).apply().then((res => {
  if (res.status !== 200) {
    throw new Error(`Request failed - ${res}`)
  }
})).catch(ex => console.log("Exception", ex))