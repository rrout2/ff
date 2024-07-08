import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import styles from './Starters.module.css';
import {useTitle} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {useStarters} from './useStarters';

export default function Starters(props: {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}) {
    const {roster, specifiedUser, graphicComponentClass} = props;
    const {graphicComponent} = useStarters(roster, graphicComponentClass);
    useTitle('Starters - Blueprint Generator');

    return (
        <>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_starters.png`}
                />
            )}
            {graphicComponent}
        </>
    );
}
