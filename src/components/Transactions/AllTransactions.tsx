import {
    useFetchUsers,
    useFetchRosters,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../hooks/hooks';
import {
    TradedPick,
    Transaction,
    User,
    getTransacations,
} from '../../sleeper-api/sleeper-api';
import {useEffect, useState} from 'react';
import PlayerPreview from '../Player/PlayerPreview/PlayerPreview';
import styles from './AllTransactions.module.css';
import Menu from '../Menu/Menu';
import {CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {LEAGUE_ID, TEAM_ID} from '../../consts/urlParams';

export default function AllTransactions() {
    const [leagueId] = useLeagueIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const playerData = usePlayerData();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (!leagueId) return;
        getTransacations(leagueId).then(txns => setTransactions(txns));
    }, [leagueId]);

    function findUser(userId: number) {
        if (!allUsers) return;

        return allUsers[userId - 1];
    }

    function getAddsByUser({adds, draft_picks}: Transaction) {
        const addsByUser = new Map<User, (string | TradedPick)[]>();

        for (const playerId in adds) {
            const user = findUser(adds[playerId])!;
            if (!addsByUser.has(user)) {
                addsByUser.set(user, []);
            }
            addsByUser.set(user, [playerId, ...addsByUser.get(user)!]);
        }

        draft_picks.forEach(pick => {
            const user = findUser(pick.owner_id)!;
            if (!addsByUser.has(user)) {
                addsByUser.set(user, []);
            }
            addsByUser.set(user, [pick, ...addsByUser.get(user)!]);
        });
        return addsByUser;
    }

    function getDropsByUser({drops, draft_picks}: Transaction) {
        const dropsByUser = new Map<User, (string | TradedPick)[]>();

        for (const playerId in drops) {
            const user = findUser(drops[playerId])!;
            if (!dropsByUser.has(user)) {
                dropsByUser.set(user, []);
            }
            dropsByUser.set(user, [playerId, ...dropsByUser.get(user)!]);
        }
        draft_picks.forEach(pick => {
            const user = findUser(pick.previous_owner_id)!;
            if (!dropsByUser.has(user)) {
                dropsByUser.set(user, []);
            }
            dropsByUser.set(user, [pick, ...dropsByUser.get(user)!]);
        });
        return dropsByUser;
    }

    function addDropPiece(addDrop: string | TradedPick) {
        if (!playerData) return <></>;
        if (typeof addDrop === 'string') {
            return (
                <PlayerPreview
                    player={playerData[addDrop]}
                    leagueId={leagueId}
                    hideHeadshot={true}
                />
            );
        }
        return <div>{`${addDrop.season} Round ${addDrop.round}`}</div>;
    }

    function singleTransactionComponent(t: Transaction) {
        if (!playerData || !allUsers) return <></>;

        const addsByUser = getAddsByUser(t);
        const dropsByUser = getDropsByUser(t);

        if (addsByUser.size === 0) return <></>;
        const isWaiverMove = t.roster_ids.length === 1;

        const addedText = isWaiverMove ? 'added' : 'received';
        const droppedText = isWaiverMove ? 'dropped' : 'sent';

        return (
            <div key={t.transaction_id} className={styles.singleton}>
                {t.roster_ids.map((userId, idx) => {
                    const user = findUser(userId);
                    if (!user) {
                        return <></>;
                    }

                    const adds = addsByUser.get(user);
                    const drops = dropsByUser.get(user);

                    return (
                        <>
                            <div
                                className={
                                    styles.teamLabel +
                                    (idx > 0 ? ` ${styles.notFirst}` : '')
                                }
                                onClick={() => {
                                    const teamId = allUsers.findIndex(
                                        u => u.user_id === user.user_id
                                    );
                                    navigate(
                                        `../team?${LEAGUE_ID}=${leagueId}&${TEAM_ID}=${teamId}`
                                    );
                                }}
                            >
                                {user.display_name}
                            </div>
                            {!!adds && (
                                <>
                                    {addedText}
                                    {adds.map(addDropPiece)}
                                </>
                            )}
                            {!!drops && (
                                <>
                                    {droppedText}
                                    {drops.map(addDropPiece)}
                                </>
                            )}
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={styles.menuWrapper}>
            <div className={styles.flexSpace} />
            <div>
                {transactions.map(singleTransactionComponent)}
                {!(playerData && allUsers) && <CircularProgress />}
            </div>
            <div className={styles.flexSpace}>
                <Menu />
            </div>
        </div>
    );
}
