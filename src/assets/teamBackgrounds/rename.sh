#!/bin/bash

# Function to get standard NFL abbreviation
get_abbr() {
    case "$1" in
        "49ers.png") echo "SF" ;;
        "Bears.png") echo "CHI" ;;
        "Bengals.png") echo "CIN" ;;
        "Bills.png") echo "BUF" ;;
        "Broncos.png") echo "DEN" ;;
        "Browns.png") echo "CLE" ;;
        "Buccs.png") echo "TB" ;;
        "Cardinals.png") echo "ARI" ;;
        "Chargers.png") echo "LAC" ;;
        "Chiefs.png") echo "KC" ;;
        "Colts.png") echo "IND" ;;
        "Commies.png") echo "WAS" ;;
        "Cowboys.png") echo "DAL" ;;
        "Dolphins.png") echo "MIA" ;;
        "Eagles.png") echo "PHI" ;;
        "Falcons.png") echo "ATL" ;;
        "Giants.png") echo "NYG" ;;
        "Jags.png") echo "JAX" ;;
        "Jets.png") echo "NYJ" ;;
        "Lions.png") echo "DET" ;;
        "NFL.png") echo "NFL" ;;
        "Packers.png") echo "GB" ;;
        "Panthers.png") echo "CAR" ;;
        "Pats.png") echo "NE" ;;
        "Raiders.png") echo "LV" ;;
        "Rams.png") echo "LAR" ;;
        "Ravens.png") echo "BAL" ;;
        "Saints.png") echo "NO" ;;
        "Seahawks.png") echo "SEA" ;;
        "Steelers.png") echo "PIT" ;;
        "Texans.png") echo "HOU" ;;
        "Titans.png") echo "TEN" ;;
        "Vikings.png") echo "MIN" ;;
        *) echo "" ;;
    esac
}

# Loop through all PNG files
for file in *.png; do
    # Get abbreviation
    abbr=$(get_abbr "$file")

    # If abbreviation found and it's different from the current name, rename file
    if [ ! -z "$abbr" ] && [ "$file" != "${abbr}.png" ]; then
        mv "$file" "${abbr}.png"
        echo "Renamed $file to ${abbr}.png"
    else
        echo "No change for $file"
    fi
done
