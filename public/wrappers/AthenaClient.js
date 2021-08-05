const AthenaExpress = require("athena-express"),
    aws = require("aws-sdk")

class AthenaClient {
    constructor(region, accessKeyId, secretAccessKey, s3, db, getStats = false) {
        this.awscreds = {
            region: region,
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        }
        this.s3 = s3
        this.db = db
        this.getStats = getStats
    }

    get athenaConfig() {
        return this.buildAthenaConfig()
    }

    buildAthenaConfig() {
        aws.config.update(this.awscreds)

        const athenaExpressConfig = {
            aws,
            s3: this.s3,
            db: this.db,
            getStats: this.getStats

        }
        return new AthenaExpress(athenaExpressConfig)
    }

    async getAthenaResults(query) {
        const athena = this.athenaConfig()

        try {
            console.log('Beginning run of query...')
            let results = await athena.query(query)
            console.log('Athena run complete.')
            return results
        }
        catch (err) {
            return err
        }
    }
}

module.exports = AthenaClient