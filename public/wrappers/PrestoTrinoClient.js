const fetch = require('node-fetch')

const HttpClient = require ('../wrappers/HttpClient')
const httpRequest = require('../requests/HttpRequest')
const httpMethods = require('../requests/HttpMethods')

class PrestoTrinoClient extends HttpClient {
    async client() {
        let data = {
            columns: [],
            data: []
        }

        try {
            console.log(`Beginning query run on Worker ${process.pid} on PrestoTrinoClient...`)
            
            let response = await this.response(this.endpoint, this.request, data)

            if (response.hasOwnProperty('message')) {
                reserr = {
                    message: response.message
                }
                return reserr
            }
            else {
                let jsonres = {
                    columns: response.columns[0],
                    data: response.data
                }

                console.log('')
                console.log(`Ending run on Worker ${process.pid} PrestoTrinoClient. Results returned.`)
                console.log('')

                return jsonres
            }
        }
        catch (err) {
            console.log(`Error Log: ${err}`)
            return err
        }
    }

    async response(endpoint, req, data) {
        let res = await this.reqEndpoint(endpoint, req)

        if (res.hasOwnProperty('error')) {
            console.log(res.error)
            return res.error
        }

        if (res.hasOwnProperty('status')) {
            console.log('Current Status: ' + res.status)
        }

        if(res.hasOwnProperty('columns') && res.hasOwnProperty('data')) {
            console.log('...I see columns and data...working on it...')
            data.columns.push(res.columns)
            data.data.push(res.data)
        }
        else if(res.hasOwnProperty('data')) {
            console.log('...I see just data...working on it...')
            data.data.push(res.data)
        }
    
        if(res.hasOwnProperty('nextUri')) {
            console.log(`...going to next URI at: ${res.nextUri}...`)
            let getNextUri = new httpRequest(httpMethods.get)
            return this.response(res.nextUri, getNextUri.request, data)
        }

        return data
    }

    async reqEndpoint(endpoint, req) {
        try {
            let response = await fetch(endpoint, req)
            return await response.json()
        }
        catch (err) {
            return err
        }
    }
}

module.exports = PrestoTrinoClient