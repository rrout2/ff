import styles from './Infinite.module.css';
import {blankInfiniteV2} from '../../../../consts/images';
import {
    useFetchRosters,
    useLeague,
    useLeagueIdFromUrl,
    useNonSleeper,
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
import {
    getAllUsers,
    getTeamName,
    Roster,
    User,
} from '../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import RosterTierComponent from '../RosterTier/RosterTier';
import {BuySellTile, useBuySells} from '../BuySellHold/BuySellHold';
import {SUPER_FLEX} from '../../../../consts/fantasy';
import {teamSelectComponent} from '../../../Team/TeamPage/TeamPage';
import {useEffect, useState} from 'react';
import {NONE_TEAM_ID} from '../../../../consts/urlParams';
export default function Infinite() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useTeamIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    const {data: rosters} = useFetchRosters(leagueId);
    const {roster, user, setRoster} = useRoster(rosters, teamId, leagueId);
    const {cornerstones} = useCornerstones(roster);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [isNonSleeper, setIsNonSleeper] = useState(false);
    useEffect(() => {
        if (!allUsers.length || !hasTeamId() || +teamId >= allUsers.length) {
            return;
        }
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) {
            return;
        }
        if (+teamId >= allUsers.length) {
            // if the teamId is out of bounds, reset it
            setTeamId('0');
        }
    }, [allUsers, teamId]);

    useEffect(() => {
        if (!leagueId || !rosters) return;
        const ownerIds = new Set(rosters.map(r => r.owner_id));
        getAllUsers(leagueId).then(users =>
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            setAllUsers(users.filter(u => ownerIds.has(u.user_id)))
        );
    }, [leagueId, rosters]);

    const {
        nonSleeperRosterSettings,
        numRosters,
        teamName: nonSleeperTeamName,
    } = useNonSleeper(rosters, specifiedUser, setRoster);

    const {startingLineup, benchString, setStartingLineup} = useProjectedLineup(
        isNonSleeper ? nonSleeperRosterSettings : rosterSettings,
        roster?.players
    );
    useEffect(() => {
        setStartingLineup(startingLineup.slice(0, 14));
    }, [startingLineup.length]);

    useEffect(() => {
        setIsNonSleeper(!leagueId);
    }, [leagueId]);

    const currentDate = new Date();
    const isSuperFlex = !isNonSleeper
        ? rosterSettings.has(SUPER_FLEX)
        : nonSleeperRosterSettings.has(SUPER_FLEX);
    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function getBenchStringClass() {
        const longBenchString = benchString.length >= 440;
        const mediumBenchString = benchString.length >= 321;
        return `${styles.benchStringGraphic} ${
            longBenchString
                ? styles.benchStringGraphicSmallest
                : mediumBenchString
                ? styles.benchStringGraphicSmaller
                : ''
        }`;
    }

    return (
        <>
            <ExportButton
                className={styles.fullBlueprint}
                pngName={`${getTeamName(user)}_infinite.png`}
            />
            {leagueId &&
                teamSelectComponent(
                    teamId,
                    setTeamId,
                    allUsers,
                    specifiedUser,
                    {
                        margin: '4px',
                        maxWidth: '800px',
                    }
                )}
            <div className={styles.fullBlueprint}>
                <div className={styles.startersGraphic}>
                    <StartersGraphic
                        startingLineup={startingLineup}
                        transparent={true}
                        infinite
                    />
                </div>
                <div className={styles.cornerstoneGraphic}>
                    <CornerstonesGraphic
                        cornerstones={cornerstones}
                        transparent={true}
                    />
                </div>
                <div className={getBenchStringClass()}>{benchString}</div>
                <TeamNameComponent
                    teamName={
                        isNonSleeper ? nonSleeperTeamName : getTeamName(user)
                    }
                />
                <div className={styles.positionalGradesGraphic}>
                    <PositionalGradesGraphic
                        transparent={true}
                        roster={roster}
                        isSuperFlex={isSuperFlex}
                        leagueSize={numRosters}
                        numStarters={startingLineup.length}
                    />
                </div>
                <div className={styles.rosterTierGraphic}>
                    <RosterTierComponent
                        isSuperFlex={isSuperFlex}
                        leagueSize={numRosters}
                        roster={roster}
                    />
                </div>
                <BuySellHoldComponent
                    isSuperFlex={isSuperFlex}
                    leagueSize={numRosters}
                    roster={roster}
                />
                <div className={styles.monthYear}>
                    {currentDate.toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
                <img src={blankInfiniteV2} className={styles.blankBp} />
            </div>
        </>
    );
}

const countEmojis = (str: string): number => {
    // This regex matches most emoji patterns including:
    // - Single unicode emojis
    // - Compound emojis (e.g. family combinations)
    // - Emojis with skin tone modifiers
    const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

    return (str.match(emojiRegex) || []).length;
};

const TeamNameComponent = ({teamName}: {teamName?: string}) => {
    if (!teamName) return <></>;
    // Emojis count as 2 characters since they are wider.
    const teamNameSize = teamName.length + countEmojis(teamName);
    const longName = teamNameSize >= 14 && teamNameSize < 24;
    const veryLongName = teamNameSize >= 24;
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

const BuySellHoldComponent = ({
    isSuperFlex,
    leagueSize,
    roster,
}: {
    isSuperFlex: boolean;
    leagueSize: number;
    roster?: Roster;
}) => {
    const {buys, sells} = useBuySells(isSuperFlex, leagueSize, roster);

    const column1 = '640px';
    const column2 = '1002px';

    const row1 = '1102px';
    const row2 = '1246px';
    const row3 = '1478px';
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
        </>
    );
};
