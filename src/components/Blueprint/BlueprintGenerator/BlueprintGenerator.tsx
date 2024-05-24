import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useFetchUsers,
    useLeagueIdFromUrl,
    usePlayerData,
    useProjectedLineup,
} from '../../../hooks/hooks';
import {
    League,
    Player,
    Roster,
    getLeague,
} from '../../../sleeper-api/sleeper-api';
import styles from './BlueprintGenerator.module.css';
import {teamSelectComponent} from '../../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../../consts/urlParams';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {sortBySearchRank} from '../../Player/Search/PlayerSearch';
export default function BlueprintGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    const [league, setLeague] = useState<League>();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const specifiedUser = allUsers?.[+teamId];
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    const [cornerstones, setCornerstones] = useState(
        new Map<string, string[]>([
            ['QB', []],
            ['RB', []],
            ['WR', []],
            ['TE', []],
        ])
    );

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
    }, [leagueId]);

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

    useEffect(() => {
        const settings = new Map<string, number>();
        league?.roster_positions.forEach(pos => {
            if (!settings.has(pos)) {
                settings.set(pos, 0);
            }
            settings.set(pos, settings.get(pos)! + 1);
        });
        setRosterSettings(settings);
    }, [league?.roster_positions]);

    function playerSelectComponent(
        players: string[],
        selectedPlayerIds: string[],
        onChange: (event: SelectChangeEvent<string[]>) => void,
        position: string
    ) {
        if (!playerData) return <></>;
        return (
            <FormControl>
                <InputLabel>{position}</InputLabel>
                <Select
                    value={selectedPlayerIds}
                    label={position}
                    onChange={onChange}
                    multiple={true}
                >
                    {players
                        .map(playerId => playerData[playerId])
                        .filter(player =>
                            player.fantasy_positions.includes(position)
                        )
                        .sort(sortBySearchRank)
                        .map((player, idx) => (
                            <MenuItem value={player.player_id} key={idx}>
                                {player.first_name} {player.last_name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        );
    }

    function cornerstoneAssetsComponent() {
        if (!playerData) return <></>;
        return (
            <div>
                <div className={styles.positions}>
                    {['QB', 'RB', 'WR', 'TE'].map(pos => (
                        <div>
                            <div
                                className={`${styles.positionChip} ${styles[pos]}`}
                            >
                                {pos}
                            </div>
                            <div>
                                {cornerstones
                                    .get(pos)!
                                    .map(playerId => playerData[playerId])
                                    .map(player => {
                                        return (
                                            <div>
                                                {player.first_name}{' '}
                                                {player.last_name}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function allPositionalSelectors() {
        return ['QB', 'RB', 'WR', 'TE'].map(pos =>
            playerSelectComponent(
                roster?.players ?? [],
                cornerstones.get(pos) ?? [],
                (e: SelectChangeEvent<string[]>) => {
                    const {
                        target: {value},
                    } = e;
                    cornerstones.set(
                        pos,
                        typeof value === 'string' ? value.split(',') : value
                    );
                    setCornerstones(new Map(cornerstones));
                },
                pos
            )
        );
    }

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser)}
            {hasTeamId() && allPositionalSelectors()}
            {hasTeamId() && cornerstoneAssetsComponent()}
        </div>
    );
}
