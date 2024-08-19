import {useEffect, useState} from 'react';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import styles from './CornerstonesModule.module.css';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import {positionToColor} from '../../consts/colors';
import {mapToFullTeamName} from '../../consts/nflTeamNames';
import {Grid} from '@mui/material';

interface CornerstonesModuleProps {
    roster?: Roster;
}

export default function CornerstonesModule(props: CornerstonesModuleProps) {
    const {roster} = props;
    const [cornerstones, setCornerstones] = useState<string[]>([]);
    const playerData = usePlayerData();
    const {getPositionalAdp, sortByAdp} = useAdpData();

    useEffect(() => {
        if (!roster || !playerData) return;
        setCornerstones(
            roster.players
                .map(p => playerData[p])
                .sort(sortByAdp)
                .map(p => p.player_id)
                .slice(0, 4)
        );
    }, [roster, playerData]);

    function cornerstoneTile(playerId: string) {
        if (!playerData) return <></>;
        const player = playerData[playerId];
        const position = player.position;
        return (
            <div
                className={styles.cornerstoneTile}
                style={{
                    background: positionToColor[position],
                }}
            >
                <img
                    src={`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`}
                    onError={({currentTarget}) => {
                        currentTarget.onerror = null;
                        currentTarget.src =
                            'https://sleepercdn.com/images/v2/icons/player_default.webp';
                    }}
                    className={styles.headshot}
                />
                <div className={styles.positionalAdp}>
                    {player.position}{' '}
                    {getPositionalAdp(
                        `${player.first_name} ${player.last_name}`
                    )}
                </div>
                <div className={styles.tileText}>
                    <div className={styles.firstName}>
                        {player.first_name.toLocaleUpperCase()}
                    </div>
                    <div className={styles.lastName}>
                        {player.last_name.toLocaleUpperCase()}
                    </div>
                    <div className={styles.teamName}>
                        {mapToFullTeamName.get(player.team)}
                    </div>
                    <div className={styles.number}># {player.number}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.CornerstonesModule}>
            <InputComponent
                playerIds={roster?.players ?? []}
                cornerstones={cornerstones}
                setCornerstones={setCornerstones}
            />
            <Grid container spacing={0} style={{width: '1000px'}}>
                {cornerstones.map(playerId => (
                    <Grid item xs={6}>
                        {cornerstoneTile(playerId)}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

interface InputComponentProps {
    playerIds: string[];
    cornerstones: string[];
    setCornerstones: (newCornerstones: string[]) => void;
}
export function InputComponent(props: InputComponentProps) {
    const {playerIds, cornerstones, setCornerstones} = props;
    // useEffect(() => {
    //     setCornerstones([]);
    // }, [playerIds]);
    return (
        <PlayerSelectComponent
            playerIds={playerIds}
            selectedPlayerIds={cornerstones}
            onChange={setCornerstones}
            label="Cornerstones"
        />
    );
}
