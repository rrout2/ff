import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(script_dir, 'email_to_buys', 'april2025', 'email_to_buys.json'), 'r') as file:
    data = json.load(file)

keys = [item for item in data]
print(','.join(keys))
