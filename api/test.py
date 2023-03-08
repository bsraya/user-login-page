import secrets
import hashlib

def hash_password(password, salt):
    salted_password = password + salt
    hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()
    return hashed_password

password = "burungkuntul"

# generate a salt
salt = secrets.token_hex(16)

# salt the password
salted_password = password + salt

# hash the salted password using the `secret` builtin library
hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()

print(f"Salt: {salt}")
print(f"Salted password: {salted_password}")
print(f"Hashed password: {hashed_password}")

if secrets.compare_digest(hashed_password, hash_password("kontol", salt)):
    print("Passwords match")
else:
    print("Passwords do not match")