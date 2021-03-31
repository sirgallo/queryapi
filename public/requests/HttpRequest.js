const httpMethods = require('../requests/HttpMethods')

class HttpRequest {
    constructor(method, headers, body = undefined) {
        this.method = method
        this.headers = headers
        this.body = body
    }

    get request() {
        return this.buildRequest()
    }

    buildRequest() {
        let request = {}

        switch(this.method) {
            case httpMethods.get:
                request = {
                    method: this.method
                }
                break
            case httpMethods.post:
                request = {
                    method: this.method,
                    headers: this.headers,
                    body: this.body
                }
                break
        }
        
        return request
    }
}

module.exports = HttpRequest