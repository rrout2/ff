import {Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './DepthScore.module.css';
import ExportButton from '../../shared/ExportButton';
import {useDepthScore} from './useDepthScore';

interface DepthScoreProps {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}

export default function DepthScore({
    roster,
    teamName,
    graphicComponentClass,
}: DepthScoreProps) {
    const {graphicComponent, overrideComponent} = useDepthScore(
        roster,
        graphicComponentClass
    );

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_depth_score.png`}
                />
            )}
            {overrideComponent}
            {graphicComponent}
        </div>
    );
}
