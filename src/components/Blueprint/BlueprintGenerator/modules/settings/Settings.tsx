import {
    useLeague,
    useLeagueIdFromUrl,
    usePlayerData,
    useProjectedLineup,
    useRosterSettings,
    useTitle,
} from '../../../../../hooks/hooks';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './Settings.module.css';
import {IconButton, TextField} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';
import {
    BENCH,
    FLEX,
    FLEX_SET,
    QB,
    RB,
    SUPER_FLEX,
    SUPER_FLEX_SET,
    TE,
    WR,
    WR_RB_FLEX,
    WR_TE_FLEX,
} from '../../../../../consts/fantasy';
import ExportButton from '../../shared/ExportButton';
import {Dispatch, SetStateAction} from 'react';

export type SettingsProps = {
    roster?: Roster;
    leagueId?: string;
    teamName?: string;
    numRosters: number;
    graphicComponentClass?: string;
};
function Settings({
    roster,
    leagueId,
    numRosters,
    teamName,
    graphicComponentClass,
}: SettingsProps) {
    const league = useLeague(leagueId);
    const playerData = usePlayerData();
    const rosterSettings = useRosterSettings(league);
    const [startingLineup, _, benchString] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    useTitle('Settings - Blueprint Generator');

    function humanReadablePosition(position: string) {
        switch (position) {
            case FLEX:
                return 'WR/RB/TE';
            case WR_RB_FLEX:
                return 'WR/RB';
            case WR_TE_FLEX:
                return 'WR/TE';
            case SUPER_FLEX:
                return 'QB/WR/RB/TE';
        }
        return position;
    }

    function rosterComponent() {
        if (!playerData || !roster) return <></>;
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

    function rosterSettingsComponent() {
        const wrtFlex = rosterSettings.get(FLEX) ?? 0;
        const wrFlex = rosterSettings.get(WR_RB_FLEX) ?? 0;
        const wtFlex = rosterSettings.get(WR_TE_FLEX) ?? 0;

        const rosterSettingsArray = Array.from(rosterSettings);
        const hasFlexes =
            rosterSettingsArray.filter(([position]) => FLEX_SET.has(position))
                .length > 0;
        const hasBench = !!rosterSettings.get(BENCH);
        return (
            <div className={styles.rosterSettings}>
                <h3>League Settings: </h3>

                {rosterSettingsArray
                    .filter(([position]) => SUPER_FLEX_SET.has(position))
                    .map(([position, count]) => (
                        <div key={position}>{`${count} ${position}`}</div>
                    ))}

                {hasFlexes && (
                    <div key={FLEX}>
                        <div key={FLEX}>{wrtFlex + wrFlex + wtFlex} FLEX</div>
                        <div className={styles.indented}>
                            <div>{wrtFlex} W/R/T</div>
                            <div>{wrFlex} W/R</div>
                            <div>{wtFlex} W/T</div>
                        </div>
                    </div>
                )}

                {hasBench && (
                    <div key={BENCH}>{rosterSettings.get(BENCH)} BN</div>
                )}
            </div>
        );
    }

    function otherSettingsComponent() {
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings) return <></>;
        return (
            <div className={styles.otherSettings}>
                <div>{numRosters} team league</div>
                <div>SF: {rosterSettings.has(SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {scoringSettings.rec ?? 0}</div>
                <div className={styles.indented}>
                    <div>RB Bonus: {scoringSettings.bonus_rec_rb ?? 0}</div>
                    <div>WR Bonus: {scoringSettings.bonus_rec_wr ?? 0}</div>
                    <div>TE Bonus: {scoringSettings.bonus_rec_te ?? 0}</div>
                </div>
                <div>Pass TD: {scoringSettings.pass_td}</div>
                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{position: 'absolute', left: '-9999px', top: '-9999px'}}
            >
                <GraphicComponent
                    numRosters={numRosters}
                    graphicComponentClass={graphicComponentClass}
                    transparent={false}
                />
            </div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_settings.png`}
                />
            )}
            {!graphicComponentClass && rosterSettingsComponent()}
            {!graphicComponentClass && otherSettingsComponent()}
            {!graphicComponentClass && rosterComponent()}
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

interface inputProps {
    otherSettings: string;
    setOtherSettings: Dispatch<SetStateAction<string>>;
}

function InputComponent({otherSettings, setOtherSettings}: inputProps) {
    return (
        <TextField
            style={{margin: '4px'}}
            label={'Other Settings'}
            value={otherSettings}
            onChange={e => {
                setOtherSettings(e.target.value);
            }}
        />
    );
}

interface graphicProps {
    numRosters: number;
    otherSettings?: string;
    graphicComponentClass?: string;
    transparent?: boolean;
}
function GraphicComponent({
    numRosters,
    otherSettings,
    graphicComponentClass,
    transparent,
}: graphicProps) {
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const playerData = usePlayerData();
    const rosterSettings = useRosterSettings(league);
    function graphicComponent() {
        if (!playerData) return <></>;
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings) return <></>;
        const wrtFlex = rosterSettings.get(FLEX) ?? 0;
        const wrFlex = rosterSettings.get(WR_RB_FLEX) ?? 0;
        const wtFlex = rosterSettings.get(WR_TE_FLEX) ?? 0;
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                } ${transparent ? '' : styles.background}`}
            >
                <div className={styles.row}>
                    <div className={`${styles.chip} ${styles.red}`}>
                        QB: {rosterSettings.get(QB)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        RB: {rosterSettings.get(RB)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        WR: {rosterSettings.get(WR)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        TE: {rosterSettings.get(TE)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        FLEX: {wrtFlex + wrFlex + wtFlex}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        BN: {rosterSettings.get(BENCH)}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TEAMS: {numRosters}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        SF: {rosterSettings.has(SUPER_FLEX) ? 'YES' : 'NO'}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        PPR: {scoringSettings.rec ?? 0}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TEP: {scoringSettings.bonus_rec_te ?? 0}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TAXI: {league.settings.taxi_slots}
                    </div>
                </div>
                {otherSettings !== undefined && (
                    <div className={styles.otherSettings}>{otherSettings}</div>
                )}
            </div>
        );
    }

    return graphicComponent();
}

export {Settings, GraphicComponent, InputComponent};
