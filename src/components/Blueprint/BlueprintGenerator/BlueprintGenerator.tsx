import {useEffect, useRef, useState} from 'react';
import {
    useFetchRosters,
    useFetchUsers,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../../hooks/hooks';
import {Roster} from '../../../sleeper-api/sleeper-api';
import styles from './BlueprintGenerator.module.css';
import {teamSelectComponent} from '../../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../../consts/urlParams';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {sortBySearchRank} from '../../Player/Search/PlayerSearch';
import {toPng} from 'html-to-image';
export default function BlueprintGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const specifiedUser = allUsers?.[+teamId];
    const componentRef = useRef(null);
    const [cornerstones, setCornerstones] = useState(
        new Map<string, string[]>([
            ['QB', []],
            ['RB', []],
            ['WR', []],
            ['TE', []],
        ])
    );

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setCornerstones(
            new Map<string, string[]>([
                ['QB', []],
                ['RB', []],
                ['WR', []],
                ['TE', []],
            ])
        );
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

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
            <div
                className={styles.cornerstoneAssetsComponent}
                ref={componentRef}
            >
                <div className={styles.positions}>
                    {['QB', 'RB', 'WR', 'TE'].map(pos => (
                        <div className={styles.column}>
                            <div
                                className={`${styles.positionChip} ${styles[pos]}`}
                            >
                                {pos}
                            </div>
                            <div className={styles.cornerstoneList}>
                                {cornerstones
                                    .get(pos)!
                                    .map(playerId => playerData[playerId])
                                    .map(player => {
                                        return (
                                            <div>
                                                {`${player.first_name} ${player.last_name}`.toLocaleUpperCase()}
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

    function exportButton() {
        return (
            <Button
                onClick={() =>
                    toPng(
                        document.getElementsByClassName(
                            styles.cornerstoneAssetsComponent
                        )[0] as HTMLElement,
                        {backgroundColor: 'rgba(0, 0, 0, 0)'}
                    ).then(dataUrl => {
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = `${specifiedUser?.username}_cornerstones.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                }
            >
                Export As PNG
            </Button>
        );
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser)}
            {hasTeamId() && allPositionalSelectors()}
            {hasTeamId() && cornerstoneAssetsComponent()}
            {hasTeamId() && exportButton()}
            {}
        </div>
    );
}
