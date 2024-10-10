import {TextField} from '@mui/material';
import {QB, RB, WR, TE, FLEX, SUPER_FLEX, BENCH} from '../../../consts/fantasy';
import {useAllPlayers} from '../../../hooks/hooks';
import PlayerSelectComponent from './PlayerSelectComponent';
import StyledNumberInput from './StyledNumberInput';

interface NonSleeperInputProps {
    nonSleeperIds: string[];
    setNonSleeperIds: (ids: string[]) => void;
    teamName: string;
    setTeamName: (name: string) => void;
    nonSleeperRosterSettings: Map<string, number>;
    setNonSleeperRosterSettings: (settings: Map<string, number>) => void;
    ppr: number;
    setPpr: (ppr: number) => void;
    teBonus: number;
    setTeBonus: (teBonus: number) => void;
    numRosters: number;
    setNumRosters: (numRosters: number) => void;
    taxiSlots: number;
    setTaxiSlots: (taxiSlots: number) => void;
}

export function NonSleeperInput({
    nonSleeperIds,
    setNonSleeperIds,
    teamName,
    setTeamName,
    nonSleeperRosterSettings,
    setNonSleeperRosterSettings,
    ppr,
    setPpr,
    teBonus,
    setTeBonus,
    numRosters,
    setNumRosters,
    taxiSlots,
    setTaxiSlots,
}: NonSleeperInputProps) {
    const allPlayers = useAllPlayers();
    return (
        <>
            <div>
                <PlayerSelectComponent
                    playerIds={allPlayers}
                    selectedPlayerIds={nonSleeperIds}
                    onChange={setNonSleeperIds}
                    multiple={true}
                    label="Non-Sleeper Roster"
                    styles={{minWidth: '200px'}}
                />
                <TextField
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    label="Team Name"
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    {[QB, RB, WR, TE, FLEX, SUPER_FLEX, BENCH].map(position => (
                        <StyledNumberInput
                            key={position}
                            value={nonSleeperRosterSettings.get(position)}
                            onChange={(_, value) => {
                                const newMap = new Map(
                                    nonSleeperRosterSettings
                                );
                                newMap.set(position, value || 0);
                                setNonSleeperRosterSettings(newMap);
                            }}
                            label={position}
                            min={0}
                            max={100}
                        />
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <StyledNumberInput
                        value={ppr}
                        onChange={(_, value) => {
                            setPpr(value || 0);
                        }}
                        label="PPR"
                        step={0.5}
                        min={0}
                        max={10}
                    />
                    <StyledNumberInput
                        value={teBonus}
                        onChange={(_, value) => {
                            setTeBonus(value || 0);
                        }}
                        label="TE Bonus"
                        step={0.5}
                        min={0}
                        max={10}
                    />
                    <StyledNumberInput
                        value={numRosters}
                        onChange={(_, value) => {
                            setNumRosters(value || 0);
                        }}
                        label="League Size"
                        step={1}
                        min={2}
                        max={100}
                    />
                    <StyledNumberInput
                        value={taxiSlots}
                        onChange={(_, value) => {
                            setTaxiSlots(value || 0);
                        }}
                        label="Taxi Slots"
                        step={1}
                        min={0}
                        max={10}
                    />
                </div>
            </div>
        </>
    );
}
