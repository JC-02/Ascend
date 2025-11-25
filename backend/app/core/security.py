# ============================================
# Ascend AI - Security Utilities
# ============================================
# JWT token validation and security utilities
# Follows CCS Section 8.6.3 (Authentication Integration)
# DIRECTIVE: DIR-008 (Zero Trust Security Protocol)
# ============================================

from jose import JWTError, jwt

from app.core.config import settings


# ============================================
# JWT Decoding Functions
# ============================================
def decode_jwt_token(token: str) -> dict:
    """
    Decode and validate a JWT token.

    This function:
    1. Verifies the token signature using NEXTAUTH_SECRET
    2. Validates the token hasn't expired
    3. Returns the decoded payload

    Args:
        token: The raw JWT token string (without "Bearer " prefix)

    Returns:
        dict: The decoded JWT payload containing claims like:
            - sub: User ID (UUID)
            - exp: Expiration timestamp
            - iat: Issued at timestamp

    Raises:
        JWTError: If the token is invalid, expired, or malformed

    Security Notes:
    - Uses HS256 algorithm (HMAC SHA-256) as specified in CCS
    - Validates signature using NEXTAUTH_SECRET (min 32 characters)
    - Automatically checks expiration time (exp claim)

    Example:
        try:
            payload = decode_jwt_token(token)
            user_id = payload.get("sub")
        except JWTError:
            # Handle invalid token
            pass
    """
    payload = jwt.decode(
        token,
        settings.nextauth_secret,
        algorithms=["HS256"],  # Only HS256 allowed per CCS security specification
    )
    return payload


def verify_token_signature(token: str) -> bool:
    """
    Verify if a JWT token has a valid signature without raising exceptions.

    This is a utility function for checking token validity without
    needing to catch exceptions.

    Args:
        token: The raw JWT token string

    Returns:
        bool: True if token signature is valid, False otherwise

    Example:
        if verify_token_signature(token):
            # Token is valid
            payload = decode_jwt_token(token)
    """
    try:
        jwt.decode(
            token,
            settings.nextauth_secret,
            algorithms=["HS256"],
        )
        return True
    except JWTError:
        return False


def extract_user_id_from_token(token: str) -> str | None:
    """
    Extract the user ID from a JWT token's "sub" claim.

    This is a convenience function that combines decoding and claim extraction.

    Args:
        token: The raw JWT token string

    Returns:
        str | None: The user ID (UUID) if present, None if missing or token invalid

    Example:
        user_id = extract_user_id_from_token(token)
        if user_id:
            # Fetch user from database
            user = await session.get(User, user_id)
    """
    try:
        payload = decode_jwt_token(token)
        return payload.get("sub")
    except JWTError:
        return None
