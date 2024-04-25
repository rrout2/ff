import axios from 'axios';

export type League = {
    league_id: string;
    name: string;
};

export type Roster = {
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
    };
};

export type Draft = {
    type: string;
    status: string;
    settings: {
        teams: number;
        slots_wr: number;
        slots_te: number;
        slots_rb: number;
        slots_qb: number;
        slots_k: number;
        slots_flex: number;
        slots_def: number;
        slots_bn: number;
        rounds: number;
        pick_timer: number;
    };
    season_type: string;
    season: string;
    metadata: {
        scoring_type: string;
        name: string;
        description: string;
    };
    league_id: string;
    draft_id: string;
    created: number;
};

export type Pick = {
    player_id: string;
    picked_by: string;
    roster_id: string;
    round: number;
    draft_slot: number;
    pick_no: number;
    metadata: {
        team: string;
        status: string;
        sport: string;
        position: string;
        player_id: string;
        number: string;
        news_updated: string;
        last_name: string;
        injury_status: string;
        first_name: string;
    };
    draft_id: string;
};

export type User = {
    username: string;
    user_id: string;
    display_name: string;
    avatar: string;
};

export type Player = {
    hashtag: string;
    depth_chart_position: number;
    status: string;
    sport: string;
    fantasy_positions: string[];
    number: number;
    search_last_name: string;
    injury_start_date: null | Date;
    weight: string;
    position: string;
    practice_participation: null | string;
    sportradar_id: string;
    team: string;
    last_name: string;
    college: string;
    fantasy_data_id: number;
    injury_status: null | string;
    player_id: string;
    height: string;
    search_full_name: string;
    age: number;
    stats_id: string;
    birth_country: string;
    espn_id: string;
    search_rank: number;
    first_name: string;
    depth_chart_order: number;
    years_exp: number;
    rotowire_id: null | string;
    rotoworld_id: number;
    search_first_name: string;
    yahoo_id: null | string;
};

const BASE_API_URL = 'https://api.sleeper.app/v1';

export async function getLeague(leagueId: string): Promise<League> {
    const response = await axios.get(`${BASE_API_URL}/league/${leagueId}`);
    return response.data;
}

export async function getRosters(leagueId: string): Promise<Roster[]> {
    const response = await axios.get(
        `${BASE_API_URL}/league/${leagueId}/rosters`
    );
    return response.data;
}

export async function getUser(userId: string): Promise<User> {
    const response = await axios.get(`${BASE_API_URL}/user/${userId}`);
    return response.data;
}

export async function getDrafts(leagueId: string): Promise<Draft[]> {
    const response = await axios.get(
        `${BASE_API_URL}/league/${leagueId}/drafts`
    );
    return response.data;
}

export async function getDraft(draftId: string): Promise<Draft[]> {
    const response = await axios.get(`${BASE_API_URL}/draft/${draftId}`);
    return response.data;
}

export async function getAllPicksFromDraft(draftId: string): Promise<Pick[]> {
    const response = await axios.get(`${BASE_API_URL}/league/${draftId}/picks`);
    return response.data;
}

export async function getTradedPicksFromDraft(
    draftId: string
): Promise<Pick[]> {
    const response = await axios.get(
        `${BASE_API_URL}/league/${draftId}/traded_picks`
    );
    return response.data;
}
