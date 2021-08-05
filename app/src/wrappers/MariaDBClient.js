const mysql = require('mysql2')

class MariaDBClient {
    constructor(host, port, user, password, database) {
        this.host = host
        this.port = port
        this.user = user
        this.password = password
        this.database = database
    }

    get conn() {
        return this.buildConn()
    }

    buildConn() {
        return mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
        })
    }
    
    async query(sql, args) {
        return await new Promise((resolve, reject) => {
            this.conn.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err)
                resolve(rows)
            })
        })
    }

    async insert(sql, name, args) {
        return await new Promise((resolve, reject) => {
            this.conn.query(sql, args, err => {
                if (err)
                    return reject(err)
                console.log(`${name} inserted into database successfully`)
                resolve()
            })
        })
    }

    async delete(sql, args) {
        return await new Promise((resolve, reject) => {
            this.conn.query(sql, args, err => {
                if(err)
                    return reject(err)
                console.log('Entry deleted successfully from database')
                resolve()
            })
        })
    }

    async close() {
        return await new Promise((resolve, reject) => {
            this.conn.end(err => {
                if (err)
                    return reject(err)
                resolve()
            })
        })
    }
}

module.exports = MariaDBClient