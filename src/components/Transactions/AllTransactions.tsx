import {useQuery} from 'react-query';
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
import {useState} from 'react';
import PlayerPreview from '../Player/PlayerPreview/PlayerPreview';
import styles from './AllTransactions.module.css';
import Menu from '../Menu/Menu';
import {CircularProgress} from '@mui/material';

export default function AllTransactions() {
    const [leagueId] = useLeagueIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const playerData = usePlayerData();

    const {data: fetchedTransactions} = useQuery({
        enabled: leagueId !== '',
        queryFn: async () => {
            const res = await getTransacations(leagueId);
            setTransactions(res);
            return res;
        },
        staleTime: 10000,
    });
    const [transactions, setTransactions] = useState<Transaction[]>(
        fetchedTransactions ?? []
    );

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

    function singleTransaction(t: Transaction) {
        const {transaction_id} = t;
        if (!playerData || !allUsers) return <></>;

        const addsByUser = getAddsByUser(t);

        return (
            <div key={transaction_id} className={styles.singleton}>
                {Array.from(addsByUser).map(([user, adds]) => (
                    <>
                        {user.display_name} received:
                        {adds.map(add => {
                            if (typeof add === 'string') {
                                return (
                                    <PlayerPreview
                                        player={playerData[add]}
                                        leagueId={leagueId}
                                        hideHeadshot={true}
                                    />
                                );
                            }
                            return (
                                <div>{`${add.season} Round ${add.round}`}</div>
                            );
                        })}
                    </>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.menuWrapper}>
            <div className={styles.flexSpace} />
            <div>
                {transactions.map(singleTransaction)}
                {!(playerData && allUsers) && <CircularProgress />}
            </div>
            <div className={styles.flexSpace}>
                <Menu />
            </div>
        </div>
    );
}
