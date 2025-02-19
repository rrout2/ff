import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the JSON file name
json_file_name = 'domain_customer_info_feb16.json'

# Construct the full path to the JSON file
json_file_path = os.path.join(script_dir, json_file_name)

league_id_key = "league_id"
team_id_key = "team_id"
# sub_team_id_key = "\r\n\r\nFIND YOUR TEAM ID HERE\r\nTEAM ID FINDER"
email_key = "email\r"
# verified_key = 'Column 1\r'
# Open and read the JSON file
try:
    with open(json_file_path, 'r') as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"Error: {json_file_name} not found in the directory {script_dir}")
except json.JSONDecodeError as e:
    print(f"Error: Failed to decode JSON - {e}")

# verified_data = [item for item in data if item[verified_key] == 'Verified\r']
verified_data = data

league_ids = [str(item[league_id_key]) for item in verified_data]
print('League IDs:')
print(','.join(league_ids))
print('\nTeam IDs:')
# team_ids = [str(item[team_id_key][sub_team_id_key]) for item in verified_data]
team_ids = [str(item[team_id_key]) for item in verified_data]
print(','.join(team_ids))
print('\nEmails:')
emails = [item[email_key].strip() for item in verified_data]
print(','.join(emails))