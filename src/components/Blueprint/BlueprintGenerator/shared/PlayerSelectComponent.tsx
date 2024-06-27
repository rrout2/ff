import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {useAdpData, usePlayerData} from '../../../../hooks/hooks';

export default function PlayerSelectComponent(props: {
    playerIds: string[];
    selectedPlayerIds: string[];
    onChange: (newPlayerIds: string[]) => void;
    position?: string;
}) {
    const {playerIds, selectedPlayerIds, onChange, position} = props;
    const {sortByAdp} = useAdpData();
    const playerData = usePlayerData();
    if (!playerData) return <></>;
    return (
        <FormControl
            style={{
                margin: '4px',
            }}
        >
            <InputLabel>{position ?? 'Player'}</InputLabel>
            <Select
                value={selectedPlayerIds}
                label={position ?? 'Player'}
                onChange={(e: SelectChangeEvent<string[]>) => {
                    const {
                        target: {value},
                    } = e;
                    onChange(
                        typeof value === 'string' ? value.split(',') : value
                    );
                }}
                multiple={true}
            >
                {playerIds
                    .map(playerId => playerData[playerId])
                    .filter(player => {
                        if (!player) return false;
                        return (
                            !position ||
                            player.fantasy_positions.includes(position)
                        );
                    })
                    .sort(sortByAdp)
                    .map((player, idx) => (
                        <MenuItem value={player.player_id} key={idx}>
                            {player.first_name} {player.last_name}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}
