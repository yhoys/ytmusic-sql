# =============================================================================
# YouTube Music SQL - OAuth Setup
# =============================================================================
# Run this script to generate auth/oauth.json when ytmusicapi fixes the OAuth bug.
# Requires OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET in .env
#
# Run with: python auth/setup_oauth.py
# =============================================================================
import os
import json
from dotenv import load_dotenv
from ytmusicapi.auth.oauth.credentials import OAuthCredentials

load_dotenv()

CLIENT_ID = os.getenv("OAUTH_CLIENT_ID")
CLIENT_SECRET = os.getenv("OAUTH_CLIENT_SECRET")

credentials = OAuthCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
code_response = credentials.get_code()

print(f"\nVe a: {code_response['verification_url']}")
print(f"Código: {code_response['user_code']}")
input("\nPresiona Enter cuando hayas autorizado...")

raw_token = credentials.token_from_code(code_response["device_code"])

# Remove field not supported by current ytmusicapi versions
raw_token.pop("refresh_token_expires_in", None)

token_data = {
    "access_token": raw_token["access_token"],
    "refresh_token": raw_token["refresh_token"],
    "token_type": raw_token["token_type"],
    "scope": raw_token["scope"],
    "expires_at": raw_token.get("expires_at", 0),
    "expires_in": raw_token.get("expires_in", 3600),
}

with open("auth/oauth.json", "w") as f:
    json.dump(token_data, f, indent=2)

print("\nauth/oauth.json creado exitosamente")
