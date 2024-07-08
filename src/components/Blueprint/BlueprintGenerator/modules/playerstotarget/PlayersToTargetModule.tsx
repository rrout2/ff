import styles from './PlayersToTargetModule.module.css';
import ExportButton from '../../shared/ExportButton';
import {User} from '../../../../../sleeper-api/sleeper-api';
import {usePlayersToTarget} from './usePlayersToTarget';

export default function PlayersToTargetModule(props: {
    specifiedUser?: User;
    graphicComponentClass?: string;
}) {
    const {specifiedUser, graphicComponentClass} = props;
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
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_playerstotarget.png`}
                />
            )}
        </div>
    );
}
