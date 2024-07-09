import styles from './PlayersToTargetModule.module.css';
import ExportButton from '../../shared/ExportButton';
import {usePlayersToTarget} from './usePlayersToTarget';

export default function PlayersToTargetModule(props: {
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {teamName, graphicComponentClass} = props;
    const {graphicComponent, inputComponent} = usePlayersToTarget(
        graphicComponentClass
    );
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {graphicComponent}
            {inputComponent}
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_playerstotarget.png`}
                />
            )}
        </div>
    );
}
