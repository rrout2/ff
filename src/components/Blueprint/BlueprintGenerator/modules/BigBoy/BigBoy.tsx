import {blankblueprint} from '../../../../../consts/images';
import {useLeagueIdFromUrl, useFetchRosters} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {useSettings} from '../settings/useSettings';
import styles from './BigBoy.module.css';

export default function BigBoy() {
    const [leagueId] = useLeagueIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const {graphicComponent: settingsGraphic} = useSettings(
        rosters?.length ?? 0,
        'settingsGraphic',
        true
    );
    function fullBlueprint() {
        return (
            <div className={styles.fullBlueprint}>
                {settingsGraphicComponent()}
                <img src={blankblueprint} className={styles.base} />;
            </div>
        );
    }

    function settingsGraphicComponent() {
        return <div className={styles.settingsGraphic}>{settingsGraphic}</div>;
    }

    return (
        <div className={styles.BigBoy}>
            <ExportButton
                className={styles.fullBlueprint}
                pngName="test2.png"
            />
            {fullBlueprint()}
        </div>
    );
}
