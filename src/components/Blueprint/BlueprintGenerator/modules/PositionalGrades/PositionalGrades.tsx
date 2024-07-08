import styles from './PositionalGrades.module.css';
import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {usePositionalGrades} from './usePositionalGrades';

interface PositionalGradesProps {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}

export default function PositionalGrades({
    roster,
    specifiedUser,
    graphicComponentClass,
}: PositionalGradesProps) {
    const {graphicComponent, overrideComponent} = usePositionalGrades(
        roster,
        graphicComponentClass
    );

    return (
        <div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_positional_grades.png`}
                />
            )}
            {overrideComponent}
            {graphicComponent}
        </div>
    );
}
