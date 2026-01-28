#!/bin/bash

CLIENT_KEY="b8f8801215bd8da4b677567e818c073a"
SECRET_KEY="c45f7509c9a2f1f6f8a5390c0860a86f89072f4c4a051d26955c05e33686a11a"
METHOD="GET"
URI="https://sellerapi.kaufland.com/v2/products/ean/4010884503135?storefront=de&embedded=category"
BODY=""
TIMESTAMP=$(date +%s)

# Generate the signature string (method, uri, body, timestamp separated by ACTUAL newlines)
SIGNATURE_STRING="$METHOD
$URI
$BODY
$TIMESTAMP"

# Generate HMAC-SHA256 signature
SIGNATURE=$(printf "%s" "$SIGNATURE_STRING" | openssl dgst -sha256 -hmac "$SECRET_KEY" | awk '{print $2}')

# Make the request with verbose output to see what's happening
curl -v -X GET "$URI" \
  -H "Accept: application/json" \
  -H "X-Shop-Client-Key: $CLIENT_KEY" \
  -H "X-Shop-Timestamp: $TIMESTAMP" \
  -H "X-Shop-Signature: $SIGNATURE" \
  -H "User-Agent: Inhouse_development"