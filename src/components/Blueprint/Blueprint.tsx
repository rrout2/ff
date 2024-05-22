import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useFetchUsers,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../hooks/hooks';
import {League, Player, Roster, getLeague} from '../../sleeper-api/sleeper-api';
import styles from './Blueprint.module.css';
import {teamSelectComponent} from '../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../consts/urlParams';
import {sortBySearchRank} from '../Player/Search/PlayerSearch';
import {IconButton} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';
export default function Blueprint() {
    const [leagueId] = useLeagueIdFromUrl();
    const [league, setLeague] = useState<League>();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const specifiedUser = allUsers?.[+teamId];
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    const [startingLineup, setStartingLineup] = useState<
        {player: Player; position: string}[]
    >([]);
    const [benchString, setBenchString] = useState('');

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
    }, [leagueId]);

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

    useEffect(() => {
        const settings = new Map<string, number>();
        league?.roster_positions.forEach(pos => {
            if (!settings.has(pos)) {
                settings.set(pos, 0);
            }
            settings.set(pos, settings.get(pos)! + 1);
        });
        setRosterSettings(settings);
    }, [league?.roster_positions]);

    useEffect(() => {
        if (!playerData || !roster) return;
        const remainingPlayers = new Set(roster.players);
        const starters: {player: Player; position: string}[] = [];
        Array.from(rosterSettings)
            .filter(([position]) => position !== 'BN')
            .forEach(([position, count]) => {
                const bestAtPosition = getBestNAtPosition(
                    position,
                    count,
                    remainingPlayers
                );
                bestAtPosition.forEach(p => {
                    remainingPlayers.delete(p.player_id);
                    starters.push({
                        player: p,
                        position: position,
                    });
                });
            });

        setStartingLineup(starters);

        setBenchString(
            Array.from(remainingPlayers)
                .map(p => playerData[p])
                .sort(
                    (a, b) =>
                        a.position.localeCompare(b.position) ||
                        a.last_name.localeCompare(b.last_name)
                )
                .reduce((acc, player, idx) => {
                    const isLast = idx === remainingPlayers.size - 1;
                    const trailingText = isLast ? '' : ', ';
                    return `${acc}${player.first_name[0]}. ${player.last_name} (${player.position})${trailingText}`;
                }, '')
                .toLocaleUpperCase()
        );
    }, [playerData, roster, rosterSettings]);

    function getBestNAtPosition(
        position: string,
        count: number,
        remainingPlayers: Set<string>
    ): Player[] {
        if (!playerData || !roster) return [];
        switch (position) {
            case 'FLEX':
                return roster.players
                    .filter(p => remainingPlayers.has(p))
                    .map(p => playerData[p])
                    .filter(
                        p =>
                            p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB') ||
                            p.fantasy_positions.includes('TE')
                    )
                    .sort(sortBySearchRank)
                    .slice(0, count);
            case 'WRRB_FLEX':
                return roster.players
                    .filter(p => remainingPlayers.has(p))
                    .map(p => playerData[p])
                    .filter(
                        p =>
                            p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB')
                    )
                    .sort(sortBySearchRank)
                    .slice(0, count);
            case 'REC_FLEX':
                return roster.players
                    .filter(p => remainingPlayers.has(p))
                    .map(p => playerData[p])
                    .filter(
                        p =>
                            p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('TE')
                    )
                    .sort(sortBySearchRank)
                    .slice(0, count);

            case 'SUPER_FLEX':
                return roster.players
                    .filter(p => remainingPlayers.has(p))
                    .map(p => playerData[p])
                    .filter(
                        p =>
                            p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB') ||
                            p.fantasy_positions.includes('TE') ||
                            p.fantasy_positions.includes('QB')
                    )
                    .sort((a, b) => {
                        // manually prioritizing QBs for super flex
                        if (a.position === 'QB' && b.position !== 'QB') {
                            return -1;
                        }
                        if (a.position !== 'QB' && b.position === 'QB') {
                            return 1;
                        }
                        return sortBySearchRank(a, b);
                    })
                    .slice(0, count);
            default: // non-flex positions
                return roster.players
                    .filter(p => remainingPlayers.has(p))
                    .map(p => playerData[p])
                    .filter(p => p.fantasy_positions.includes(position))
                    .sort(sortBySearchRank)
                    .slice(0, count);
        }
    }

    function humanReadablePosition(position: string) {
        switch (position) {
            case 'FLEX':
                return 'WR/RB/TE';
            case 'WRRB_FLEX':
                return 'WR/RB';
            case 'REC_FLEX':
                return 'WR/TE';
            case 'SUPER_FLEX':
                return 'QB/WR/RB/TE';
        }
        return position;
    }

    function rosterComponent() {
        if (!hasTeamId() || !playerData || !roster) return <></>;
        return (
            <>
                <div>
                    <h3>Projected Starters: </h3>
                    {startingLineup.map(({player, position}) => {
                        const starterString =
                            `${player.first_name} ${player.last_name}`.toLocaleUpperCase();
                        const posTeamString = `${player.position} - ${player.team}`;
                        return (
                            <div className={styles.playerRow}>
                                <div className={styles.column}>
                                    {humanReadablePosition(position)}
                                </div>
                                {copyWrapper(starterString, styles.column)}
                                {copyWrapper(posTeamString, styles.column)}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.bench}>
                    <h3>Bench: </h3>
                    {copyWrapper(benchString)}
                </div>
            </>
        );
    }

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function rosterSettingsComponent() {
        const wrtFlex = rosterSettings.get('FLEX') ?? 0;
        const wrFlex = rosterSettings.get('WRRB_FLEX') ?? 0;
        const wtFlex = rosterSettings.get('REC_FLEX') ?? 0;
        const totalFlexes = wrtFlex + wrFlex + wtFlex;
        const allowSet = new Set([
            'QB',
            'RB',
            'WR',
            'TE',
            'SUPER_FLEX',
            'FLEX',
            'BN',
        ]);
        return (
            <div className={styles.rosterSettings}>
                <h3>League Settings: </h3>
                {Array.from(rosterSettings)
                    .filter(([position]) => allowSet.has(position))
                    .map(([position, count]) => {
                        if (position !== 'FLEX') {
                            return (
                                <div
                                    key={position}
                                >{`${count} ${position}`}</div>
                            );
                        }
                        return (
                            <div key={'FLEX'}>
                                <div key={'FLEX'}>
                                    {totalFlexes} {position}
                                </div>
                                <div className={styles.subflex}>
                                    <div>{wrtFlex} W/R/T</div>
                                    <div>{wrFlex} W/R</div>
                                    <div>{wtFlex} W/T</div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }

    function otherSettingsComponent() {
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings || !rosters) return <></>;
        return (
            <div className={styles.otherSettings}>
                <div>{rosters.length} team league</div>
                <div>SF: {rosterSettings.has('SUPER_FLEX') ? 'YES' : 'NO'}</div>
                <div>PPR: {scoringSettings.rec ?? 0}</div>
                <div className={styles.subflex}>
                    <div>RB Bonus: {scoringSettings.bonus_rec_rb ?? 0}</div>
                    <div>WR Bonus: {scoringSettings.bonus_rec_wr ?? 0}</div>
                    <div>TE Bonus: {scoringSettings.bonus_rec_te ?? 0}</div>
                </div>

                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>
        );
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser)}
            {rosterSettingsComponent()}
            {otherSettingsComponent()}
            {rosterComponent()}
        </div>
    );
}

function copyWrapper(text: string, className?: string) {
    return (
        <div className={styles.copyWrapper + (` ${className}` ?? '')}>
            <IconButton
                onClick={() => navigator.clipboard.writeText(text)}
                size="small"
            >
                <ContentCopy />
            </IconButton>
            {text}
        </div>
    );
}
