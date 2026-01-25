"""Gmail OAuth2 - Manual URL Flow"""
import os
import json
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials

SCOPES = ['https://mail.google.com/']
CREDENTIALS_FILE = 'gmail_credentials.json'
TOKEN_FILE = 'gmail_token.json'

# Create flow with redirect to localhost
flow = Flow.from_client_secrets_file(
    CREDENTIALS_FILE,
    scopes=SCOPES,
    redirect_uri='http://localhost:8080/'
)

# Generate the auth URL
auth_url, state = flow.authorization_url(
    access_type='offline',
    include_granted_scopes='true',
    prompt='consent'
)

print("=" * 60)
print("OPEN THIS URL IN YOUR BROWSER:")
print("=" * 60)
print()
print(auth_url)
print()
print("=" * 60)
print("After you authorize, you'll be redirected to a page that")
print("won't load. COPY THE FULL URL from your browser's address")
print("bar and send it to me.")
print("=" * 60)
