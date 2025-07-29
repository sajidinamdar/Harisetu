from passlib.context import CryptContext

# Test if passlib is working
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("test_password")
print(f"Hashed password: {hashed_password}")
print("Passlib import and usage successful!")