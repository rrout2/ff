import styles from './CornerstoneModule.module.css';
import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {useCornerstone} from './useCornerstone';

export default function CornerstoneModule(props: {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}) {
    const {roster, specifiedUser, graphicComponentClass} = props;
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
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_cornerstones.png`}
                />
            )}
            {allPositionalSelectors}
        </div>
    );
}
