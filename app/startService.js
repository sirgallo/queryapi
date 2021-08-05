#!/usr/bin/env node
const Server = require('./src/core/server')

// routes
const queryRouter = require('./src/routes/query')
const trieRouter = require('./src/routes/trie')

const routes = [
    { path: '/query', router: queryRouter },
    { path: '/trie', router: trieRouter } 
]

const server = new Server(routes)
server.run(true)