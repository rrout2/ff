import {Roster} from '../../../../sleeper-api/sleeper-api';
import styles from './RosterTier.module.css';

export function calculateRosterTier(roster?: Roster): RosterTier {
    if (!roster) {
        return RosterTier.Unknown;
    }
    // TODO: Use algorithm to calculate tier
    return RosterTier.Championship;
}

function getTierColor(tier: RosterTier) {
    switch (tier) {
        case RosterTier.Rebuild:
            return '#ee2924';
        case RosterTier.Reload:
            return '#f15a29';
        case RosterTier.Competitive:
            return '#f1bb1f';
        case RosterTier.Championship:
            return '#8dc63f';
        case RosterTier.Elite:
            return '#009444';
        default:
            return '#000000';
    }
}

enum RosterTier {
    Unknown = 'UNKNOWN',
    Rebuild = 'REBUILD',
    Reload = 'RELOAD',
    Competitive = 'COMPETITIVE',
    Championship = 'CHAMPIONSHIP',
    Elite = 'ELITE',
}
type RosterTierComponentProps = {
    tier: RosterTier;
};

const RosterTierComponent = ({tier}: RosterTierComponentProps) => {
    return (
        <div className={styles.rosterTier} style={{color: getTierColor(tier)}}>
            {tier}
        </div>
    );
};

export default RosterTierComponent;
