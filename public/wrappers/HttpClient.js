const fetch = require('node-fetch')

const httpMethods = require('../requests/HttpMethods')
const httpRequest = require('../requests/HttpRequest')

class HttpClient {
    constructor(host, port = undefined, path = undefined, request = undefined) {
        this.host = host
        this.port = port
        this.path = path
        this.request = request
    }

    get endpoint() {
        return this.buildEndpoint()
    }

    buildEndpoint() {
        if(this.path.charAt(0) != '/') {
            this.path = `/${this.path}`
        }
        
        if (this.port == undefined && this.path == undefined) {
            console.log(`Current endpoint: ${this.host}`)
            return this.host
        }
        else if(this.port !== undefined  && this.path == undefined) {
            console.log(`Current endpoint: ${this.host}:${this.port}`)
            return this.host + ':' + this.port
        }
        else {
            console.log(`Current endpoint: ${this.host}:${this.port}${this.path}`)
            return this.host + ':' + this.port + this.path
        }
    }
}

module.exports = HttpClient