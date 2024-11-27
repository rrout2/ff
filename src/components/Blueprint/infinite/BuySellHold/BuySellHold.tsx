import {useEffect, useState} from 'react';
import {Roster} from '../../../../sleeper-api/sleeper-api';
import {PlayerTarget} from '../../v1/modules/playerstotarget/PlayersToTargetModule';
import styles from './BuySellHold.module.css';
import {hardBuy, hardSell, softBuy, softSell} from '../../../../consts/images';

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

export function useBuySells(roster?: Roster) {
    const [buys, setBuys] = useState<BuySellTileProps[]>([]);
    const [sells, setSells] = useState<BuySellTileProps[]>([]);
    const [holds, setHolds] = useState<BuySellTileProps[]>([]);
    useEffect(() => {
        if (!roster) return;
        setBuys(calculateBuys(roster));
        setSells(calculateSells(roster));
        setHolds(calculateHolds(roster));
    }, [roster]);
    return {buys, sells, holds};
}

function calculateBuys(roster?: Roster): BuySellTileProps[] {
    if (!roster) return [];
    return [
        {playerId: '11628', type: BuySellType.SoftBuy, reason: 'some reason'},
        {playerId: '8138', type: BuySellType.SoftBuy, reason: 'another reason'},
        {
            playerId: '11565',
            type: BuySellType.HardBuy,
            reason: 'a different, much longer reason',
        },
        {playerId: '10229', type: BuySellType.HardBuy, reason: 'some reason'},
    ];
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
            <div className={styles.playerTarget}>
                <PlayerTarget playerId={playerId} />
            </div>
            {!!reason && <div className={styles.reason}>{reason}</div>}
        </div>
    );
}
