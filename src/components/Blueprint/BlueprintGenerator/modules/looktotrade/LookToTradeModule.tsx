import styles from './LookToTradeModule.module.css';
import ExportButton from '../../shared/ExportButton';
import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import {useLookToTrade} from './useLookToTrade';

export default function LookToTradeModule(props: {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}) {
    const {roster, specifiedUser, graphicComponentClass} = props;
    const {graphicComponent, inputComponent} = useLookToTrade(
        roster,
        graphicComponentClass
    );

    return (
        <>
            <div className={styles.body}>
                {graphicComponent}
                {inputComponent}
            </div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_looktotrade.png`}
                />
            )}
        </>
    );
}
