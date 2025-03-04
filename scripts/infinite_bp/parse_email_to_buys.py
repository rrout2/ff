import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(script_dir, 'email_to_buys.json'), 'r') as file:
    email_to_buys = json.load(file)

print(','.join(email_to_buys.keys()))

with open(os.path.join(script_dir, 'email_to_buys 2.json'), 'r') as file:
    email_to_buys = json.load(file)

print(','.join(email_to_buys.keys()))