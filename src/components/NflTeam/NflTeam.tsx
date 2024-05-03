import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {usePlayerData} from '../../hooks/hooks';
import {Player} from '../../sleeper-api/sleeper-api';
import PlayerPreview from '../Player/PlayerPreview/PlayerPreview';
import {LEAGUE_ID, TEAM_CODE} from '../../consts/urlParams';
import {InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select';
import styles from './NflTeam.module.css';
import Menu from '../Menu/Menu';

// dynasty-ff#/nfl?teamCode=...&leagueId=...
export default function NflTeam() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [teamCode, setTeamCode] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    const playerData = usePlayerData();

    useEffect(() => {
        setTeamCode(searchParams.get(TEAM_CODE) ?? 'Choose a team:');
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (!teamCode || teamCode === 'Choose a team:') {
            setTeamPlayers([]);
            // setTeamCode('Choose a team:');
            return;
        }
        const players: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (player.team === teamCode) {
                players.push(player);
            }
        }
        players.sort((playerA, playerB) => {
            // 1) By NFL position
            const posSort = playerA.position.localeCompare(playerB.position);
            if (posSort) return posSort;

            // 2) By depth chart position
            if (playerB.depth_chart_order && playerA.depth_chart_order) {
                return playerA.depth_chart_order - playerB.depth_chart_order;
            }

            // 3) Prefer non-null depth chart positions
            if (!playerB.depth_chart_order || !playerA.depth_chart_order) {
                if (playerA.depth_chart_order) return -1;

                if (playerB.depth_chart_order) return 1;
            }

            // 4) Same NFL position + null depth chart position
            return 0;
        });
        setTeamPlayers(players);
    }, [playerData, teamCode]);

    function rosterComponent() {
        return teamPlayers.map(p => (
            <PlayerPreview player={p} leagueId={leagueId} />
        ));
    }

    function inputComponent() {
        return (
            <FormControl>
                <InputLabel>Team</InputLabel>
                <Select
                    value={teamCode}
                    label="Team"
                    onChange={(event: SelectChangeEvent) => {
                        setTeamCode(event.target.value);
                        setSearchParams(searchParams => {
                            searchParams.set(
                                TEAM_CODE,
                                event.target.value as string
                            );
                            return searchParams;
                        });
                    }}
                >
                    <MenuItem value={'Choose a team:'}>Choose a team:</MenuItem>
                    <MenuItem value={'ARI'}>ARI</MenuItem>
                    <MenuItem value={'ATL'}>ATL</MenuItem>
                    <MenuItem value={'BAL'}>BAL</MenuItem>
                    <MenuItem value={'BUF'}>BUF</MenuItem>
                    <MenuItem value={'CAR'}>CAR</MenuItem>
                    <MenuItem value={'CHI'}>CHI</MenuItem>
                    <MenuItem value={'CIN'}>CIN</MenuItem>
                    <MenuItem value={'CLE'}>CLE</MenuItem>
                    <MenuItem value={'DAL'}>DAL</MenuItem>
                    <MenuItem value={'DEN'}>DEN</MenuItem>
                    <MenuItem value={'DET'}>DET</MenuItem>
                    <MenuItem value={'GB'}>GB</MenuItem>
                    <MenuItem value={'HOU'}>HOU</MenuItem>
                    <MenuItem value={'IND'}>IND</MenuItem>
                    <MenuItem value={'JAX'}>JAX</MenuItem>
                    <MenuItem value={'KC'}>KC</MenuItem>
                    <MenuItem value={'LV'}>LV</MenuItem>
                    <MenuItem value={'LAC'}>LAC</MenuItem>
                    <MenuItem value={'LAR'}>LAR</MenuItem>
                    <MenuItem value={'MIA'}>MIA</MenuItem>
                    <MenuItem value={'MIN'}>MIN</MenuItem>
                    <MenuItem value={'NE'}>NE</MenuItem>
                    <MenuItem value={'NO'}>NO</MenuItem>
                    <MenuItem value={'NYG'}>NYG</MenuItem>
                    <MenuItem value={'NYJ'}>NYJ</MenuItem>
                    <MenuItem value={'PHI'}>PHI</MenuItem>
                    <MenuItem value={'PIT'}>PIT</MenuItem>
                    <MenuItem value={'SF'}>SF</MenuItem>
                    <MenuItem value={'SEA'}>SEA</MenuItem>
                    <MenuItem value={'TB'}>TB</MenuItem>
                    <MenuItem value={'TEN'}>TEN</MenuItem>
                    <MenuItem value={'WAS'}>WAS</MenuItem>
                </Select>
            </FormControl>
        );
    }

    return (
        <div className={styles.nflTeam}>
            <div className={styles.menuWrapper}>
                <div className={styles.flexSpace} />
                <div>{inputComponent()}</div>
                <div className={styles.flexSpace}>
                    <Menu />
                </div>
            </div>

            {rosterComponent()}
        </div>
    );
}
