import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import styles from './DepthScore.module.css';
import ExportButton from '../../shared/ExportButton';
import {useDepthScore} from './useDepthScore';

interface DepthScoreProps {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}

export default function DepthScore({
    roster,
    specifiedUser,
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
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_depth_score.png`}
                />
            )}
            {overrideComponent}
            {graphicComponent}
        </div>
    );
}
