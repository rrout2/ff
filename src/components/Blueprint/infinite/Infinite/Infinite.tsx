import styles from './Infinite.module.css';
import {blankInfinite} from '../../../../consts/images';
import {
    useFetchRosters,
    useLeague,
    useLeagueIdFromUrl,
    useProjectedLineup,
    useRoster,
    useRosterSettings,
    useTeamIdFromUrl,
} from '../../../../hooks/hooks';
import {StartersGraphic} from '../../v1/modules/Starters/Starters';
import {GraphicComponent as PositionalGradesGraphic} from '../../v1/modules/PositionalGrades/PositionalGrades';
import {
    useCornerstones,
    GraphicComponent as CornerstonesGraphic,
} from '../../v1/modules/cornerstone/CornerstoneModule';
import {getTeamName, Roster} from '../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import RosterTierComponent, {
    calculateRosterTier,
} from '../RosterTier/RosterTier';
import {BuySellTile, useBuySells} from '../BuySellHold/BuySellHold';
export default function Infinite() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId] = useTeamIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    const {data: rosters} = useFetchRosters(leagueId);
    const {roster, user} = useRoster(rosters, teamId, leagueId);
    const {startingLineup, benchString} = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    const {cornerstones} = useCornerstones(roster);
    const date = new Date();
    return (
        <>
            <ExportButton
                className={styles.fullBlueprint}
                pngName={`${getTeamName(user)}_infinite.png`}
            />
            <div className={styles.fullBlueprint}>
                <div className={styles.startersGraphic}>
                    <StartersGraphic
                        startingLineup={startingLineup}
                        transparent={true}
                    />
                </div>
                <div className={styles.cornerstoneGraphic}>
                    <CornerstonesGraphic
                        cornerstones={cornerstones}
                        transparent={true}
                    />
                </div>
                <div className={styles.benchStringGraphic}>{benchString}</div>
                <TeamNameComponent teamName={getTeamName(user)} />
                <div className={styles.positionalGradesGraphic}>
                    <PositionalGradesGraphic
                        transparent={true}
                        roster={roster}
                    />
                </div>
                <div className={styles.rosterTierGraphic}>
                    <RosterTierComponent tier={calculateRosterTier(roster)} />
                </div>
                <BuySellHoldComponent roster={roster} />
                <div className={styles.monthYear}>
                    {date.toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
                <img src={blankInfinite} className={styles.blankBp} />
            </div>
        </>
    );
}

const TeamNameComponent = ({teamName}: {teamName?: string}) => {
    if (!teamName) return <></>;
    const longName = teamName.length >= 16 && teamName.length < 24;
    const veryLongName = teamName.length >= 24;
    return (
        <div
            className={`${styles.teamNameGraphic} ${
                longName ? styles.smallerTeamName : ''
            } ${veryLongName ? styles.smallestTeamName : ''}`}
        >
            {teamName}
        </div>
    );
};

const BuySellHoldComponent = ({roster}: {roster?: Roster}) => {
    const {buys, sells, holds} = useBuySells(roster);

    const column1 = '640px';
    const column2 = '1002px';

    const row1 = '1102px';
    const row2 = '1246px';
    const row3 = '1478px';
    const row4 = '1715px';
    return (
        <>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column1, top: row1}}
            >
                <BuySellTile {...buys[0]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column1, top: row2}}
            >
                <BuySellTile {...buys[1]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column2, top: row1}}
            >
                <BuySellTile {...buys[2]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column2, top: row2}}
            >
                <BuySellTile {...buys[3]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column1, top: row3}}
            >
                <BuySellTile {...sells[0]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column2, top: row3}}
            >
                <BuySellTile {...sells[1]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column1, top: row4}}
            >
                <BuySellTile {...holds[0]} />
            </div>
            <div
                className={styles.buySellHoldGraphic}
                style={{left: column2, top: row4}}
            >
                <BuySellTile {...holds[1]} />
            </div>
        </>
    );
};
