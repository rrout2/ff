import React, {useState} from 'react';
import styles from './NonSleeeperInfinite.module.css';
import {Roster} from '../../sleeper-api/sleeper-api';
import {useNonSleeper} from '../../hooks/hooks';
import {NonSleeperInput} from '../Blueprint/shared/NonSleeperInput';
export default function NonSleeeperInfinite() {
    const [roster, setRoster] = useState<Roster>();

    const {
        nonSleeperIds,
        setNonSleeperIds,
        nonSleeperRosterSettings,
        setNonSleeperRosterSettings,
        ppr,
        setPpr,
        teBonus,
        setTeBonus,
        numRosters,
        setNumRosters,
        taxiSlots,
        setTaxiSlots,
        teamName,
        setTeamName,
        setSearchParams,
    } = useNonSleeper(undefined, undefined, setRoster);

    return (
        <div>
            <NonSleeperInput
                nonSleeperIds={nonSleeperIds}
                setNonSleeperIds={setNonSleeperIds}
                teamName={teamName}
                setTeamName={setTeamName}
                nonSleeperRosterSettings={nonSleeperRosterSettings}
                setNonSleeperRosterSettings={setNonSleeperRosterSettings}
                ppr={ppr}
                setPpr={setPpr}
                teBonus={teBonus}
                setTeBonus={setTeBonus}
                numRosters={numRosters}
                setNumRosters={setNumRosters}
                taxiSlots={taxiSlots}
                setTaxiSlots={setTaxiSlots}
            />
        </div>
    );
}
