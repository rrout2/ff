import {useEffect, useState} from 'react';
import styles from './Rankings.module.css';
import {Button, IconButton} from '@mui/material';
import {InputComponent as SearchablePlayerInput} from '../Blueprint/BlueprintGenerator/modules/playerstotarget/PlayersToTargetModule';
import {usePlayerData} from '../../hooks/hooks';
import {Delete} from '@mui/icons-material';

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
    const playerData = usePlayerData();
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
            </div>
            <div className={styles.playerInputRow}>
                <SearchablePlayerInput
                    playerSuggestions={playersToAdd}
                    setPlayerSuggestions={setPlayersToAdd}
                    label="Player to Add"
                    styles={{width: '300px'}}
                />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <IconButton
                        onClick={() => {
                            setTiers((tiers: Map<Tier, string[]>) => {
                                const newTiers = new Map(tiers);
                                newTiers.forEach((players, currentTier) => {
                                    newTiers.set(
                                        currentTier,
                                        players.filter(
                                            p => p !== playersToAdd[0]
                                        )
                                    );
                                });
                                return newTiers;
                            });
                        }}
                        style={{aspectRatio: '1/1'}}
                        disabled={!allTieredPlayers.has(playersToAdd[0])}
                    >
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <div className={styles.addToTierButtons}>
                {ALL_TIERS.filter(tier => tiers.has(tier)).map(tier => (
                    <div className={styles.addToTierRow}>
                        <Button
                            variant={'outlined'}
                            key={tier}
                            onClick={() => addToTier(tier, playersToAdd[0])}
                            disabled={tiers
                                .get(tier)!
                                .includes(playersToAdd[0])}
                        >
                            Add to {tier} Tier
                        </Button>
                        {tiers
                            .get(tier)
                            ?.map(playerId => playerData[playerId])
                            .filter(player => !!player)
                            .map(player => (
                                <span>
                                    {player.first_name + ' ' + player.last_name}
                                </span>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
