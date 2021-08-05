const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class User {
    constructor(email, pass, org, first, last, usertype) {
        this.email = email
        this.pass = pass
        this.org = org
        this.first = first
        this.last = last
        this.usertype = usertype
    }

    async encryptPass(pass) {
        bcrypt.hash(pass, 10)
            .then(hash => {
                this.pass = hash
            })
    }
}

module.exports.User = User