const express = require('express')
const router = express.Router()

//  This should not be asynchronous
router.get('/', (req, res, next) => {
    res.status(200).send({ alive: 'okay'})
})

module.exports = router