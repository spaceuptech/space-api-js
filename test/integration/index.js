var { API, cond, and, or } = require("../../index")

// Create the following tables for SQL:
// CREATE TABLE users (id VARCHAR(50), account VARCHAR(50), email VARCHAR(100), name VARCHAR(100), pass VARCHAR(50), role VARCHAR(50));
// CREATE TABLE posts (title VARCHAR(50), content VARCHAR(200), author VARCHAR(200));


// Databases
const MONGO = "mongo"
const SQL_POSTGRES = "postgres"
const SQL_MYSQL = "mysql"

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const formatError = (section, desc, params) => {
  return { section, desc, params }
}

startTest(MONGO, "test", "http://localhost:4122")
startTest(SQL_MYSQL, "test", "http://localhost:4122")
startTest(SQL_POSTGRES, "test", "http://localhost:4122")

async function cleanUp(db) {
  let res = await db.delete("posts").all()
  if (res.status !== 200) {
    throw formatError("CleanUp", "", res)
  }

  res = await db.get("posts").all()
  if (res.status !== 200 || !(res.data.result === null || res.data.result.length === 0)) {
    throw formatError("CleanUp", "Posts not cleaned", res)
  }

  res = await db.delete("users").all()
  if (res.status !== 200) {
    throw formatError("CleanUp", "Users not cleaned", res)
  }

  res = await db.get("users").all()
  if (res.status !== 200 || !(res.data.result === null || res.data.result.length === 0)) {
    throw formatError("CleanUp", "", res)
  }
}



async function startTest(dbType, projectId, url) {
  let db
  try {
    let api = new API(projectId, url)
  
  switch (dbType) {
    case MONGO:
      db = api.Mongo()
      break
    case SQL_MYSQL:
      db = api.MySQL()
      break
    case SQL_POSTGRES:
      db = api.Postgres()
      break
    default:
      throw formatError("Initialization", "Unsupported Database")
  }


  
    // Clean any data before starting tests
    await cleanUp(db)
    let res = {}
    /******************** Signup ********************/
    const user = { email: "user1@gmail.com", name: "User 1", pass: "123", role: "user" }
    res = await db.signUp(user.email, user.name, user.pass, user.role)
    if (res.status !== 200) {
      throw formatError("SignUp", "Status not matching", res)
    }
    if (res.data.user.email !== user.email || res.data.user.name !== user.name || res.data.user.role !== user.role) {
      throw formatError("SignUp", "User not matching", res)
    }
    api.setToken(res.data.token)

    /******************** Signin ********************/
    res = await db.signIn(user.email, user.pass)
    if (res.status !== 200) {
      throw formatError("SignIn", "Status not matching", res)
    }
    if (res.data.user.email !== user.email || res.data.user.name !== user.name || res.data.user.role !== user.role) {
      throw formatError("SignIn", "User not matching", res)
    }
    api.setToken(res.data.token)

    let userId = ""
    switch (dbType) {
      case MONGO:
        userId = res.data.user._id
        break
      default:
        userId = res.data.user.id
    }

    /******************** Insert One ********************/
    const postDate = new Date(2015, 1, 25, 10, 10, 10, 0)
    let posts = [
      { title: "Post 1", content: "This is a good post", author: user.email },
      { title: "Post 2", content: "This is a better post", author: user.email },
      { title: "Post 3", content: "This is a good post", author: user.email }
    ]

    switch (dbType) {
      case MONGO:
        posts.push({
          title: "Post 4", content: "This is a good post", author: user.email,
          highestScore: 400, lowestScore: 100, score: 10,
          views: 0, viewedBy: [], abc: "123", "xyz": "456",
          updated: postDate, lastUpdated: postDate.getTime()
        })
        break
      default:
        posts.push({ title: "Post 4", content: "This is a good post", author: user.email })
    }

    res = await db.insert("posts").one(posts[0])
    if (res.status !== 200) {
      throw formatError("Insert One", "Status not matching", res)
    }

    /******************** Insert All ********************/
    res = await db.insert("posts").all(posts.slice(1))
    if (res.status !== 200) {
      throw formatError("Insert All", "Status not matching", res)
    }

    /******************** Get One ********************/
    res = await db.get("posts").where(cond("title", "==", "Post 1")).one()
    if (res.status !== 200) {
      throw formatError("Get One", "Status not matching", res)
    }

    if (res.data.result.title !== "Post 1" || res.data.result.author !== user.email || res.data.result.content != "This is a good post") {
      throw formatError("Get One", "Result not matching", res)
    }

    /******************** Get All ********************/
    res = await db.get("posts").all()
    if (res.status !== 200) {
      throw formatError("Get All", "Status not matching", res)
    }

    if (res.data.result.length !== 4 || res.data.result[0].title !== "Post 1" || res.data.result[0].author !== user.email || res.data.result[0].content != "This is a good post") {
      throw formatError("Get All", "Result not matching", res)
    }

    /******************** Get Count ********************/
    // count is not supported as of now in sql
    switch (dbType) {
      case MONGO:
        res = await db.get("posts").count()
        if (res.status !== 200) {
          throw formatError("Get Count", "Status not matching", res)
        }

        if (res.data.result !== 4) {
          throw formatError("Get Count", "Result not matching", res)
        }
        break
    }

    /******************** Get All (Options - select, skip, limit, sort) ********************/
    res = await db.get("posts").where(cond("title", "!=", "Post 3")).select({ title: 1, content: 1 }).skip(2).limit(1).sort("-title").all()
    if (res.status !== 200) {
      throw formatError("Get All Options", "Status not matching", res)
    }

    if (res.data.result.length !== 1 || res.data.result[0].title !== "Post 1" || res.data.result[0].author !== undefined || res.data.result[0].content != "This is a good post") {
      throw formatError("Get All Options", "Result not matching", res)
    }

    /******************** Get One (And Clause) ********************/
    res = await db.get("posts").where(and(cond("author", "==", user.email), cond("title", "==", "Post 3"))).one()
    if (res.status !== 200) {
      throw formatError("Get One (AND Clause)", "Status not matching", res)
    }

    if (res.data.result.title !== "Post 3" || res.data.result.author !== user.email || res.data.result.content != "This is a good post") {
      throw formatError("Get One (AND Clause)", "Result not matching", res)
    }

    /******************** Get All (Or Clause) ********************/
    res = await db.get("posts").where(or(cond("title", "==", "Post 2"), cond("title", "==", "Post 3"))).all()
    if (res.status !== 200) {
      throw formatError("Get All (OR Clause)", "Status not matching", res)
    }

    if (res.data.result.length !== 2 || res.data.result[0].title !== "Post 2" || res.data.result[1].title !== "Post 3") {
      throw formatError("Get All (OR Clause)", "Result not matching", res)
    }

    /******************** Get Distinct ********************/
    // Distinct is not supported as of now in sql
    switch (dbType) {
      case MONGO:
        res = await db.get("posts").distinct("content")
        if (res.status !== 200) {
          throw formatError("Get Distinct", "Status not matching", res)
        }

        if (res.data.result.length !== 2 || res.data.result[0] !== "This is a good post" || res.data.result[1] !== "This is a better post") {
          throw formatError("Get Distinct", "Result not matching", res)
        }
        break
    }

    /******************** Update One ********************/
    switch (dbType) {
      case MONGO:
        res = await db.update("posts").where(cond("title", "==", "Post 4"))
          .set({ content: "This is a better post" })
          .push({ viewedBy: "User 2" })
          .inc({ views: 10 })
          .mul({ score: 5 })
          .max({ highestScore: 500 })
          .min({ lowestScore: 40 })
          .rename({ xyz: "zyx" })
          .remove("abc")
          .currentDate("updated")
          .currentTimestamp("lastUpdated")
          .one()

        if (res.status !== 200) {
          throw formatError("Update One", "Status not matching", res)
        }

        res = await db.get("posts").where(cond("title", "==", "Post 4")).one()
        if (res.status !== 200) {
          throw formatError("Update One", "Cannot fetch updated doc", res)
        }

        if (res.data.result.content !== "This is a better post") {
          throw formatError("Update One", "Set did not worked", res)
        }

        if (res.data.result.views !== 10) {
          throw formatError("Update One", "Inc did not worked", res)
        }

        if (res.data.result.score !== 50) {
          throw formatError("Update One", "Mul did not worked", res)
        }

        if (res.data.result.highestScore !== 500) {
          throw formatError("Update One", "Max did not worked", res)
        }

        if (res.data.result.lowestScore !== 40) {
          throw formatError("Update One", "Min did not worked", res)
        }

        if (res.data.result.abc !== undefined) {
          throw formatError("Update One", "Remove did not worked", res)
        }

        if (res.data.result.zyx !== "456") {
          throw formatError("Update One", "Rename did not worked", res)
        }

        if (res.data.result.viewedBy.length !== 1 || res.data.result.viewedBy[0] !== "User 2") {
          throw formatError("Update One", "Push did not worked", res)
        }

        if (!isToday(new Date(res.data.result.updated))) {
          throw formatError("Update One", "Current Date did not worked", res)
        }

        if (new Date().getTime() <= postDate.getTime()) {
          throw formatError("Update One", "Current Timestamp did not worked", res)
        }
        break
    }

    /******************** Update All ********************/
    res = await db.update("posts").where(or(cond("title", "==", "Post 1"), cond("title", "==", "Post 3"))).set({ content: "This is an awesome post" }).all()

    if (res.status !== 200) {
      throw formatError("Update All", "Status not matching", res)
    }

    res = await db.get("posts").where(cond("content", "==", "This is an awesome post")).all()
    if (res.status !== 200) {
      throw formatError("Update All", "Result not matching", res)
    }

    if (res.data.result.length !== 2 || res.data.result[0].title !== "Post 1" || res.data.result[1].title !== "Post 3" || res.data.result[0].content !== "This is an awesome post") {
      throw formatError("Update All", "Result not matching", res)
    }

    /******************** Upsert ********************/
    // Upsert is not supported in sql
    switch (dbType) {
      case MONGO:
        res = await db.update("posts").where(and(cond("title", "==", "Post 5"), cond("author", "==", user.email))).set({ content: "This is an awesome post" }).upsert()
        if (res.status !== 200) {
          throw formatError("Upsert", "Status not matching", res)
        }
        res = await db.get("posts").where(cond("title", "==", "Post 5")).all()
        if (res.status !== 200) {
          throw formatError("Upsert", "Cannot fetch upserted doc", res)
        }

        if (res.data.result.length !== 1 || res.data.result[0].title !== "Post 5" || res.data.result[0].content !== "This is an awesome post") {
          throw formatError("Upsert", "Result not matching", res)
        }
        break
    }

    /******************** Delete One ********************/
    switch (dbType) {
      case MONGO:
        res = await db.delete("posts").where(cond("title", "==", "Post 2")).one()
        if (res.status !== 200) {
          throw formatError("Delete One", "Status not matching", res)
        }

        res = await db.get("posts").where(cond("title", "==", "Post 2")).one()
        if (res.status !== 500) {
          throw formatError("Delete One", "Wrong status while fetching deleted doc", res)
        }
        break
    }

    /******************** Delete All ********************/
    res = await db.delete("posts").where(cond("title", "!=", "Post 1")).all()
    if (res.status !== 200) {
      throw formatError("Delete All", "Status not matching", res)
    }

    res = await db.get("posts").all()
    if (res.status !== 200) {
      throw formatError("Delete All", "Cannot fetch remaining docs", res)
    }

    if (res.data.result.length !== 1 || res.data.result[0].title !== "Post 1") {
      throw formatError("Delete All", "Result not matching", res)
    }

    /******************** Fetch Profile ********************/
    res = await db.profile(userId)
    if (res.status !== 200) {
      throw formatError("Get Profile", "Status not matching", res)
    }

    if (res.data.user.name !== "User 1" || res.data.user.email !== "user1@gmail.com" || res.data.user.role !== "user") {
      throw formatError("Get Profile", "Profile not matching", res)
    }

    /******************** Fetch Profiles ********************/
    res = await db.profiles()
    if (res.status !== 200) {
      throw formatError("Get Profiles", "Status not matching", res)
    }

    if (res.data.users.length !== 1 || res.data.users[0].name !== "User 1" || res.data.users[0].email !== "user1@gmail.com" || res.data.users[0].role !== "user") {
      throw formatError("Get Profiles", "Profile not matching", res)
    }

    /******************** FaaS ********************/
    res = await api.call('echo-engine', 'echo', 'Function as a Service is awesome!', 1000)
    if (res.status !== 200) {
      throw formatError("FaaS", "Status not matching", res)
    }

    if (res.data.result.message !== 'Function as a Service is awesome!') {
      throw formatError("FaaS", "Result not matching", res)
    }

    // Clean up data
    await cleanUp(db)
    

    console.log("\x1b[32m%s\x1b[0m", "All tests for " + dbType + " have passed!!");
  }catch (errorObj) {
    console.log(errorObj)
    console.log("\x1b[31m%s\x1b[0m", "Error in " + dbType.toUpperCase() + " (" + errorObj.section + ")")
    console.log("\x1b[31m%s\x1b[0m", "Description - " + errorObj.desc)
    console.log("\x1b[31m%s\x1b[0m", "Response - " + JSON.stringify(errorObj.params))
    
     // Clean up data
     try {
       await cleanUp(db)
     } catch (e) {}
  }
}

//startTest().catch(err => console.log(err))
