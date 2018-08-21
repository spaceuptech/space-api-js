class WebSocketClient {
  constructor(url, options) {
    if (url.startsWith('http')) {
      url = url.replace('http', 'ws')
    }
    url = url + 'v1/json/socket'
    this.url = url
    this.options = options
    this.connected = false
    this.connectedOnce = false
    this.callbacks = {}
    this.onReconnectCallbacks = []
    this.pendingRequests = []
  }

  registerCallback(event, cb) {
    // TODO: check if cb is a function
    this.callbacks[event] = cb
  }

  unregisterCallback(event) {
    delete this.callbacks[event]
  }

  registerOnReconnectCallback(cb) {
    this.onReconnectCallbacks.push(cb)
  }

  connect() {
    let socket = new WebSocket(this.url)
    socket.onopen = () => {
      console.log('Websocket connected')
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
      let cb = this.callbacks[res.event]
      if (cb) {
        cb(res.data)
      }
    }
    socket.onclose = () => {
      console.log('Socket closed, Reconnecting...')
      this.connected = false
      setTimeout(() => {
        this.connect()
      }, 5000)
    }
    socket.onerror = e => {
      console.log('Websocket error: ', e)
    }
  }

  send(event, data) {
    console.log(event, data)
    // if not connected, then push the message to pending requests and try to connect
    if (!this.connected) {
      this.pendingRequests.push({ event: event, data: Object.assign({}, data, { token: this.options.token }) })
      this.connect()
      return
    }

    // send the message
    this.socket.send(JSON.stringify({ event: event, data: Object.assign({}, data, { token: this.options.token }) }))
  }
}

module.exports = WebSocketClient