const HttpClient = require("./HttpClient");
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const HttpClient = require('../requests/HttpClient')

class MongoDBClient extends HttpClient{
    constructor(){
        super(host, port)
        this.dbName = dbName
    }

    get client() {
        return MongoClient(this.endpoint)
    }

    async connect() {
        try {
            await this.client.connect()
        }
        catch (err) {
            console.log(err.stack)
        }
    }

    async insertOne(doc) {
        return doc
    }

    async insertMany(docs) {
        return docs
    }

    async read(doc) {
        return doc
    }

    close() {
        this.client.close()
    }
}

module.exports = MongoDBClient