class Service {
  constructor(project, client, service) {
    this.project = project;
    this.client = client;
    this.service = service;
    this.store = {};

    this.client.registerOnReconnectCallback(() => {
      this.client.request('service-register', { service: this.service }).then(data => {
        if (!data.ack) {
          console.log('Could not connect to service')
          return
        }
        console.log('Service started successfully')
      })
    })

    this.serviceRequest = this.serviceRequest.bind(this)
  }

  registerFunc(func, cb) {
    this.store[func] = cb;
  }

  serviceRequest(req) {
    let func = req.func;
    let params = req.params;
    let auth = req.auth;
    if (!auth || Object.keys(auth) == 0) auth = null;

    const cb = this.store[func]
    if (!cb) {
      this.client.send('service-request', { id: req.id, error: 'No function registered on the function' });
      return;
    }

    cb(params, auth, (type, data) => {
      switch (type) {
        case 'response':
          this.client.send('service-request', { id: req.id, params: data })
          break;
      }
    })
  }

  start() {
    this.client.registerCallback('service-request', this.serviceRequest)
    this.client.request('service-register', { service: this.service }).then(data => {
      if (!data.ack) {
        console.log('Could not connect to service')
        return
      }
      console.log('Service started successfully')
    })
  }
}

module.exports = Service 
