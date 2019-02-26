const generateId = require('../utils').generateId
const WebSocket = require('isomorphic-ws')

class WebSocketClient {
  constructor(url, options) {
    if (url.startsWith('http')) {
      url = url.replace('http', 'ws')
    }
    url = url + 'v1/api/socket/json'
    this.url = url
    this.options = options
    this.connected = false
    this.connectedOnce = false
    this.callbacks = {}
    this.onReconnectCallbacks = []
    this.pendingRequests = []
  }

  registerCallback(type, cb) {
    // TODO: check if cb is a function
    this.callbacks[type] = cb
  }

  unregisterCallback(type) {
    delete this.callbacks[type]
  }

  registerOnReconnectCallback(cb) {
    this.onReconnectCallbacks.push(cb)
  }

  connect() {
    let socket = new WebSocket(this.url)
    socket.onopen = () => {
      this.socket = socket
      this.connected = true

      // perform onconnect callbacks
      if (this.connectedOnce) {
        this.onReconnectCallbacks.forEach(cb => {
          cb()
        });
      }

      this.connectedOnce = true

      // clear pending requests
      if (this.connected) {
        this.pendingRequests.forEach(req => {
          this.socket.send(JSON.stringify(req))
        })
        this.pendingRequests = []
      }
    }
    socket.onmessage = e => {
      let res = JSON.parse(e.data)

      // one time callback if id exists
      if (res.id) {
        let cb = this.callbacks[res.id]
      if (cb) {
          cb(res.data)
          this.unregisterCallback(res.id)
          return
        }
      }

      // Normal callback procedure
      let cb = this.callbacks[res.type]
      if (cb) {
        cb(res.data)
      }
    }
    socket.onclose = () => {
      this.connected = false
      setTimeout(() => {
        this.connect()
      }, 5000)
    }
    socket.onerror = e => {
      console.log('Websocket error: ', e)
    }
  }

  send(type, data) {
    const id = generateId()

    const payload = { id: id, type: type, data: Object.assign({}, data, { token: this.options.token }) }
    // if not connected, then push the message to pending requests and try to connect
    if (!this.connected) {
      this.pendingRequests.push(payload)
      this.connect()
      return id
    }

    // send the message
    this.socket.send(JSON.stringify(payload))
    return id
  }

  request(type, data) {
    const p = new Promise((resolve, reject) => {
      var isResolved = false
      const id = this.send(type, data)

      const timer = setTimeout(() => {
        reject('Websocket request has timed out')
      }, 10000)

      this.registerCallback(id, (data) => {
        if (!isResolved) {
          clearTimeout(timer)
          resolve(data)
        }
      })
    })
    return p
  }
}

module.exports = WebSocketClient