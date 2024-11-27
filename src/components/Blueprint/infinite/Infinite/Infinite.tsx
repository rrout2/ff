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
import {getTeamName} from '../../../../sleeper-api/sleeper-api';
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

    return (
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
                <PositionalGradesGraphic transparent={true} roster={roster} />
            </div>
            <img src={blankInfinite} className={styles.blankBp} />
        </div>
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
