import {Button} from '@mui/material';
import {blankblueprint} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    useTeamIdFromUrl,
    useFetchRosters,
} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {useSettings} from '../settings/useSettings';
import styles from './BigBoy.module.css';

export default function BigBoy() {
    const [leagueId] = useLeagueIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const {graphicComponent: settingsGraphic} = useSettings(
        rosters?.length ?? 0,
        'settingsGraphic'
    );
    function blueprintBase() {
        return (
            <div className="yeet">
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
            <ExportButton className={'yeet'} pngName="test2.png" />
            {blueprintBase()}
        </div>
    );
}
