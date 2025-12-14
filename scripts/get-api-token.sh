#!/bin/bash

# API Token Manager
# Manages authentication tokens with automatic refresh when expired

TOKEN_FILE=".api-token"
BASE_URL="${API_BASE_URL:-http://localhost:4000/api}"
EMAIL="${API_EMAIL:-javieron.garcia@gmail.com}"
PASSWORD="${API_PASSWORD:-secret}"

# Function to decode JWT and get expiration timestamp
get_token_expiration() {
    local token=$1
    # Extract payload (second part of JWT)
    local payload=$(echo $token | cut -d. -f2)
    # Add padding if needed
    local padded=$(printf '%s' "$payload" | awk '{ while (length($0) % 4 != 0) $0 = $0 "=" } 1')
    # Decode base64 and extract exp field
    echo $padded | base64 -d 2>/dev/null | grep -o '"exp":[0-9]*' | cut -d: -f2
}

# Function to check if token is still valid
is_token_valid() {
    local token=$1
    local exp=$(get_token_expiration "$token")

    if [ -z "$exp" ]; then
        return 1  # Invalid token format
    fi

    local now=$(date +%s)
    local buffer=3600  # 1 hour buffer before expiration

    if [ $((exp - buffer)) -gt $now ]; then
        return 0  # Token still valid
    else
        return 1  # Token expired or about to expire
    fi
}

# Function to get a fresh token from API
get_fresh_token() {
    curl -s -X POST "$BASE_URL/auth/collaborator/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
        2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4
}

# Main logic
main() {
    local force_refresh=false

    # Check for --force flag
    if [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
        force_refresh=true
    fi

    # Check if token file exists and token is valid
    if [ -f "$TOKEN_FILE" ] && [ "$force_refresh" = false ]; then
        local stored_token=$(cat "$TOKEN_FILE")

        if is_token_valid "$stored_token"; then
            # Token is still valid, use it
            echo "$stored_token"

            # Show expiration info if verbose
            if [ "$1" = "--verbose" ] || [ "$1" = "-v" ]; then
                local exp=$(get_token_expiration "$stored_token")
                local exp_date=$(date -d @$exp 2>/dev/null || date -r $exp 2>/dev/null)
                >&2 echo "Using cached token (expires: $exp_date)"
            fi

            exit 0
        else
            >&2 echo "Token expired, getting fresh one..."
        fi
    fi

    # Get fresh token
    local new_token=$(get_fresh_token)

    if [ -z "$new_token" ]; then
        >&2 echo "Error: Failed to get authentication token"
        exit 1
    fi

    # Save token to file
    echo "$new_token" > "$TOKEN_FILE"
    chmod 600 "$TOKEN_FILE"  # Secure the file

    # Show success message
    if [ "$1" = "--verbose" ] || [ "$1" = "-v" ]; then
        local exp=$(get_token_expiration "$new_token")
        local exp_date=$(date -d @$exp 2>/dev/null || date -r $exp 2>/dev/null)
        >&2 echo "New token obtained (expires: $exp_date)"
    fi

    echo "$new_token"
}

# Run main function
main "$@"
