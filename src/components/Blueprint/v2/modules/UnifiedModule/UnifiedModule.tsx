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
import {
    GraphicComponent as HoldsGraphic,
    InputComponent as HoldsInput,
    useHolds,
} from '../HoldsModule/HoldsModule';
import {
    GraphicComponent as RisersFallersGraphic,
    InputComponent as RisersFallersInput,
    useRisersFallers,
} from '../RisersFallersModule/RisersFallersModule';
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
    const {sells, setSells, buys, setBuys, plusMap, setPlusMap} =
        useBuySells(roster);
    const {holds, setHolds, comments, setComments} = useHolds(roster);
    const {
        risers,
        setRisers,
        riserValues,
        setRiserValues,
        fallers,
        setFallers,
        fallerValues,
        setFallerValues,
    } = useRisersFallers(roster);
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
                plusMap={plusMap}
                setPlusMap={setPlusMap}
            />
            <HoldsInput
                playerIds={roster?.players ?? []}
                holds={holds}
                setHolds={setHolds}
                comments={comments}
                setComments={setComments}
            />
            <RisersFallersInput
                playerIds={roster?.players ?? []}
                risers={risers}
                setRisers={setRisers}
                riserValues={riserValues}
                setRiserValues={setRiserValues}
                fallers={fallers}
                setFallers={setFallers}
                fallerValues={fallerValues}
                setFallerValues={setFallerValues}
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
                    'suggestedMovesGraphic',
                    'holdsGraphic',
                    'risersFallersGraphic',
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
                plusMap={plusMap}
            />
            <HoldsGraphic
                holds={holds}
                comments={comments}
                graphicClassName="holdsGraphic"
            />
            <RisersFallersGraphic
                risers={risers}
                fallers={fallers}
                riserValues={riserValues}
                fallerValues={fallerValues}
                graphicClassName="risersFallersGraphic"
            />
        </div>
    );
}
