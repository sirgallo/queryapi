const express = require('express')
const router = express.Router()

const prestoTrinoCli = require('../core/wrappers/PrestoTrinoClient')
const athenaCli = require('../core/wrappers/AthenaClient')
const mariaDBCli = require('../core/wrappers/MariaDBClient')

const httpRequest = require('../core/requests/HttpRequest')
const httpMethods = require('../core/requests/HttpMethods')

/*
    Request Body: 
        {
            prestohost: string
            prestoport: int
            prestouser: string,
            prestocatalog: string,
            prestoschema: string
            query: string
        }
*/

router.post('/presto', async (req, res, next) => {
    console.log('')
    console.log(`Reached /query/presto route on API on Worker ${process.pid}`)
    console.log('')

    const presto = req.body

    const path = '/v1/statement'
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Presto-User': presto.prestouser,
        'X-Presto-Catalog': presto.prestocatalog,
        'X-Presto-Schema': presto.prestoschema
    }

    let request = new httpRequest(httpMethods.post, headers, presto.query)

    const prestoCli = new prestoTrinoCli(presto.prestohost, presto.prestoport, path, request.request)
    try {
        let data = await prestoCli.client()
        if(data.hasOwnProperty('message')) {
            res.status(404).send({ 'message': message, 'query': presto.query })
        }
        else {
            res.status(200).send({ 'message': 'success', 'data': data, 'query': presto.query })
        }
    } catch (err) {
        res.status(404).send({'message': err})
    }
})

/*
    Request Body: 
        {
            trinohost: string
            trinoport: int
            trinouser: string,
            trinocatalog: string,
            trinoschema: string
            query: string
        }
*/

router.post('/trino', async (req, res, next) => {
    console.log('')
    console.log(`Reached /query/trino route on API on Worker ${process.pid}`)
    console.log('')

    const trino = req.body

    const path = 'v1/statement'
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Trino-User': trino.trinouser,
        'X-Trino-Catalog': trino.trinocatalog,
        'X-Trino-Schema': trino.trinoschema
    }

    let request = new httpRequest(httpMethods.post, headers, req.query)

    const trinoCli = new prestoTrinoCli(trino.trinohost, trino.trinoport, path, request.request)
    try {
        let data = await trinoCli.client()
        if(data.hasOwnProperty('message')) {
            res.status(404).json({'message': message, 'query': trino.query})
        }
        else {
            res.status(200).json({'message': 'success', 'data': data, 'query': trino.query})
        }
    } catch (err) {
        res.status(404).send({'message': err})
    }
})

/*
    Request Body: 
        {
            mariahost: string
            mariaport: int
            mariauser: string,
            mariapassword: string,
            mariadatabase: string
            query: string
        }
*/

router.post('/mariadb', async (req, res, next) => {
    console.log('')
    console.log(`Reached /query/mariadb route on API on Worker ${process.pid}`)
    console.log('')

    const maria = req.body

    const mariaDb = new mariaDBCli(maria.mariahost, maria.mariaport, maria.mariauser, maria.mariapassword, maria.mariadatabase)
    try {
        let data = await mariaDb.query(maria.query)
        await mariaDb.close()
        res.status(200).send(JSON.parse(JSON.stringify({ 'data': data, 'query': maria.query })))
    } catch (err) {
        res.status(404).send({ 'message': err })
    }
})

/*
    Request Body: 
        {
            awscreds: {
                region: string,
                accessKeyId: string,
                secretAccessKey: string
            }
            s3: string
            db: string
            getStats: string (optional param)
        }
*/

router.post('/athena', async (req, res, next) => {
    console.log('')
    console.log(`Reached /query/athena route on API on Worker ${process.pid}`)
    console.log('')

    const ath = req.body

    const athena = new athenaCli(ath.awscreds.region, ath.awscreds.accessKeyId, ath.awscreds.secrectAccessKey, ath.s3, ath.db)
    try {
        let data = await athena.getAthenaResults(ath.query)
        res.status(200).json({ 'data': data, 'query': ath.query })
    } catch (err) {
        res.status(404).json({'message': err})
    }
})

module.exports = router