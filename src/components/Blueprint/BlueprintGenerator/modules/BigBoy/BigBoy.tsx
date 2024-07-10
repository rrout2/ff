import {useEffect, useState} from 'react';
import {blankblueprint} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    useFetchRosters,
    usePlayerData,
    useTeamIdFromUrl,
} from '../../../../../hooks/hooks';
import {
    Roster,
    User,
    getAllUsers,
} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {useStarters} from '../Starters/useStarters';
import {useSettings} from '../settings/useSettings';
import styles from './BigBoy.module.css';
import {NONE_TEAM_ID} from '../../../../../consts/urlParams';
import {useCornerstone} from '../cornerstone/useCornerstone';
import {useDepthScore} from '../DepthScore/useDepthScore';
import {usePlayersToTarget} from '../playerstotarget/usePlayersToTarget';
import {usePositionalGrades} from '../PositionalGrades/usePositionalGrades';
import {useLookToTrade} from '../looktotrade/useLookToTrade';

export default function BigBoy() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId] = useTeamIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const playerData = usePlayerData();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [roster, setRoster] = useState<Roster>();
    const [specifiedUser, setSpecifiedUser] = useState<User>();

    const teamName =
        specifiedUser?.metadata?.team_name ?? specifiedUser?.display_name;

    const {graphicComponent: settingsGraphic} = useSettings(
        rosters?.length ?? 0,
        undefined,
        true
    );
    const {graphicComponent: startersGraphic} = useStarters(
        roster,
        undefined,
        true
    );

    const {graphicComponent: cornerstoneGraphic} = useCornerstone(
        roster,
        undefined,
        true
    );

    const {graphicComponent: depthScoreGraphic} = useDepthScore(
        roster,
        undefined,
        true
    );

    const {graphicComponent: playersToTargetGraphic} = usePlayersToTarget(
        undefined,
        true
    );

    const {graphicComponent: positionalGradesGraphic} = usePositionalGrades(
        roster,
        undefined,
        true
    );

    const {
        graphicComponent: lookToTradeGraphic,
        inputComponent: lookToTradeInput,
    } = useLookToTrade(roster, undefined, true);

    useEffect(() => {
        if (
            !rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !playerData ||
            allUsers.length === 0
        ) {
            return;
        }
        function getRosterFromTeamIdx(idx: number) {
            if (allUsers.length === 0 || !rosters) return;
            const ownerId = allUsers[idx].user_id;
            return rosters.find(r => r.owner_id === ownerId);
        }
        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');

        setRoster(newRoster);
    }, [rosters, teamId, playerData, allUsers]);

    useEffect(() => {
        if (!leagueId || !rosters) return;
        const ownerIds = new Set(rosters.map(r => r.owner_id));
        getAllUsers(leagueId).then(users =>
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            setAllUsers(users.filter(u => ownerIds.has(u.user_id)))
        );
    }, [leagueId, rosters]);
    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) return;
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function fullBlueprint() {
        return (
            <div className={styles.fullBlueprint}>
                {settingsGraphicComponent()}
                {startersGraphicComponent()}
                {cornerstoneGraphicComponent()}
                {depthScoreGraphicComponent()}
                {playersToTargetGraphicComponent()}
                {positionalGradesGraphicComponent()}
                {lookToTradeGraphicComponent()}
                {teamNameComponent()}
                <img src={blankblueprint} className={styles.base} />;
            </div>
        );
    }

    function settingsGraphicComponent() {
        return <div className={styles.settingsGraphic}>{settingsGraphic}</div>;
    }

    function startersGraphicComponent() {
        return <div className={styles.startersGraphic}>{startersGraphic}</div>;
    }

    function cornerstoneGraphicComponent() {
        return (
            <div className={styles.cornerstoneGraphic}>
                {cornerstoneGraphic}
            </div>
        );
    }

    function depthScoreGraphicComponent() {
        return (
            <div className={styles.depthScoreGraphic}>{depthScoreGraphic}</div>
        );
    }

    function playersToTargetGraphicComponent() {
        return (
            <div className={styles.playersToTargetGraphic}>
                {playersToTargetGraphic}
            </div>
        );
    }

    function positionalGradesGraphicComponent() {
        return (
            <div className={styles.positionalGradesGraphic}>
                {positionalGradesGraphic}
            </div>
        );
    }

    function lookToTradeGraphicComponent() {
        return (
            <div className={styles.lookToTradeGraphic}>
                {lookToTradeGraphic}
            </div>
        );
    }

    function teamNameComponent() {
        return <div className={styles.teamNameGraphic}>{teamName}</div>;
    }

    return (
        <div className={styles.BigBoy}>
            <ExportButton
                className={styles.fullBlueprint}
                pngName="test2.png"
            />
            {lookToTradeInput}
            <div>{fullBlueprint()}</div>
        </div>
    );
}
