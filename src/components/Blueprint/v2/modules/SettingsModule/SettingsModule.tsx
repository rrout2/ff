import styles from './SettingsModule.module.css';
import {useLeague, useRosterSettings} from '../../../../../hooks/hooks';
import {
    BENCH,
    FLEX,
    QB,
    RB,
    SUPER_FLEX,
    TE,
    WR,
    WR_RB_FLEX,
    WR_TE_FLEX,
} from '../../../../../consts/fantasy';
import ExportButton from '../../../shared/ExportButton';
import {color} from '../../consts/colors';

interface SettingsModuleProps {
    leagueId?: string;
    teamName?: string;
    numRosters?: number;
}

export default function SettingsModule(props: SettingsModuleProps) {
    const {leagueId, teamName, numRosters} = props;

    return (
        <>
            <ExportButton
                className={styles.graphicComponent}
                pngName={`${teamName}_settings.png`}
            />
            <GraphicComponent leagueId={leagueId} numRosters={numRosters} />
        </>
    );
}
export interface GraphicComponentProps {
    graphicClassName?: string;
    leagueId?: string;
    numRosters?: number;
    transparent?: boolean;
}

export function GraphicComponent({
    graphicClassName,
    leagueId,
    numRosters,
    transparent = false,
}: GraphicComponentProps) {
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    function multiColorBackground(background: color[]) {
        if (background.length === 4) {
            return (
                <div className={styles.multiColorBackground}>
                    <div className={styles.colorRow}>
                        <div
                            style={{
                                backgroundColor: background[0],
                            }}
                            className={styles.sizeOfFour}
                        />
                        <div
                            style={{
                                backgroundColor: background[1],
                            }}
                            className={styles.sizeOfFour}
                        />
                    </div>
                    <div className={styles.colorRow}>
                        <div
                            style={{
                                backgroundColor: background[2],
                            }}
                            className={styles.sizeOfFour}
                        />
                        <div
                            style={{
                                backgroundColor: background[3],
                            }}
                            className={styles.sizeOfFour}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.multiColorBackground}>
                <div className={styles.colorRow}>
                    <div
                        style={{
                            backgroundColor: background[0],
                        }}
                        className={styles.sizeOfThree}
                    />
                    <div
                        style={{
                            backgroundColor: background[1],
                        }}
                        className={styles.sizeOfThree}
                    />
                    <div
                        style={{
                            backgroundColor: background[2],
                        }}
                        className={styles.sizeOfThree}
                    />
                </div>
            </div>
        );
    }

    function multiColoredTile(value: number | string, ...background: color[]) {
        return (
            <div className={styles.multiColoredTileContainer}>
                {multiColorBackground(background)}
                <div className={styles.multiColorValue}>{value}</div>
            </div>
        );
    }

    function settingTile(value: number | string, ...background: color[]) {
        if (background.length === 1) {
            return (
                <div
                    className={styles.settingTile}
                    style={{backgroundColor: background[0]}}
                >
                    {value}
                </div>
            );
        } else {
            return multiColoredTile(value, ...background);
        }
    }

    function numFlexes() {
        return (
            (rosterSettings.get(FLEX) ?? 0) +
            (rosterSettings.get(WR_RB_FLEX) ?? 0) +
            (rosterSettings.get(WR_TE_FLEX) ?? 0)
        );
    }

    return (
        <div
            className={`${styles.graphicComponent} ${graphicClassName ?? ''}`}
            style={{backgroundColor: transparent ? 'transparent' : '#005D91'}}
        >
            {settingTile(numRosters ?? 0, color.white)}
            {settingTile(
                (league?.scoring_settings?.rec ?? 0).toFixed(1),
                color.white
            )}
            {settingTile(
                (league?.scoring_settings?.bonus_rec_te ?? 0).toFixed(1),
                color.white
            )}
            {settingTile(rosterSettings.get(QB) ?? 0, color.qb)}
            {settingTile(rosterSettings.get(RB) ?? 0, color.rb)}
            {settingTile(rosterSettings.get(WR) ?? 0, color.wr)}
            {settingTile(rosterSettings.get(TE) ?? 0, color.te)}
            {settingTile(numFlexes(), color.rb, color.wr, color.te)}
            {settingTile(
                rosterSettings.get(SUPER_FLEX) ?? 0,
                color.qb,
                color.rb,
                color.wr,
                color.te
            )}
            {settingTile(rosterSettings.get(BENCH) ?? 0, color.red)}
            {settingTile(league?.settings.taxi_slots ?? 0, color.red)}
        </div>
    );
}
