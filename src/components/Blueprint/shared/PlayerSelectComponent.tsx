import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {useAdpData, usePlayerData} from '../../../hooks/hooks';
import {useEffect, useState} from 'react';

export default function PlayerSelectComponent(props: {
    playerIds: string[];
    selectedPlayerIds: string[];
    onChange: (newPlayerIds: string[]) => void;
    nonIdPlayerOptions?: string[];
    position?: string;
    label?: string;
    multiple?: boolean;
    maxSelections?: number;
    styles?: React.CSSProperties;
}) {
    const {
        playerIds,
        selectedPlayerIds,
        onChange,
        position,
        nonIdPlayerOptions,
        label,
        multiple,
        maxSelections,
        styles,
    } = props;
    const {sortByAdp} = useAdpData();
    const playerData = usePlayerData();
    const [allPlayerOptions, setAllPlayerOptions] = useState<string[]>([]);

    useEffect(() => {
        if (!playerData) return;
        const playerOpts = playerIds
            .map(playerId => playerData[playerId])
            .filter(player => !!player)
            .sort(sortByAdp)
            .map(p => p.player_id);
        if (nonIdPlayerOptions) {
            playerOpts.push(...nonIdPlayerOptions);
        }
        setAllPlayerOptions(playerOpts);
    }, [playerIds, playerData, nonIdPlayerOptions]);
    if (!playerData) return <></>;

    return (
        <FormControl style={{margin: '4px', minWidth: '100px', ...styles}}>
            <InputLabel>{label ?? position ?? 'Player'}</InputLabel>
            <Select
                value={selectedPlayerIds}
                label={label ?? position ?? 'Player'}
                onChange={(e: SelectChangeEvent<string[]>) => {
                    const {
                        target: {value},
                    } = e;
                    const newPlayerIds =
                        typeof value === 'string' ? value.split(',') : value;
                    if (
                        multiple &&
                        maxSelections &&
                        newPlayerIds.length > maxSelections
                    ) {
                        return;
                    }
                    onChange(newPlayerIds);
                }}
                multiple={multiple ?? true}
            >
                {allPlayerOptions.map((option, idx) => {
                    const player = playerData[option];
                    const value = !player ? option : player.player_id;
                    const display = !player
                        ? option
                        : `${player.first_name} ${player.last_name}`;
                    return (
                        <MenuItem value={value} key={idx}>
                            {display}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
