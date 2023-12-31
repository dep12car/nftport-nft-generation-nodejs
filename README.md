# Generating NFT Metadata and Minting NFT's

## Contents ##
1. Generate NFT MetaData
2. Batch Mining NFT
3. Batch Transfer NFT
4. Fetch NFT Details

## Additional Contents ##
1. Helper function to retrieve API Keys/Credentials from AWS Secrets Manager (Node JS and Python)
2. Helper function to call external API's (Node JS and Python)
3. Mongoose Schema for NFT collection (Node JS)

## NFT Creation Image in OpenSea Platform (Linked to Metamask Wallet) ##
`Image of an Minted NFT`

![NFT Image of Iphone 15](/images/NFT-image.png)

`All NFT's linked to Account`

![All NFT's registered in account](/images/All-Nft-Images.png)
## Usage ##
### Node JS ###
`Function Call to Generate NFT Metadata`

`Example ENV (In Serverless File)`
```
GENERATE_NFT_METADATA: ${self:service}-${opt:stage, self:provider.stage}-generate-nft-metadata
```

`Example Body / Event Object`
```
{
  "name": "Test with NFT",
  "brand_name": "Test",
  "sku": "M12345",
  "category": "6543825a1ee469c534a01468",
  "availability": "false",
  "description": "The latest flagship smartphone from Apple.",
  "images": [
    "https://example.com/images/iphone-front.jpg",
    "https://example.com/images/iphone-back.jpg"
  ],
  "videos": [
    "https://example.com/videos/iphone-unboxing.mp4",
    "https://example.com/videos/iphone-features.mp4"
  ],
  "nft": "public/nft/images/6c7dfc68-fe05-3c63-8e95-5e46b43f9b1d/cat_in_beach.jpg",
  "listing_price": 25.99,
  "selling_price": 19.99,
  "discount": 6,
  "attributes": {
    "model": "15 Pro Max",
    "color": "Space Gray",
    "storage": "256GB",
    "screen_size": "6.7 inches",
    "camera": "Triple camera setup",
    "processor": "A15 Bionic"
  },
  "store_email_address": "qiwozocaw@mailinator.com",
  "merchant_email_address": "qiwozocaw@mailinator.com"
}
```

`Code to Invoke Asynchronous Lambda for Generating NFT Metadata (generateNftMetadata.js)`
```
const lambda = new AWS.Lambda()
// Create parameters for invoking the "generateNftMetadata" Lambda function
const params = {
    FunctionName: process.env.GENERATE_NFT_METADATA,
    InvocationType: 'Event', // Async
    Payload: JSON.stringify(payload), // Pass the event to the other Lambda function
}

// Invoke lambda asynchronously
try {
    await lambda.invoke(params).promise()
    // Invocation successful
} catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error invoking Lambda:', err)
}
```

### Python ###
`Function to transfer NFT to selected customer.`

`Example ENV (In Serverless File)`

```
ADD_NFT: ${self:service}-${opt:stage, self:provider.stage}-add-nft

```
`Example Event Object Data`
```
{
  "customer_address": "0xebb067AF328B75782e299ChF67215456Ea25BdbB",
  "products": [
    "65449b434bed5ba3e65320d1",
    "65449cd2aa10c9424503b4f4"
  ]
}
```

`Code to Invoke Asynchronous Lambda for creating and transfering NFT (add_nft.py)`
```
# Asynchronously call the handler to initiate 
# creation and transfer of NFT to destination.

lambda_client = boto3.client('lambda')
payload = event
lambda_client.invoke(
    # env defined in yml file
    FunctionName=os.environ.get('ADD_NFT'),
    InvocationType='Event',
    Payload=json.dumps(payload)
)
```

## Credits ##
#### [Deepak Boniface Cardoza - Node JS Developer](mailto:deepak.cardoza@7edge.com) ####

#### [Praneeth Shetty - Python Developer](mailto:praneeth.shetty@7edge.com) ####