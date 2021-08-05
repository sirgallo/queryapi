#!/usr/bin/env node
const Server = require('./server')

// routes
const queryRouter = require('./routes/query')
const trieRouter = require('./routes/trie')

const routes = [
    { path: '/query', router: queryRouter },
    { path: '/trie', router: trieRouter } 
]

const server = new Server(routes)
server.run(true)