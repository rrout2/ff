import {Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './Starters.module.css';
import {useTitle} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {useStarters} from './useStarters';

export default function Starters(props: {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {roster, teamName, graphicComponentClass} = props;
    const {graphicComponent} = useStarters(roster, graphicComponentClass);
    useTitle('Starters - Blueprint Generator');

    return (
        <>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_starters.png`}
                />
            )}
            {graphicComponent}
        </>
    );
}
