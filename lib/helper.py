"""
This is a helper function to make api calls
to public api for provided api_key and url and
to get credentials from aws secrets manager.
"""
import json
import requests
import boto3
from botocore.exceptions import ClientError


# The `headers` dictionary is defining the headers that will be sent along with
# the API request.
headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': True,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
}


def api_request(api_key, api_url, payload=None, method="GET"):
    """
    The `api_request` function sends HTTP requests to an API using the provided
    API key, URL, payload, and method.
    
    :param api_key: The `api_key` parameter is the authorization key required to
        access the API. It is
    used in the `Authorization` header of the API request :param api_url: The
    `api_url` parameter is the URL of the API endpoint that you want to make a
    request to. It should be a string that specifies the complete URL, including
    the protocol (e.g., "http://example.com/api/endpoint") :param payload: The
    `payload` parameter is used to pass data to the API request. It is optional
    and can be used when making a POST request to send data to the API. The
    payload should be a JSON object containing the necessary data for the
    request :param method: The "method" parameter is used to specify the HTTP
    method to be used in the API request. It can be either "GET" or "POST". If
    "GET" is specified, the function will send a GET request to the API URL. If
    "POST" is specified, the function will, defaults to GET (optional) :return:
    the response object from the API request.
    """
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": api_key
    }
    if method == "POST":
        response = requests.post(api_url, json=payload, headers=headers)
    elif method == "GET":
        response = requests.get(api_url, headers=headers)
    return response


def get_secret_credentials(secret_name, region):
    """
    The function `get_secret_credentials` retrieves secret credentials from AWS
    Secrets Manager using the provided secret name and region.
    
    :param secret_name: The `secret_name` parameter is the name or ARN (Amazon
        Resource Name) of the
    secret in AWS Secrets Manager. It is used to identify the secret from which
    you want to retrieve the credentials :param region: The `region` parameter
    is the AWS region where the Secrets Manager service is located. It specifies
    the geographical region where the secret is stored. For example, 'us-west-2'
    represents the US West (Oregon) region :return: the secret credentials
    retrieved from AWS Secrets Manager.
    """
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region
    )
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        secret = json.loads(get_secret_value_response.get('SecretString'))
    except ClientError as err:
        raise err
    return secret
