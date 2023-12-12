"""
this handler is used to mint nfts
takes the data required from create product
"""
import os
from bson import ObjectId
from pymongo import MongoClient
from time import sleep
import json
import uuid
from lib.helper import headers
from lib.helper import api_request, get_secret_credentials

# secret manager details
# nft_secret_name = os.environ['NFT_SECRET_NAME']
region = os.environ["REGION"]
# account details related to nft
nft_secret_credentials = get_secret_credentials(
    secret_name=os.environ["NFT_SECRET_NAME"], region=os.environ["REGION"]
)
api_key = nft_secret_credentials.get("NFT_PORT_API_KEY")
contract_address = nft_secret_credentials.get("NFT_PORT_CONTRACT_ADDRESS")
account_address = nft_secret_credentials.get("METAMASK_ACCOUNT_ADDRESS")
# nft related other details
api_base_url = os.environ["NFT_PORT_END_POINT"]
s3_file_url = os.environ["S3_NFT_IMAGE_URL"]
chain = os.environ["NFT_CHAIN"]
# mongo db database details
client = MongoClient(os.environ["MONGODB_CONNECTION_STRING"])
db = client.get_database()
collection = db[os.environ["NFT_TABLE_NAME"]]


def handler(event, _context):
    """
    The above function handles the transfer of NFTs (Non-Fungible Tokens) based
    on the provided event data, including customer address and product details.
    
    It typically includes details such as
    the AWS request ID, function name, and other metadata related to the
    execution context. In this code snippet, the `_context` parameter is not
    used, so it can :return: The code is returning a JSON response with a status
    code, headers, and a message indicating whether the NFT transfer was
    successful or not. If the transfer was successful, the status code will be
    200 and the message will be "Successfully transferred the NFT." If the
    transfer failed, the status code will be 400 and the message will be "failed
    to transfer NFT."
    """
    data = json.loads(event["body"])
    customer_address = data["customer_address"]
    products = data["products"]
    # token definition
    tokens = []
    transer_tokens = []
    # The code block you provided is iterating over a list of `products` and
    # performing the following actions for each product:
    for product in products:
        token = {}
        token_id = uuid.uuid1().int  # generate token ID
        product_id = ObjectId(str(product["product_id"]))

        metadata = get_nft_details(product_id)
        if not metadata:
            print("Failed to fetch NFT metadata.")
            return None

        # assuming 'metadata_uri' is a key in the metadata
        metadata_uri = metadata["metadata_uri"]
        if not metadata_uri:
            print("Metadata URI not found.")
            return None

        token = {
            "mint_to_address": account_address,
            "token_id": token_id,
            "metadata_uri": metadata_uri,
            "quantity": int(product["quantity"]),
        }
        # append a copy to avoid reference modification
        mint_token = token.copy()
        tokens.append(mint_token)
        token.pop("metadata_uri")
        token.pop("mint_to_address")
        token["transfer_to_address"] = customer_address
        # append a copy to avoid reference modification
        transer_tokens.append(token)
    # batch minting the nft
    nft_mint_response = customizable_minting(tokens=tokens)
    transaction_hash = nft_mint_response["transaction_hash"]
    # nft details retrival
    # wait till minting done
    nft_res = "NOK"
    counter = 0
    while (nft_res == "NOK") and (counter < 8):
        nft_details = retrive_nft(transaction_hash)
        nft_res = nft_details["response"]
        sleep(5)
        counter += 1
    print("Total attempts to transfer : ", counter)
    # batch transfering the nft
    nft_transfer_response = transfer_nft(transer_tokens=transer_tokens)
    # error check for mint fail
    if nft_mint_response["response"] == "NOK":
        print("Minting:\n", nft_mint_response)
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"message": "failed to transfer NFT."}),
        }
    # error check for transer fail
    if nft_transfer_response["response"] == "NOK":
        print("Transfer:\n", nft_transfer_response)
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"message": "failed to transfer NFT."}),
        }
    # success result
    print("Successfully transfered the NFT.")
    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"message": "Successfully transfered the NFT."}),
    }


def customizable_minting(tokens):
    """
    The function `customizable_minting` sends a POST request to a specified API endpoint with a payload
    containing chain, contract address, and tokens, and returns the JSON response.
    
    :param tokens: The "tokens" parameter is the tokens you want to mint.
    :return: the response from the API request in JSON format.
    """
    payload = {"chain": chain, "contract_address": contract_address, "tokens": tokens}
    api_url = api_base_url + "/mints/customizable/batch"
    response = api_request(api_key, api_url, payload, method="POST")
    return response.json()


def transfer_nft(transer_tokens):
    """
    The function `transfer_nft` transfers a batch of tokens to a specified
    contract address on a specified chain using an API request.
    
    :param transer_tokens: The parameter "transer_tokens" represents the tokens
        that you want to
    transfer.
    """
    payload = {
        "chain": chain,
        "contract_address": contract_address,
        "tokens": transer_tokens,
    }
    api_url = api_base_url + "/mints/transfers/batch"
    response = api_request(api_key, api_url, payload, method="POST")
    return response.json()


def retrive_nft(transaction_hash):
    """
    The function retrieves information about an NFT mint transaction using a
    transaction hash.
    
    :param transaction_hash: The transaction hash is a unique identifier for a
        specific transaction on a
    blockchain. It is a long string of characters that is generated when a
    transaction is created and recorded on the blockchain :return: the JSON
    response from the API request.
    """
    api_url = api_base_url + f"/mints/batch/{transaction_hash}?chain={chain}"
    response = api_request(api_key, api_url, method="GET")
    return response.json()


def get_nft_details(product_id):
    """
    The function `get_nft_details` retrieves the details of an NFT (non-fungible
    token) based on its product ID from a collection.
    
    :param product_id: The `product_id` parameter is the unique identifier for
        the NFT (Non-Fungible
    Token) product. It is used to search for the NFT details in the database
    :return: a dictionary containing the details of an NFT (non-fungible token)
    with the specified product ID. If the NFT is found in the collection, the
    function returns a dictionary representation of the NFT data. If the NFT is
    not found or an exception occurs during the database query, the function
    returns None.
    """
    try:
        data = collection.find_one({"product_id": product_id})
    except Exception as e:
        print(e)
        return None
    if data:
        return dict(data)
    return None
