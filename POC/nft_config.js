// Research on NFT -  NFT Port
/*

Ethereum (Mainnet and Goerli) and Polygon are supported

Docs - https://docs.nftport.xyz/

API Reference - https://docs.nftport.xyz/reference/retrieve-contract-nfts

NFT Minting QuickStart Guide - https://docs.nftport.xyz/docs/minting-quickstart
*/

// Sample Function - API Call
// eslint-disable-next-line import/no-unresolved
const sdk = require('api')('@nftport/v0#9w18lo4supzb')

sdk.auth('52576e99-1715-4283-bcdc-a0e062629104')
sdk.retrieveContractNfts({
    chain: 'ethereum',
    page_number: '1',
    page_size: '50',
    include: 'metadata',
    refresh_metadata: 'false',
    contract_address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
})
    // eslint-disable-next-line no-console
    .then(({ data }) => console.log(data))
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err))

// Deploy a contract for the NFT Products
sdk.auth('52576e99-1715-4283-bcdc-a0e062629104')
sdk.deployNftProductContract({ chain: 'polygon' })
    // eslint-disable-next-line no-console
    .then(({ data }) => console.log(data))
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err))

// Mint NFT - Helper Function
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios')

module.exports.mintNFT = async (s3ObjectKey) => {
    try {
        // Replace 'YOUR_NFTPORT_API_KEY' with your actual API key from NFTport
        const apiKey = 'YOUR_NFTPORT_API_KEY'

        // NFTport API endpoint for minting NFT
        const nftportApiEndpoint = 'https://api.nftport.xyz/mint'

        // Replace 'YOUR_COLLECTION_ID' with the actual collection ID from NFTport
        const collectionId = 'YOUR_COLLECTION_ID'

        // Data to be sent to the NFTport API
        const requestData = {
            apiKey,
            collectionId,
            metadata: {
                // Add any additional metadata for your NFT
                name: 'My NFT',
                description: 'This is a sample NFT minted using the NFTport API',
                image: `https://s3.amazonaws.com/YOUR_S3_BUCKET_NAME/${s3ObjectKey}`, // Replace with your S3 bucket details
            },
        }

        // Make a POST request to the NFTport API
        const response = await axios.post(nftportApiEndpoint, requestData)

        // Handle the response from NFTport
        console.log('NFT Minting Response:', response.data)
        return response.data
    } catch (error) {
        console.error('Error minting NFT:', error.response ? error.response.data : error.message)
        throw error
    }
}
