**Ethereum (Mainnet and Goerli) and Polygon are supported**

Docs - https://docs.nftport.xyz/

API Reference - https://docs.nftport.xyz/reference/retrieve-contract-nfts

NFT Minting QuickStart Guide - https://docs.nftport.xyz/docs/minting-quickstart

**Easy Minting Process Steps:**

1. Add Product NFT -  https://docs.nftport.xyz/reference/easy-minting-urls (Requires Account Address - Ex Metamask)
2. Edit Product NFT - https://docs.nftport.xyz/reference/update-minted-nft (Requires Contract Address where the NFT is Minted)
3. Transfer Minted NFT - https://docs.nftport.xyz/reference/transfer-minted-nft 
    ( Requires Contract Address, where the NFT is minted and To Address to transfer - Metamask wallet address)
4. Delete Product NFT  - https://docs.nftport.xyz/reference/burn-minted-nft


**Custom Minting Process Steps**
1. Deploy a contract for NFT products - https://docs.nftport.xyz/reference/deploy-nft-product-contract
2. Upload metadata to IPFS - https://docs.nftport.xyz/reference/upload-metadata-to-ipfs
3. Add Product NFT (Customized) - https://docs.nftport.xyz/reference/customizable-minting
4. Edit Product NFT - (Same as above)
5. Transfer Minted NFT (Same as above)
6. Delete Product NFT - (Same as above)

**Questions**

Whether the 3rd party Platform like Metamask, is it unique for a merchant  ? Or just single account to MaisonQR ??

We need to Deploy a contract before minting a NFT to it. Within that contract there can be some collections and in those collections Product NFT's can be registered.
Is that contract is unique for all the merchants or a single contract of MaisonQR ?

When we edit the product NFT, the NFT needs to updated or deleted and recreated. So which one do we have to do ?
    1. Delete the NFT (Burn NFT)
    2. Update the existing NFT details (Some things like name of the NFT and all cannot be changed)

Also, We need an account address / wallet address (ex: Metamask) and an contract address of NFTPort where the mints are registered. From where can we get these for testing ??

Confirmed -  Single Account for Metamask or any Platform
Confirmed - Single Contract in NFTPort to Mint the Product NFT's
Confirmed - Mint the NFT's during customer order creation (with Quantity - Batch Mint - ERC1155)