import bcrypt

# def hash_password(password, salt):
#     salted_password = password + salt
#     hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()
#     return hashed_password


password = "burungkuntul"

# generate a salt
salt = bcrypt.gensalt()

# hash the salted password
hashed_password = bcrypt.hashpw(password.encode(), salt)

print(f"Salt: {salt}")
print(f"Hashed password: {hashed_password}")

if bcrypt.checkpw("password".encode(), hashed_password):
    print("Passwords match")
