/*
This is a asyncronous lambda function to generate the metadata required for the NFT Minting.
It can be called by the service in which you would like to prepare the data for NFT like product name, images and attributes.
Uses NFT Port Platform to generate NFT Metadata
*/
require('dotenv').config()
const { ObjectId } = require('mongodb')
const helper = require('../lib/helper')
const mongoConnection = require('../lib/mongodb_helper')
const Nft = require('../entities/Nft')

async function generateNftMetadata(schemaValidationData, newNftUrl) {
    try {
        // Get API Keys from the AWS Secrets Manager
        const respone = await helper.getSecretCredentials(process.env.NFT_SECRET_NAME)
        const secrets = JSON.parse(respone)
        const NftPortApiKey = secrets.NFT_PORT_API_KEY

        // Request to NFT Port API
        const metadata = await helper.request({
            method: 'POST',
            url: `${process.env.NFT_PORT_END_POINT}/metadata`,
            apikey: NftPortApiKey,
            body: {
                name: schemaValidationData.name,
                description: schemaValidationData.description,
                file_url: newNftUrl,
                custom_fields: schemaValidationData.attributes,
            },
        })
        const metadataParsed = JSON.parse(metadata.body)

        // Check if metadata URI Generation is failed, Return error
        if (metadataParsed.response === 'NOK') {
            // eslint-disable-next-line no-console
            console.error('Error Response from API', metadataParsed)
            return false
        }
        return metadataParsed
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating NFT metadata:', error)
        throw error // Re-throwing the error for handling in the caller
    }
}

let connection
// eslint-disable-next-line consistent-return
module.exports.handler = async (event) => {
    try {
        // Already JSON Parsed while invoking lambda - in Products Service
        const schemaValidationData = event.body

        // Add epoch timestamps for created_at and updated_at
        const currentTimestamp = Math.floor(new Date() / 1000) // Current time in seconds since epoch

        const nftData = {}
        let nftDetails
        connection = await mongoConnection.connect()

        const newNftUrl = process.env.S3_NFT_IMAGE_URL + schemaValidationData.nft

        // Check if id is passed in path parameters,
        if (!event.pathParameters || !event.pathParameters.id) {
            // NFT Data Doesnt Exist, Creating NFT Metadata

            // Call External API for generating the Metadata URI for the NFT
            const metadata = await generateNftMetadata(schemaValidationData, newNftUrl)

            // Check if metadata URI Generation is failed, Return error
            if (!metadata) {
                // eslint-disable-next-line no-console
                console.error('Exiting Lambda - Metadata URI Generation Failed')
                return false
            }

            // Set metadata URI
            const metadataUri = metadata.metadata_uri

            // Set updated_at to the current timestamp
            nftData.created_at = currentTimestamp
            nftData.updated_at = currentTimestamp

            // Prepare the data object to update in DB
            nftData.name = schemaValidationData.name
            nftData.description = schemaValidationData.description
            nftData.file_url = newNftUrl
            nftData.custom_fields = schemaValidationData.attributes
            nftData.metadata_uri = metadataUri
            nftData.product_id = schemaValidationData.product_id

            // Save NFT Details to MongoDB Database
            const newNft = new Nft(nftData)
            try {
                nftDetails = await newNft.save()
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error saving product data:', error)
            }
            await connection.disconnect()
            if (nftDetails) {
                // eslint-disable-next-line no-console
                console.log('Metadata Insert Successfull', nftDetails)
                return true
            }
        } else {
            // NFT Data Exist, Updating NFT Metadata URI

            // Call External API for generating the Metadata URI for the NFT
            const metadata = await generateNftMetadata(schemaValidationData, newNftUrl)

            // Check if metadata URI Generation is failed, Return error
            if (!metadata) {
                // eslint-disable-next-line no-console
                console.error('Exiting Lambda - Metadata URI Generation Failed')
                return false
            }

            // Set metadata URI
            const metadataUri = metadata.metadata_uri

            // Prepare the data object to update in DB
            nftData.name = schemaValidationData.name
            nftData.description = schemaValidationData.description
            nftData.file_url = newNftUrl
            nftData.custom_fields = schemaValidationData.attributes
            nftData.metadata_uri = metadataUri

            const productId = new ObjectId(event.pathParameters.id)
            // Fetch the existing NFT
            const nfts = await Nft.find({ product_id: productId })
            if (nfts.length > 0) {
                // Assume you only need the first NFT from the results, as it's a single product ID
                const nftToUpdate = nfts[0].toObject()

                // Set updated_at to the current timestamp
                nftData.updated_at = currentTimestamp

                // Update the Nft details
                const updateSuccess = await Nft.updateOne(
                    // eslint-disable-next-line no-underscore-dangle
                    { _id: nftToUpdate?._id },
                    { $set: nftData },
                )
                await connection.disconnect()
                if (updateSuccess) {
                    // eslint-disable-next-line no-console
                    console.log('Metadata Update Successfull', updateSuccess)
                    return true
                }
            } else {
                // NFT does not exists and creating a new one for the edited product

                // Set created_at and updated_at to the current timestamp
                nftData.created_at = currentTimestamp
                nftData.updated_at = currentTimestamp
                nftData.product_id = productId

                // Save NFT Details to MongoDB Database
                const newNft = new Nft(nftData)
                try {
                    nftDetails = await newNft.save()
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Error saving product data:', error)
                }
                await connection.disconnect()
                if (nftDetails) {
                    // eslint-disable-next-line no-console
                    console.log('Metadata Insert Successfull', nftDetails)
                    return true
                }
            }
        }
    } catch (error) {
        await connection.disconnect()
        // eslint-disable-next-line no-console
        console.error('Exiting Lambda - Error creating / updating product NFT Metadata:', error)
        return false
    }
}
