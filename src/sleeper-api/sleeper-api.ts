import axios from "axios";

export type league = {
    league_id: string;
    name: string;
};

export type roster = {
    starters: string[];
    roster_id: string;
    players: string[];
    owner_id: string;
    settings: {
        wins: number;
        ties: number;
        losses: number;
        fpts: number;

        waiver_position: number;
        waiver_budget_used: number;
    }
}

export async function getLeague(leagueId: string): Promise<league> {
    const response = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}`);
    return response.data as league;
}

export async function getRosters(leagueId: string): Promise<roster[]> {
    const response = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    return response.data;;
}
