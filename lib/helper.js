// AWS SDK Configuration to get Credentials from AWS Secrets Manager
const { SecretsManager } = require('aws-sdk')

const secretsManager = new SecretsManager({ region: process.env.REGION })
config.update({ region: process.env.REGION })

// Import Request module to Request External NFT Port API's
const request = require('request')

// Helper function to retrive secrets / api keys from AWS Secrets Manager
module.exports.getSecretCredentials = async (secretName) => {
    const params = {
        SecretId: secretName,
    }

    try {
        const data = await secretsManager.getSecretValue(params).promise()
        if ('SecretString' in data) {
            return data.SecretString
        }
        throw new Error('SecretString not found in the fetched data')
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching secret:', error)
        throw error
    }
}

// Helper Function make API requests
module.exports.request = (apiParams) => new Promise((resolve, reject) => {
    const requestParams = {
        method: apiParams.method,
        url: apiParams.url,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiParams.apikey,
        },
        body: JSON.stringify(apiParams.body),
    }
    if (apiParams.timeout) {
        requestParams.timeout = apiParams.timeout
    }
    request(requestParams, (error, response) => {
        if (error) {
            reject(error)
        }
        if (response) {
            resolve(response)
        }
    })
})

// Helper function to check if the ID is a valid MongoDB ID
module.exports.isValidMongoDBId = (id) => {
    // Check if the ID is a string and has a length of 24 characters (hexadecimal)
    const valid = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
    if (valid) {
        return true
    }
    return false
}
