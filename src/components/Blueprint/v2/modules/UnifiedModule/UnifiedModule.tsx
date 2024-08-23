import {useEffect, useState} from 'react';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './UnifiedModule.module.css';
import {
    useAdpData,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../../../../hooks/hooks';
import {
    GraphicComponent as CornerstonesGraphic,
    InputComponent as CornerstonesInput,
    useCornerstones,
} from '../CornerstonesModule/CornerstonesModule';
import {
    GraphicComponent as RosterGraphic,
    InputComponent as RosterInput,
} from '../RosterModule/RosterModule';
import {GraphicComponent as SettingsGraphic} from '../SettingsModule/SettingsModule';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import ExportButton from '../../../shared/ExportButton';
import {
    GraphicComponent as SuggestedMovesGraphic,
    InputComponent as SuggestedMovesInput,
    useBuySells,
} from '../SuggestedMovesModule/SuggestedMovesModule';
export type UnifiedModuleProps = {
    roster?: Roster;
    numRosters?: number;
    teamName?: string;
};

export default function UnifiedModule({
    roster,
    numRosters,
    teamName,
}: UnifiedModuleProps): JSX.Element {
    const {cornerstones, setCornerstones} = useCornerstones(roster);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [leagueId] = useLeagueIdFromUrl();
    const {sells, setSells, buys, setBuys} = useBuySells(roster);
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    useEffect(() => {
        if (!roster || !playerData) return;
        setAllPlayers(
            roster.players
                .map(playerId => playerData[playerId])
                .filter(p => !!p)
                .sort(sortByAdp)
        );
    }, [roster, playerData]);

    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    const UnifiedInputs = () => (
        <>
            <CornerstonesInput
                playerIds={roster?.players ?? []}
                setCornerstones={setCornerstones}
                cornerstones={cornerstones}
            />
            <RosterInput rankStateMap={rankStateMap} />
            <SuggestedMovesInput
                playerIds={roster?.players ?? []}
                sells={sells}
                setSells={setSells}
                buys={buys}
                setBuys={setBuys}
            />
        </>
    );

    return (
        <div className={styles.UnifiedModule}>
            <ExportButton
                className={[
                    'rosterGraphic',
                    'settingsGraphic',
                    'cornerstonesGraphic',
                ]}
                zipName={`${teamName}_unified.zip`}
            />
            <UnifiedInputs />
            <CornerstonesGraphic
                cornerstones={cornerstones}
                graphicClassName="cornerstonesGraphic"
            />
            <RosterGraphic
                allPlayers={allPlayers}
                rankStateMap={rankStateMap}
                numRosters={numRosters ?? 0}
                graphicClassName="rosterGraphic"
            />
            <SettingsGraphic
                leagueId={leagueId}
                numRosters={numRosters ?? 0}
                graphicClassName="settingsGraphic"
            />
            <SuggestedMovesGraphic
                sells={sells}
                buys={buys}
                graphicClassName="suggestedMovesGraphic"
            />
        </div>
    );
}
