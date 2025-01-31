import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the JSON file name
json_file_name = 'domain_customer_info_feb.json'

# Construct the full path to the JSON file
json_file_path = os.path.join(script_dir, json_file_name)

league_id_key = "What is the Sleeper League ID for this team? (the number in the URL, on MOBILE its in your league settings)"
team_id_key = "What is your Sleeper TEAM ID? (follow the link to find your team ID, it should be a 1-12 (or however many teams are in your league) number"
team_id_subkey = '\r\n\r\nFIND YOUR TEAM ID HERE\r\nTEAM ID FINDER'
email_key = 'What is your email address? (We will send your Infinite Blueprint to this email each month)'
verified_key = 'Column 1\r'
# Open and read the JSON file
try:
    with open(json_file_path, 'r') as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"Error: {json_file_name} not found in the directory {script_dir}")
except json.JSONDecodeError as e:
    print(f"Error: Failed to decode JSON - {e}")

league_ids = [item[league_id_key] for item in data if item[verified_key] == 'Verified\r']
print('League IDs:')
print(','.join(league_ids))
print('\nTeam IDs:')
team_ids = [str(item[team_id_key][team_id_subkey]) for item in data if item[verified_key] == 'Verified\r']
print(','.join(team_ids))
print('\nEmails:')
emails = [item[email_key] for item in data if item[verified_key] == 'Verified\r']
print(','.join(emails))