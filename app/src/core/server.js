require('dotenv').config({ path: '.env' })
const http = require('http')
const cluster = require('cluster')
const os = require('os')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')

const normalizePort = (val) => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

class Server {
    port = normalizePort(process.env.PORT)
    ip = os.networkInterfaces()['eth0'][0].address

    numOfCpus = process.env.CPUS || os.cpus().length
    name = process.env.NAME
    version = process.env.VERSION

    workers = []

    constructor(routes) {
        this.app = express()
        this.routes = routes
    }

    run(isClusterRequired) {
        this.app.set('port', this.port)

        this.app.use(logger('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(compression())

        for (const route of this.routes) 
            this.app.use(route.path, route.router)
            
        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            next(createError(404))
        })

        // error handler
        this.app.use((err, req, res, next) => {
            // set locals, only providing error in development
            res.locals.message = err.message
            res.locals.error = req.this.app.get('env') === 'development' ? err : {}
            
            res.status(err.status || 500).json({ error: err.message })
        })

        if(isClusterRequired && cluster.isMaster) {
            this.setUpWorkers()
            console.log(this.workers)
        }
        else
            this.setUpServer()
    }

    setUpServer () {
        this.app.listen(this.port, () => {
            console.log(`Server ${process.pid} listening on port ${this.port}`)
        })
    }

    setUpWorkers () {
        console.log(`Welcome to ${this.name}, version ${this.version}`)
        console.log('')
        console.log(`Server @${this.ip} setting up ${this.numOfCpus} CPUs as workers.`)
        console.log('')

        for(let cpu = 0; cpu < this.numOfCpus; cpu++) {
            this.workers.push(cluster.fork())
            
            this.workers[cpu].on('message', message => {
                console.log(message)
            })
        }

        cluster.on('online', worker => {
            console.log(`Worker ${worker.process.pid} is online.`)
        })

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died with code ${code} and ${signal}.`)
            console.log('Starting new worker.')
            cluster.fork()
            this.workers.push(cluster.fork())
            this.workers[this.workers.length - 1].on('message', message => {
                console.log(message)
            })
        })
    }
}

module.exports = Server