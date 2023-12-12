import requests


def upload_nft_image(file, api_key):
    """
    The function `upload_nft_image` sends a POST request to
    a specified URL with headers and returns the response.
    """
    url = "https://api.nftport.xyz/v0/files"
    headers = {
        "accept": "application/json",
        "content-type": "multipart/form-data",
        "Authorization": api_key
    }
    try:
        response = requests.post(
            url,
            headers=headers,
            files={"file": file}
        )
    except Exception as e:
        return {
            "message": e
        }
    return response


def upload_nft_metadata(api_key, payload):
    """
    The function `upload_nft_metadata` sends a POST request to the
    NFTPort API to upload NFT metadata using the provided API key and payload.
    """
    url = "https://api.nftport.xyz/v0/metadata"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": api_key
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
    except Exception as e:
        return {
            "message": e
        }
    return response


def customizable_minting(api_key, payload):
    """
    The `customizable_minting` function sends a POST request to the NFTPort API
    to mint a customizable NFT using the provided API key and payload.
    """
    url = "https://api.nftport.xyz/v0/mints/customizable"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": api_key
    }

    response = requests.post(url, json=payload, headers=headers)

    return response


def retrive_minted_nft(transaction_hash):
    """
    The function retrieves information about
    a minted NFT using a transaction hash.
    """
    url = f"https://api.nftport.xyz/v0/mints/{transaction_hash}?chain=polygon"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return response


def retrive_contract(transaction_hash):
    """
    The function retrieves contract information using a transaction
    hash from the NFTPort API on the Polygon network.
    """
    url = f"https://api.nftport.xyz/v0/contracts/{transaction_hash}?chain=polygon"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return response
