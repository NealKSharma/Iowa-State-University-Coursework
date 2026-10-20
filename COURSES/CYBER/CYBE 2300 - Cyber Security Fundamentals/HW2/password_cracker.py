import crypt
import concurrent.futures
import sys
from datetime import datetime

TARGET = "$6$xgLS35S6$2UjEq.dUhICPw9zgDVJXcQYQp/9ilLPQt/8Zgu0uwngI5mVvB1eKQG9SnVLjmOOfkB4Jjb5VSAXGXjY4Cf5k90"
SALT = "$6$xgLS35S6$"
FILE = "100k-most-used-passwords-NIST.txt"

def check_password(guess):
    try:
        if crypt.crypt(guess, SALT) == TARGET:
            return guess
    except OSError:
        pass
    return None

def main():
    starting_time = datetime.now()
    with open(FILE, "r", encoding="utf-8") as file:
        guesses = [line.strip() for line in file]
    print("Started Searching")
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for result in executor.map(check_password, guesses, chunksize=25):
            if result:
                hash = crypt.crypt(result, SALT)
                print(f"Password is: {result}")
                print(f"Hash: {hash}")
                print(f"Time taken: {datetime.now() - starting_time}")
                executor.shutdown(wait=False, cancel_futures=True)
                sys.exit(0)

    print("Password not found")
    print(f"Time taken: {datetime.now() - starting_time}")

if __name__ == '__main__':
    main()
