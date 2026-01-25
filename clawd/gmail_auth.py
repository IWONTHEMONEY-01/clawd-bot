"""Gmail OAuth2 Authentication Script"""
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ['https://mail.google.com/']
CREDENTIALS_FILE = 'gmail_credentials.json'
TOKEN_FILE = 'gmail_token.json'

def authenticate():
    creds = None
    
    # Load existing token if available
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # If no valid creds, run the OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            # Use console flow instead of local server
            creds = flow.run_local_server(port=8080, open_browser=True, prompt='consent')
        
        # Save the token for future use
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    print("✅ Gmail authenticated successfully!")
    print(f"Token saved to: {os.path.abspath(TOKEN_FILE)}")
    return creds

if __name__ == '__main__':
    authenticate()
