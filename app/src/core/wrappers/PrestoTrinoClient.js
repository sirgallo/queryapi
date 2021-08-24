const fetch = require('node-fetch')

const HttpClient = require ('./HttpClient')
const httpRequest = require('../requests/HttpRequest')
const httpMethods = require('../requests/HttpMethods')

class PrestoTrinoClient extends HttpClient {
    data = {
        columns: [],
        data: []
    }
    continue = new httpRequest(httpMethods.get)

    async client() {
        try {
            console.log(`Beginning query run on Worker ${process.pid} on PrestoTrinoClient...`)
            
            await this.response(this.endpoint, this.request)

            let jsonres = {
                columns: this.data.columns[0],
                data: this.data.data
            }

            console.log('')
            console.log(`Ending run on Worker ${process.pid} PrestoTrinoClient. Results returned.`)
            console.log('')
            return jsonres
        }
        catch (err) {
            console.log(`Error Log: ${err}`)
            return err
        }
    }

    async response(endpoint, req) {
        try {
            let res = await this.reqEndpoint(endpoint, req)

            //  check for errors
            if(res.hasOwnProperty('error')) {
                console.log(res.error)
                throw Error(res.error)
            }
            //  add to the data and columns fields for the
            //  return data that will be handled on the front end
            //  set up this way to handle returning duplicate columns
            if(res.hasOwnProperty('columns') && res.hasOwnProperty('data')) {
                console.log('...I see columns and data...working on it...')
                this.data.columns.push(res.columns)
                this.data.data.push(res.data)
            }
            else if(res.hasOwnProperty('data')) {
                console.log('...I see just data...working on it...')
                this.data.data.push(res.data)
            }
    
            if(res.hasOwnProperty('nextUri')) {
                console.log('...going to next URI at: ' + res.nextUri + "...")
                await this.response(res.nextUri, this.continue)
            }
        } catch(err) {
            console.log(err)
            throw Error(err)
        }
    }

    async reqEndpoint(endpoint, req) {
        try {
            let response = await fetch(endpoint, req)
            return await response.json()
        }
        catch (err) {
            console.log(err)
            return { error: err }
        }
    }
}

module.exports = PrestoTrinoClient