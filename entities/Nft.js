/* The code `require('dotenv').config()` is used to load environment variables from a .env file into
the process.env object. This allows you to store sensitive information or configuration settings in
a separate file and access them in your code using process.env. */
require('dotenv').config()

const mongoose = require('mongoose')

const { Schema } = mongoose
const stage = process.env.STAGE
// Define the Nft schema with collection name specified
const nftSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    file_url: {
        type: String,
        required: true,
    },
    custom_fields: {
        type: Object,
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    metadata_uri: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Number,
    },
    updated_at: {
        type: Number,
    },
})

// Create the Mongoose model for Nft
const Nft = mongoose.model(`${stage}-nfts`, nftSchema)

// Export the model
module.exports = Nft
