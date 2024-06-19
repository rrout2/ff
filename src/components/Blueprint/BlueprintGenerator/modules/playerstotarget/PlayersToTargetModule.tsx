import {useEffect, useRef, useState} from 'react';
import {usePlayerData, useTitle} from '../../../../../hooks/hooks';
import styles from './PlayersToTargetModule.module.css';
import ExportButton from '../../shared/ExportButton';
import {teamLogos} from '../../../../../consts/images';
import {Autocomplete, FormControl, TextField} from '@mui/material';
import {Player} from '../../../../../sleeper-api/sleeper-api';

enum NFLTeam {
    ARI = 'ARI',
    ATL = 'ATL',
    BAL = 'BAL',
    BUF = 'BUF',
    CAR = 'CAR',
    CHI = 'CHI',
    CIN = 'CIN',
    CLE = 'CLE',
    DAL = 'DAL',
    DEN = 'DEN',
    DET = 'DET',
    GB = 'GB',
    HOU = 'HOU',
    IND = 'IND',
    JAX = 'JAX',
    KC = 'KC',
    LAC = 'LAC',
    LAR = 'LAR',
    LV = 'LV',
    MIA = 'MIA',
    MIN = 'MIN',
    NE = 'NE',
    NO = 'NO',
    NYG = 'NYG',
    NYJ = 'NYJ',
    PHI = 'PHI',
    PIT = 'PIT',
    SF = 'SF',
    SEA = 'SEA',
    TB = 'TB',
    TEN = 'TEN',
    WAS = 'WAS',
}

export default function PlayersToTargetModule() {
    const playerData = usePlayerData();
    const componentRef = useRef(null);
    const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([
        'NONE_PLAYER_ID',
    ]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const players: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            players.push(player);
        }
        setAllPlayers(players);
    }, [playerData]);

    useEffect(() => {
        console.log(playerSuggestions);
    }, [playerSuggestions]);

    useTitle('Players to Target - Blueprint Generator');

    function logoImage(team: NFLTeam) {
        return <img src={teamLogos.get(team)} className={styles.teamLogo} />;
    }

    function playerTarget(pos: string, name: string, team: NFLTeam) {
        return (
            <div key={name}>
                <div className={styles.playerTargetBody}>
                    <div className={`${styles.positionChip} ${styles[pos]}`}>
                        {pos}
                    </div>
                    {logoImage(team)}
                    <div className={styles.targetName}>{name}</div>
                </div>
                <div className={styles.subtitle}>{`${pos} - ${team}`}</div>
            </div>
        );
    }

    function graphicComponent() {
        if (!playerData) return <></>;
        return (
            <div className={styles.graphicComponent} ref={componentRef}>
                {playerSuggestions.map(playerId => {
                    if (playerId === 'NONE_PLAYER_ID') {
                        return;
                    }
                    const player = playerData[playerId];

                    return playerTarget(
                        player.position,
                        `${player.first_name} ${player.last_name}`,
                        NFLTeam.GB
                    );
                })}
                {playerTarget('WR', 'Jayden Reed', NFLTeam.GB)}
                {playerTarget('WR', 'Rashee Rice', NFLTeam.KC)}
                {playerTarget('WR', 'Xavier Legette', NFLTeam.CAR)}
                {playerTarget('TE', 'Sam LaPorta', NFLTeam.DET)}
            </div>
        );
    }

    function huh(idx: number) {
        if (!playerData) return <></>;
        const opts = allPlayers.map(p => p.player_id);
        opts.push('NONE_PLAYER_ID');
        return (
            <FormControl
                style={{
                    margin: '4px',
                }}
            >
                <Autocomplete
                    options={opts}
                    getOptionLabel={option => {
                        if (option === 'NONE_PLAYER_ID') {
                            return 'Choose a player:';
                        }
                        const p = playerData[option];
                        return `${p.first_name} ${p.last_name}`;
                    }}
                    renderOption={(props, option) => {
                        const p = playerData[option];
                        return <div>{`${p?.first_name} ${p?.last_name}`}</div>;
                    }}
                    value={playerSuggestions[idx]}
                    onChange={(_event, newInputValue) => {
                        playerSuggestions[idx] =
                            newInputValue || 'NONE_PLAYER_ID';
                        setPlayerSuggestions(playerSuggestions);
                    }}
                    renderInput={params => (
                        <TextField {...params} label="Player" />
                    )}
                />
            </FormControl>
        );
    }

    return (
        <>
            {graphicComponent()}
            {huh(0)}
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={'looktotrade.png'}
                />
            }
        </>
    );
}
