import {useEffect, useState} from 'react';
import {Roster} from '../../../../sleeper-api/sleeper-api';
import {PlayerTarget} from '../../v1/modules/playerstotarget/PlayersToTargetModule';
import styles from './BuySellHold.module.css';
import {hardBuy, hardSell, softBuy, softSell} from '../../../../consts/images';
import {RosterTier, useRosterTierAndPosGrades} from '../RosterTier/RosterTier';
import {QB, RB, TE, WR} from '../../../../consts/fantasy';
import {useBuySellData} from '../../../../hooks/hooks';

enum BuySellType {
    SoftBuy,
    HardBuy,
    SoftSell,
    HardSell,
    Hold,
}

type BuySellTileProps = {
    playerId: string;
    type: BuySellType;
    reason?: string;
};

export function useBuySells(
    isSuperFlex: boolean,
    leagueSize: number,
    roster?: Roster
) {
    const {tier, qbGrade, rbGrade, wrGrade, teGrade} =
        useRosterTierAndPosGrades(isSuperFlex, leagueSize, roster);
    const [buys, setBuys] = useState<BuySellTileProps[]>([]);
    const [sells, setSells] = useState<BuySellTileProps[]>([]);
    const [holds, setHolds] = useState<BuySellTileProps[]>([]);
    const {qbBuys, rbBuys, wrBuys, teBuys} = useBuySellData();
    useEffect(() => {
        if (!roster) return;
        setBuys(calculateBuys());
        setSells(calculateSells(roster));
        setHolds(calculateHolds(roster));
    }, [qbBuys, rbBuys, wrBuys, teBuys, qbGrade, rbGrade, wrGrade, teGrade]);

    /**
     * Sorts the positions (QB, RB, WR, TE) in order of best grade to worst.
     * @param grades grades for each position
     * @returns an array of positions, sorted by grade
     */
    function getPositionalOrder(grades: {
        qbGrade: number;
        rbGrade: number;
        wrGrade: number;
        teGrade: number;
    }) {
        return Object.entries(grades)
            .sort((a, b) => a[1] - b[1])
            .map(([pos]) => {
                switch (pos) {
                    case 'qbGrade':
                        return QB;
                    case 'rbGrade':
                        return RB;
                    case 'wrGrade':
                        return WR;
                    case 'teGrade':
                        return TE;
                    default:
                        throw new Error('Unknown position ' + pos);
                }
            });
    }

    function numToTarget(grade: number) {
        if (grade >= 8) {
            return 1;
        }
        if (grade >= 6) {
            return 2;
        }
        return 3;
    }

    function calculateBuys(): BuySellTileProps[] {
        const buys: BuySellTileProps[] = [];
        const rbTargets = numToTarget(rbGrade);
        const qbTargets = numToTarget(qbGrade);
        const wrTargets = numToTarget(wrGrade);
        const teTargets = numToTarget(teGrade);
        const gradeOrder = getPositionalOrder({
            qbGrade,
            rbGrade,
            wrGrade,
            teGrade,
        });
        for (const pos of gradeOrder) {
            let numAdded = 0;
            let i = 0;
            switch (pos) {
                case QB:
                    while (numAdded < qbTargets) {
                        if (roster?.players.includes(qbBuys[i].player_id)) {
                            i++;
                            continue;
                        }
                        buys.push({
                            playerId: qbBuys[i].player_id,
                            type:
                                qbBuys[i].verdict === 'Soft Buy'
                                    ? BuySellType.SoftBuy
                                    : BuySellType.HardBuy,
                            reason: qbBuys[i].explanation,
                        });
                        numAdded++;
                        i++;
                    }
                    break;
                case RB:
                    if (
                        tier === RosterTier.Rebuild ||
                        tier === RosterTier.Reload
                    ) {
                        continue;
                    }
                    while (numAdded < rbTargets) {
                        if (roster?.players.includes(rbBuys[i].player_id)) {
                            i++;
                            continue;
                        }
                        buys.push({
                            playerId: rbBuys[i].player_id,
                            type:
                                rbBuys[i].verdict === 'Soft Buy'
                                    ? BuySellType.SoftBuy
                                    : BuySellType.HardBuy,
                            reason: rbBuys[i].explanation,
                        });
                        numAdded++;
                        i++;
                    }
                    break;
                case WR:
                    while (numAdded < wrTargets) {
                        if (roster?.players.includes(wrBuys[i].player_id)) {
                            i++;
                            continue;
                        }
                        buys.push({
                            playerId: wrBuys[i].player_id,
                            type:
                                wrBuys[i].verdict === 'Soft Buy'
                                    ? BuySellType.SoftBuy
                                    : BuySellType.HardBuy,
                            reason: wrBuys[i].explanation,
                        });
                        numAdded++;
                        i++;
                    }
                    break;
                case TE:
                    while (numAdded < teTargets) {
                        if (roster?.players.includes(teBuys[i].player_id)) {
                            i++;
                            continue;
                        }
                        buys.push({
                            playerId: teBuys[i].player_id,
                            type:
                                teBuys[i].verdict === 'Soft Buy'
                                    ? BuySellType.SoftBuy
                                    : BuySellType.HardBuy,
                            reason: teBuys[i].explanation,
                        });
                        numAdded++;
                        i++;
                    }
                    break;
                default:
                    throw new Error('Unknown position ' + pos);
            }
        }
        return buys;
    }

    return {buys, sells, holds};
}
function calculateSells(roster?: Roster): BuySellTileProps[] {
    if (!roster) return [];
    return [
        {
            playerId: roster.players[0],
            type: BuySellType.SoftSell,
            reason: 'a reason',
        },
        {
            playerId: roster.players[1],
            type: BuySellType.HardSell,
            reason: 'another reason',
        },
    ];
}

function calculateHolds(roster?: Roster): BuySellTileProps[] {
    if (!roster) return [];
    return roster.players.slice(2, 4).map(p => ({
        playerId: p,
        type: BuySellType.Hold,
    }));
}

function mapToImgSrc(type: BuySellType) {
    switch (type) {
        case BuySellType.SoftBuy:
            return softBuy;
        case BuySellType.HardBuy:
            return hardBuy;
        case BuySellType.SoftSell:
            return softSell;
        case BuySellType.HardSell:
            return hardSell;
        case BuySellType.Hold:
            throw new Error('Hold should not be mapped to an image');
    }
}

export function BuySellTile({playerId, type, reason}: BuySellTileProps) {
    if (!playerId) return <></>;
    return (
        <div>
            {type !== BuySellType.Hold && (
                <img src={mapToImgSrc(type)} className={styles.buySellImage} />
            )}
            <PlayerTarget playerId={playerId} smaller />
            {!!reason && <div className={styles.reason}>{reason}</div>}
        </div>
    );
}
