import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './SuggestedMovesModule.module.css';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import {InputComponent as PlayersToTargetInput} from '../../../BlueprintGenerator/modules/playerstotarget/PlayersToTargetModule';
import {positionToColor} from '../../consts/colors';
import {mapToFullTeamName} from '../../consts/nflTeamNames';
import ExportButton from '../../../shared/ExportButton';
export type SuggestedMovesModuleProps = {
    roster?: Roster;
    teamName?: string;
};

export function useBuySells(roster: Roster | undefined) {
    const [sells, setSells] = useState<string[]>([]);
    const [buys, setBuys] = useState<string[]>([
        '10229',
        '5849',
        '4866',
        '10859',
        '11565',
        '11638',
    ]);
    useEffect(() => {
        if (!roster) return;
        setSells(roster.players.slice(0, 3));
    }, [roster]);

    return {sells, setSells, buys, setBuys};
}

export default function SuggestedMovesModule({
    roster,
    teamName,
}: SuggestedMovesModuleProps) {
    const {sells, setSells, buys, setBuys} = useBuySells(roster);

    return (
        <>
            <ExportButton
                className={styles.graphicComponent}
                pngName={`${teamName}_suggestedmoves.png`}
            />
            <InputComponent
                playerIds={roster?.players ?? []}
                sells={sells}
                setSells={setSells}
                buys={buys}
                setBuys={setBuys}
            />
            <GraphicComponent sells={sells} buys={buys} />
        </>
    );
}

export interface GraphicComponentProps {
    sells: string[];
    buys: string[];
    graphicClassName?: string;
}
export function GraphicComponent({
    sells,
    buys,
    graphicClassName,
}: GraphicComponentProps) {
    return (
        <div className={`${styles.graphicComponent} ${graphicClassName || ''}`}>
            {sells.length > 0 &&
                sells.map((s, idx) => (
                    <div key={idx} className={styles.buySellColumn}>
                        <SellTile playerId={s} />
                        {idx * 2 < buys.length && (
                            <BuyTile playerId={buys[idx * 2]} />
                        )}
                        {idx * 2 + 1 < buys.length && (
                            <BuyTile playerId={buys[idx * 2 + 1]} />
                        )}
                    </div>
                ))}
        </div>
    );
}
function SellTile({playerId}: {playerId: string}) {
    const playerData = usePlayerData();
    const {getPositionalAdp} = useAdpData();
    const player = playerData?.[playerId];

    if (!player) {
        console.warn(`Player ${playerId} not found in player data`);
        return null;
    }

    return (
        <div
            className={styles.sellTile}
            style={{background: positionToColor[player.position]}}
        >
            <div className={styles.sellLabelCol}>
                <div className={styles.sellLabel}>&#8594;&nbsp;SELL</div>
            </div>
            <div className={styles.sellTileText}>
                <div className={styles.positionalAdp}>
                    {player.position}&nbsp;
                    {getPositionalAdp(
                        `${player.first_name} ${player.last_name}`
                    )}
                </div>
                <div className={styles.playerName}>
                    {player.first_name} {player.last_name}
                </div>
                <div className={styles.teamName}>
                    {mapToFullTeamName.get(player.team)}
                </div>
            </div>
            <div style={{width: '70px', height: '100%'}} />
        </div>
    );
}

function BuyTile({playerId}: {playerId: string}) {
    const playerData = usePlayerData();
    const {getPositionalAdp} = useAdpData();
    const player = playerData?.[playerId];

    if (!player) {
        console.warn(`Player ${playerId} not found in player data`);
        return null;
    }

    return (
        <div className={styles.buyTileContainer}>
            <div className={styles.buyTileColumn}>
                <div
                    className={styles.buyTile}
                    style={{
                        background: positionToColor[player.position],
                    }}
                >
                    <div className={styles.positionalAdp}>
                        {player.position}&nbsp;
                        {getPositionalAdp(
                            `${player.first_name} ${player.last_name}`
                        )}
                    </div>
                    <div className={styles.playerName}>
                        {player.first_name} {player.last_name}
                    </div>
                    <div className={styles.teamName}>
                        {mapToFullTeamName.get(player.team)}
                    </div>
                </div>
            </div>
            <img
                className={styles.playerImg}
                src={`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`}
            />
            <div className={styles.buyLabel}>BUY</div>
        </div>
    );
}
export interface InputComponentProps {
    playerIds: string[];
    sells: string[];
    setSells: (newSells: string[]) => void;
    buys: string[];
    setBuys: (newBuys: string[]) => void;
}
export function InputComponent(props: InputComponentProps) {
    const {playerIds, sells, setSells, buys, setBuys} = props;

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '500px'}}>
            <PlayerSelectComponent
                playerIds={playerIds}
                selectedPlayerIds={sells}
                onChange={setSells}
                label="Sells"
            />
            <PlayersToTargetInput
                playerSuggestions={buys}
                setPlayerSuggestions={
                    setBuys as Dispatch<SetStateAction<string[]>>
                }
                label="Buy"
            />
        </div>
    );
}
