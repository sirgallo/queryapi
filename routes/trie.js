const express = require('express')
const router = express.Router()

const Trie = require('../public/hint/Trie')

router.post('/test', (req, res, next) => {
    console.log('')
    console.log(`Reached /trie/test route on API on Worker ${process.pid}`)
    console.log('')
    
    words = req.body.words

    let trie = new Trie(null)
    for(let word of words) {
        trie.insertWord(word)
    }

    console.log(trie.attributes)

    res.status(200).json({'tries': trie.attributes})
})

router.post('/autocorrect', (req, res, next) => {
    console.log('')
    console.log(`Reached /query/autocorrect route on API on Worker ${process.pid}`)
    console.log('')

    res.status(200).json({'message': 'In progress...'})
})

module.exports = router