import {useState} from 'react';
import styles from './Rankings.module.css';
import {Button} from '@mui/material';
import {InputComponent as SearchablePlayerInput} from '../Blueprint/BlueprintGenerator/modules/playerstotarget/PlayersToTargetModule';

const TIERS = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function Rankings() {
    const [tiers, setTiers] = useState<Map<string, string[]>>(new Map());
    const [playersToAdd, setPlayersToAdd] = useState<string[]>(['10229']);
    return (
        <div>
            <Button
                variant={'outlined'}
                onClick={() => {
                    if (tiers.size >= TIERS.length) return;
                    setTiers((tiers: Map<string, string[]>) => {
                        const newTiers = new Map(tiers);
                        newTiers.set(TIERS[tiers.size], []);
                        return newTiers;
                    });
                }}
            >
                Add Tier
            </Button>
            <Button
                variant={'outlined'}
                onClick={() => {
                    if (tiers.size === 0) return;
                    setTiers((tiers: Map<string, string[]>) => {
                        const newTiers = new Map(tiers);
                        newTiers.delete(TIERS[tiers.size - 1]);
                        return newTiers;
                    });
                }}
            >
                Remove Tier
            </Button>
            <SearchablePlayerInput
                playerSuggestions={playersToAdd}
                setPlayerSuggestions={setPlayersToAdd}
                label="Player to Add"
                styles={{width: '300px'}}
            />
            <>
                {TIERS.filter(tier => tiers.has(tier)).map(tier => (
                    <div>
                        <Button
                            variant={'outlined'}
                            key={tier}
                            onClick={() => {
                                setTiers((tiers: Map<string, string[]>) => {
                                    const newTiers = new Map(tiers);
                                    newTiers.set(tier, [
                                        ...tiers.get(tier)!,
                                        ...playersToAdd,
                                    ]);
                                    return newTiers;
                                });
                            }}
                        >
                            Add to {tier} Tier
                        </Button>
                    </div>
                ))}
            </>
        </div>
    );
}
