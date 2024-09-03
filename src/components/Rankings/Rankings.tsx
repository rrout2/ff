import {useEffect, useState} from 'react';
import styles from './Rankings.module.css';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tooltip,
} from '@mui/material';
import {InputComponent as SearchablePlayerInput} from '../Blueprint/BlueprintGenerator/modules/playerstotarget/PlayersToTargetModule';
import {useAdpData, useNflSchedule, usePlayerData} from '../../hooks/hooks';
import {ArrowDropDown, ArrowDropUp, Delete} from '@mui/icons-material';
import {Player} from '../../sleeper-api/sleeper-api';
import {teamBackgrounds, teamLogos, tierLogos} from '../../consts/images';
import ExportButton from '../Blueprint/shared/ExportButton';

enum Tier {
    S = 'S',
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
}
const ALL_TIERS = Object.values(Tier);

export default function Rankings() {
    const [tiers, setTiers] = useState<Map<Tier, string[]>>(
        new Map(ALL_TIERS.map(tier => [tier, []]))
    );
    const [allTieredPlayers, setAllTieredPlayers] = useState<Set<string>>(
        new Set()
    );
    const [playersToAdd, setPlayersToAdd] = useState<string[]>(['10229']);
    const {sortByAdp} = useAdpData();
    const playerData = usePlayerData();
    const [week, setWeek] = useState(1);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [displayRanks, setDisplayRanks] = useState(true);

    useEffect(() => {
        const players: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (!player || !player.player_id || !player.team) continue;
            players.push(player);
        }
        setAllPlayers(players.sort(sortByAdp));
    }, [playerData]);

    useEffect(() => {
        const newAllTieredPlayers = new Set<string>();
        tiers.forEach((players, _) => {
            players.forEach(player => {
                newAllTieredPlayers.add(player);
            });
        });
        setAllTieredPlayers(newAllTieredPlayers);
    }, [tiers]);

    if (!playerData) return <></>;

    function addToTier(tier: Tier, player: string) {
        if (tiers.get(tier)!.includes(player)) {
            return;
        }
        setTiers((tiers: Map<Tier, string[]>) => {
            const newTiers = new Map(tiers);
            newTiers.set(tier, [...tiers.get(tier)!, player]);
            newTiers.forEach((players, currentTier) => {
                if (currentTier === tier) return;
                if (players.includes(player)) {
                    newTiers.set(
                        currentTier,
                        players.filter(p => p !== player)
                    );
                }
            });
            return newTiers;
        });
    }

    function removePlayer(playerId: string) {
        setTiers((tiers: Map<Tier, string[]>) => {
            const newTiers = new Map(tiers);
            newTiers.forEach((players, currentTier) => {
                newTiers.set(
                    currentTier,
                    players.filter(p => p !== playerId)
                );
            });
            return newTiers;
        });
    }

    function autoPopulateTiers() {
        const newTiers = new Map<Tier, string[]>();
        ALL_TIERS.forEach((tier, idx) => {
            newTiers.set(tier, [
                ...allPlayers.slice(idx * 8, idx * 8 + 8).map(p => p.player_id),
            ]);
        });
        setTiers(newTiers);
    }

    function getWhichTier(playerId: string) {
        const tier = ALL_TIERS.filter(tier => tiers.has(tier)).find(tier =>
            tiers.get(tier)!.includes(playerId)
        );
        if (!tier) return {tier: tier, idx: -1};
        return {tier, idx: tiers.get(tier)!.indexOf(playerId)};
    }

    function getRank(playerId: string) {
        const {tier, idx} = getWhichTier(playerId);
        let numBefore = 0;
        for (const t in ALL_TIERS) {
            if (ALL_TIERS[t] === tier) break;
            numBefore += tiers.get(ALL_TIERS[t])!.length;
        }
        return numBefore + idx + 1;
    }

    return (
        <div>
            <div className={styles.addRemoveButtons}>
                <Button
                    variant={'outlined'}
                    onClick={() => {
                        if (tiers.size >= ALL_TIERS.length) return;
                        setTiers((tiers: Map<Tier, string[]>) => {
                            const newTiers = new Map(tiers);
                            newTiers.set(ALL_TIERS[tiers.size], []);
                            return newTiers;
                        });
                    }}
                    disabled={tiers.size >= ALL_TIERS.length}
                >
                    Add Tier
                </Button>
                <Button
                    variant={'outlined'}
                    onClick={() => {
                        if (tiers.size === 0) return;
                        setTiers((tiers: Map<Tier, string[]>) => {
                            const newTiers = new Map(tiers);
                            newTiers.delete(ALL_TIERS[tiers.size - 1]);
                            return newTiers;
                        });
                    }}
                    disabled={tiers.size === 0}
                >
                    Remove Tier
                </Button>
                <FormControl>
                    <InputLabel>Week</InputLabel>
                    <Select
                        value={week}
                        label="Week"
                        onChange={e => {
                            setWeek(e.target.value as number);
                        }}
                    >
                        <MenuItem key={-1} value={-1}>
                            None
                        </MenuItem>
                        {Array.from({length: 18}, (_, i) => i + 1).map(i => (
                            <MenuItem key={i} value={i}>
                                Week {i}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className={styles.playerInputRow}>
                <SearchablePlayerInput
                    playerSuggestions={playersToAdd}
                    setPlayerSuggestions={setPlayersToAdd}
                    label="Player to Add"
                    styles={{width: '300px'}}
                />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Tooltip title="Remove from rankings">
                        <IconButton
                            onClick={() => removePlayer(playersToAdd[0])}
                            disabled={!allTieredPlayers.has(playersToAdd[0])}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Move up within tier">
                        <IconButton
                            onClick={() => {
                                const {tier, idx} = getWhichTier(
                                    playersToAdd[0]
                                );
                                if (!tier || idx <= 0) return;
                                const newPlayers = [...tiers.get(tier)!];
                                newPlayers.splice(idx, 1);
                                newPlayers.splice(idx - 1, 0, playersToAdd[0]);
                                setTiers((tiers: Map<Tier, string[]>) => {
                                    const newTiers = new Map(tiers);
                                    newTiers.set(tier, newPlayers);
                                    return newTiers;
                                });
                            }}
                            disabled={
                                !allTieredPlayers.has(playersToAdd[0]) ||
                                getWhichTier(playersToAdd[0]).idx <= 0
                            }
                        >
                            <ArrowDropUp />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Move down within tier">
                        <IconButton
                            onClick={() => {
                                const {tier, idx} = getWhichTier(
                                    playersToAdd[0]
                                );
                                if (
                                    !tier ||
                                    idx < 0 ||
                                    idx >= tiers.get(tier)!.length - 1
                                ) {
                                    return;
                                }
                                const newPlayers = [...tiers.get(tier)!];
                                newPlayers.splice(idx, 1);
                                newPlayers.splice(idx + 1, 0, playersToAdd[0]);
                                setTiers((tiers: Map<Tier, string[]>) => {
                                    const newTiers = new Map(tiers);
                                    newTiers.set(tier, newPlayers);
                                    return newTiers;
                                });
                            }}
                            disabled={(() => {
                                const {tier, idx} = getWhichTier(
                                    playersToAdd[0]
                                );
                                return (
                                    !tier ||
                                    idx < 0 ||
                                    idx >= tiers.get(tier)!.length - 1
                                );
                            })()}
                        >
                            <ArrowDropDown />
                        </IconButton>
                    </Tooltip>
                    <ExportButton
                        className={`player-${playersToAdd[0]}`}
                        pngName={`player-${playersToAdd[0]}.png`}
                        downloadIcon={true}
                        disabled={!allTieredPlayers.has(playersToAdd[0])}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={displayRanks}
                                    onChange={e =>
                                        setDisplayRanks(e.target.checked)
                                    }
                                />
                            }
                            label="Show Ranks"
                        />
                    </FormGroup>
                </div>
            </div>
            <div>
                <ExportButton
                    className={ALL_TIERS.filter(tier => tiers.has(tier)).map(
                        tier => `${tier}-tier`
                    )}
                    zipName={`all_tiers${week > 0 ? `_week${week}` : ''}.zip`}
                    label="Download as Zip"
                />
                <ExportButton
                    className="tierGraphics"
                    pngName={`tier_list${week > 0 ? `_week${week}` : ''}.png`}
                    label="Download as Single PNG"
                />
                <Button variant="outlined" onClick={autoPopulateTiers}>
                    Autopopulate Tiers by ADP
                </Button>
            </div>
            <div className={styles.addToTierButtons}>
                {ALL_TIERS.filter(tier => tiers.has(tier)).map(tier => (
                    <div className={styles.addToTierRow}>
                        <ExportButton
                            className={`${tier}-tier`}
                            pngName={`${tier}-tier.png`}
                            downloadIcon={true}
                        />
                        <Button
                            variant={'outlined'}
                            key={tier}
                            onClick={() => addToTier(tier, playersToAdd[0])}
                            disabled={tiers
                                .get(tier)!
                                .includes(playersToAdd[0])}
                        >
                            {tier} Tier
                        </Button>
                        {tiers
                            .get(tier)!
                            .map(playerId => playerData[playerId])
                            .filter(player => !!player)
                            .map(player => (
                                <span
                                    onClick={() => {
                                        setPlayersToAdd([player.player_id]);
                                    }}
                                    className={styles.playerName}
                                >
                                    {player.first_name + ' ' + player.last_name}
                                </span>
                            ))}
                    </div>
                ))}
            </div>
            <div className={'tierGraphics'}>
                {ALL_TIERS.filter(tier => tiers.has(tier)).map(tier => (
                    <TierGraphic
                        key={tier}
                        tier={tier}
                        players={tiers.get(tier)!}
                        week={week}
                        handlePlayerClicked={(playerId: string) => {
                            setPlayersToAdd([playerId]);
                        }}
                        getRank={displayRanks ? getRank : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

interface PlayerCardProps {
    playerId: string;
    opponent?: string;
    getRank?: (playerId: string) => number;
    onClick: () => void;
}

export function PlayerCard({
    playerId,
    opponent,
    onClick,
    getRank,
}: PlayerCardProps) {
    const playerData = usePlayerData();
    const [player, setPlayer] = useState<Player>();
    useEffect(() => {
        if (!playerData) return;
        setPlayer(playerData[playerId]);
    }, [playerId, playerData]);

    if (!player) return <></>;

    return (
        <div
            className={`${styles.playerCard} player-${playerId}`}
            onClick={onClick}
        >
            <img
                src={teamBackgrounds.get(player.team)}
                className={styles.background}
            />
            <img
                src={`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`}
                className={styles.headshot}
            />
            {!!opponent && (
                <div className={styles.opponent}>
                    <div>VS</div>
                    <img
                        src={teamLogos.get(opponent)}
                        className={styles.opponentLogo}
                    />
                </div>
            )}
            {!!getRank && (
                <div className={styles.playerRankWrapper}>
                    <div className={styles.playerRank}>{getRank(playerId)}</div>
                </div>
            )}
            <div className={styles.playerCardNameWrapper}>
                <div className={styles.playerCardName}>
                    {`${player.first_name[0]}. ${player.last_name}`}
                </div>
            </div>
        </div>
    );
}

interface TierGraphicProps {
    tier: Tier;
    players: string[];
    week: number;
    handlePlayerClicked: (playerId: string) => void;
    getRank?: (playerId: string) => number;
}

export function TierGraphic({
    tier,
    players,
    week,
    handlePlayerClicked,
    getRank,
}: TierGraphicProps) {
    const nflSchedule = useNflSchedule();
    const playerData = usePlayerData();
    if (!nflSchedule || !playerData) return <></>;

    function getOpponent(playerId: string) {
        if (!playerData) return;

        const player = playerData[playerId];
        if (!player) return;

        // No week specicifed. Skip.
        const teamSchedule = nflSchedule[player.team];
        if (week < 1) return;

        if (!teamSchedule) {
            console.warn(
                `No team schedule for ${player.first_name} ${player.last_name} team ${player.team}`
            );
            return;
        }

        let opp = teamSchedule[`Week ${week}`];

        // Bye week. Skip.
        if (!opp) return;

        if (opp[0] === '@') {
            opp = opp.slice(1);
        }
        return opp;
    }

    return (
        <div className={`${styles.tierGraphic} ${tier}-tier`}>
            <img src={tierLogos.get(tier)} style={{height: '300px'}} />
            {players.map(playerId => {
                return (
                    <PlayerCard
                        key={playerId}
                        playerId={playerId}
                        opponent={getOpponent(playerId)}
                        onClick={() => handlePlayerClicked(playerId)}
                        getRank={getRank}
                    />
                );
            })}
        </div>
    );
}
