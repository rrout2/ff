import styles from './PositionalGrades.module.css';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {usePositionalGrades} from './usePositionalGrades';

interface PositionalGradesProps {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}

export default function PositionalGrades({
    roster,
    teamName,
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
                    pngName={`${teamName}_positional_grades.png`}
                />
            )}
            {overrideComponent}
            {graphicComponent}
        </div>
    );
}
