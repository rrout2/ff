import styles from './CornerstoneModule.module.css';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {useCornerstone} from './useCornerstone';

export default function CornerstoneModule(props: {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {roster, teamName, graphicComponentClass} = props;
    const {graphicComponent, allPositionalSelectors} = useCornerstone(
        roster,
        graphicComponentClass
    );

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {graphicComponent}
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_cornerstones.png`}
                />
            )}
            {allPositionalSelectors}
        </div>
    );
}
