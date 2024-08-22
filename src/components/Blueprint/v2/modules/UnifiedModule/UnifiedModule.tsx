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
} from '../CornerstonesModule/CornerstonesModule';
import {
    GraphicComponent as RosterGraphic,
    InputComponent as RosterInput,
} from '../RosterModule/RosterModule';
import {GraphicComponent as SettingsGraphic} from '../SettingsModule/SettingsModule';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import ExportButton from '../../../shared/ExportButton';
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
    const [cornerstones, setCornerstones] = useState<string[]>([]);
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [leagueId] = useLeagueIdFromUrl();
    useEffect(() => {
        if (!roster || !playerData) return;
        const allPlayers = roster.players
            .map(playerId => playerData[playerId])
            .filter(p => !!p)
            .sort(sortByAdp);
        setAllPlayers(allPlayers);
        setCornerstones(allPlayers.map(p => p.player_id).slice(0, 4));
    }, [roster, playerData]);

    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    function inputs() {
        return (
            <>
                <CornerstonesInput
                    playerIds={roster?.players ?? []}
                    setCornerstones={setCornerstones}
                    cornerstones={cornerstones}
                />
                <RosterInput rankStateMap={rankStateMap} />
            </>
        );
    }

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
            {inputs()}
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
        </div>
    );
}
