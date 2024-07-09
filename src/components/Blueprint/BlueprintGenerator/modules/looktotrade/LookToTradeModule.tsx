import styles from './LookToTradeModule.module.css';
import ExportButton from '../../shared/ExportButton';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {useLookToTrade} from './useLookToTrade';

export default function LookToTradeModule(props: {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {roster, teamName, graphicComponentClass} = props;
    const {graphicComponent, inputComponent} = useLookToTrade(
        roster,
        graphicComponentClass
    );

    return (
        <>
            <div className={styles.body}>
                {graphicComponent}
                <div className={styles.inputComponent}>{inputComponent}</div>
            </div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_looktotrade.png`}
                />
            )}
        </>
    );
}
