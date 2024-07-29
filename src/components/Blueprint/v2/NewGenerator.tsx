import {useLeagueIdFromUrl} from '../../../hooks/hooks';

export default function NewGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    return <>{leagueId}</>;
}
