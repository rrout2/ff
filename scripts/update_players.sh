#!/bin/bash

curl "https://api.sleeper.app/v1/players/nfl" > src/data/players.json
git add src/data/players.json
git commit -m "updated players.json via bash script"
git push
