import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './DepthScore.module.css';
import ExportButton from '../../../shared/ExportButton';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    useLeagueIdFromUrl,
    useRosterSettingsFromId,
    useProjectedLineup,
    usePlayerValues,
    PlayerValue,
    useLeague,
    useRosterSettings,
} from '../../../../../hooks/hooks';
const THRESHOLD = 150;
interface DepthScoreProps {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}

function DepthScore({
    roster,
    teamName,
    graphicComponentClass,
}: DepthScoreProps) {
    const [override, setOverride] = useState(-1);
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    const {bench, benchString} = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_depth_score.png`}
                />
            )}
            <OverrideComponent
                override={override}
                setOverride={setOverride}
                roster={roster}
            />
            <GraphicComponent
                override={override}
                graphicComponentClass={graphicComponentClass}
                transparent={false}
                benchString={benchString}
                bench={bench}
            />
        </div>
    );
}

interface graphicProps {
    override: number;
    bench: Player[];
    benchString: string;
    graphicComponentClass?: string;
    transparent?: boolean;
}
function GraphicComponent({
    override,
    graphicComponentClass,
    transparent,
    benchString,
    bench,
}: graphicProps) {
    const [score, setScore] = useState(-1);

    useEffect(() => {
        if (!bench.length) return;
        setScore(calculateDepthScoreOrOverride());
    }, [bench, override]);
    const {getPlayerValue} = usePlayerValues();

    function calculateDepthScoreOrOverride() {
        if (override >= 0) return override;
        return calculateDepthScore(bench, getPlayerValue);
    }

    const longBench = benchString.length > 305;

    return (
        <div
            className={`${styles.graphicComponent} ${
                graphicComponentClass ?? ''
            } ${transparent ? '' : styles.background}`}
        >
            <div className={styles.title}>DEPTH SCORE:</div>
            <div className={styles.scoreSection}>
                <div className={styles.scoreBar}>
                    <div
                        className={styles.scoreFill}
                        style={{width: `${score}0%`}}
                    />
                </div>
                <div className={styles.score}>{score}/10</div>
            </div>
            <div
                className={`${styles.benchString}${
                    longBench ? ` ${styles.longBench}` : ''
                }`}
            >
                {benchString}
            </div>
        </div>
    );
}
interface overrideProps {
    override: number;
    setOverride: Dispatch<SetStateAction<number>>;
    roster?: Roster;
}
function OverrideComponent({override, setOverride, roster}: overrideProps) {
    const [initialScore, setInitialScore] = useState(-1);
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const {bench} = useProjectedLineup(rosterSettings, roster?.players);
    const {getPlayerValue} = usePlayerValues();
    useEffect(() => {
        if (!bench.length) return;
        setInitialScore(calculateDepthScore(bench, getPlayerValue));
    }, [bench]);
    return (
        <FormControl style={{margin: '8px'}}>
            <InputLabel>Override</InputLabel>
            <Select
                value={override}
                label={'Override'}
                onChange={e => {
                    setOverride(+e.target.value);
                }}
            >
                <MenuItem value={-1}>None ({initialScore})</MenuItem>
                {Array.from({length: 11}, (_, index) => (
                    <MenuItem key={index} value={index}>
                        {index}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export function calculateDepthScore(
    bench: Player[],
    getPlayerValue: (playerName: string) => PlayerValue | undefined
) {
    const score = bench.reduce((acc: number, curr: Player) => {
        const playerValue = getPlayerValue(
            `${curr.first_name} ${curr.last_name}`
        );
        if (!playerValue) return acc;
        return acc + +playerValue.Value;
    }, 0);
    return Math.min(Math.round((10 * score) / THRESHOLD), 10);
}

export {DepthScore, GraphicComponent, OverrideComponent};
