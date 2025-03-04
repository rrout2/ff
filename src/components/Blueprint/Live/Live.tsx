import React, {useEffect, useState} from 'react';
import styles from './Live.module.css';
import {
    blankLive,
    dualEliteQb,
    eliteQbTe,
    eliteValue,
    futureValue,
    hardRebuild,
    oneYearReload,
    rbHeavy,
    wellRounded,
    wrFactory,
} from '../../../consts/images';
import {Archetype, ArchetypeDetails} from '../v1/modules/BigBoy/BigBoy';
import {
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
} from '@mui/material';
import StyledNumberInput from '../shared/StyledNumberInput';

const ARCHETYPE_TO_IMAGE: Map<Archetype, string> = new Map([
    [Archetype.DualEliteQB, dualEliteQb],
    [Archetype.EliteQBTE, eliteQbTe],
    [Archetype.EliteValue, eliteValue],
    [Archetype.FutureValue, futureValue],
    [Archetype.HardRebuild, hardRebuild],
    [Archetype.OneYearReload, oneYearReload],
    [Archetype.RBHeavy, rbHeavy],
    [Archetype.WellRounded, wellRounded],
    [Archetype.WRFactory, wrFactory],
]);

export default function Live() {
    const [archetype, setArchetype] = useState<Archetype>(
        Archetype.DualEliteQB
    );
    const [qbGrade, setQbGrade] = useState(7);
    const [rbGrade, setRbGrade] = useState(7);
    const [wrGrade, setWrGrade] = useState(7);
    const [teGrade, setTeGrade] = useState(7);
    const [outlooks, setOutlooks] = useState<string[]>([]);
    useEffect(() => {
        setOutlooks(ArchetypeDetails[archetype][0]);
    }, [archetype]);
    return (
        <div className={styles.container}>
            <LiveInputs
                archetype={archetype}
                setArchetype={setArchetype}
                qbGrade={qbGrade}
                setQbGrade={setQbGrade}
                rbGrade={rbGrade}
                setRbGrade={setRbGrade}
                wrGrade={wrGrade}
                setWrGrade={setWrGrade}
                teGrade={teGrade}
                setTeGrade={setTeGrade}
                outlooks={outlooks}
                setOutlooks={setOutlooks}
            />
            <div className={styles.liveBlueprint}>
                <PositionalGrade
                    position={'QB'}
                    grade={qbGrade}
                    className={styles.qb}
                />
                <PositionalGrade
                    position={'RB'}
                    grade={rbGrade}
                    className={styles.rb}
                />
                <PositionalGrade
                    position={'WR'}
                    grade={wrGrade}
                    className={styles.wr}
                />
                <PositionalGrade
                    position={'TE'}
                    grade={teGrade}
                    className={styles.te}
                />
                {outlooks.map((outlook, idx) => (
                    <Outlook
                        key={idx}
                        outlook={outlook}
                        className={styles[`year${idx + 1}`]}
                    />
                ))}
                <img
                    src={ARCHETYPE_TO_IMAGE.get(archetype)}
                    className={styles.archetype}
                />
                <img src={blankLive} />
            </div>
        </div>
    );
}

type LiveInputsProps = {
    archetype: Archetype;
    setArchetype: (archetype: Archetype) => void;
    qbGrade: number;
    setQbGrade: (qbGrade: number) => void;
    rbGrade: number;
    setRbGrade: (rbGrade: number) => void;
    wrGrade: number;
    setWrGrade: (wrGrade: number) => void;
    teGrade: number;
    setTeGrade: (teGrade: number) => void;
    outlooks: string[];
    setOutlooks: (outlooks: string[]) => void;
};

function LiveInputs({
    archetype,
    setArchetype,
    qbGrade,
    setQbGrade,
    rbGrade,
    setRbGrade,
    wrGrade,
    setWrGrade,
    teGrade,
    setTeGrade,
    outlooks,
    setOutlooks,
}: LiveInputsProps) {
    return (
        <div className={styles.inputs}>
            <FormControl>
                <InputLabel>Archetype</InputLabel>
                <Select
                    value={archetype}
                    label="Archetype"
                    onChange={(event: SelectChangeEvent) => {
                        setArchetype(event.target.value as Archetype);
                    }}
                >
                    {Object.values(Archetype).map((arch, idx) => (
                        <MenuItem value={arch} key={idx}>
                            {arch}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <StyledNumberInput
                value={qbGrade}
                key="qb"
                onChange={(_, value) => setQbGrade(value || 0)}
                label="QB"
                step={1}
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={rbGrade}
                key="rb"
                onChange={(_, value) => setRbGrade(value || 0)}
                label="RB"
                step={1}
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={wrGrade}
                key="wr"
                onChange={(_, value) => setWrGrade(value || 0)}
                label="WR"
                step={1}
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={teGrade}
                key="te"
                onChange={(_, value) => setTeGrade(value || 0)}
                label="TE"
                step={1}
                min={0}
                max={10}
            />
            {outlooks.map((_, idx) => (
                <FormControl key={idx}>
                    <InputLabel>Year {idx + 1}</InputLabel>
                    <Select
                        label={`Year ${idx + 1}`}
                        value={outlooks[idx]}
                        onChange={(event: SelectChangeEvent) => {
                            const newOutlooks = outlooks.slice();
                            newOutlooks[idx] = event.target.value;
                            setOutlooks(newOutlooks);
                        }}
                    >
                        <MenuItem value={'CONTEND'} key={'CONTEND'}>
                            {'CONTEND'}
                        </MenuItem>
                        <MenuItem value={'REBUILD'} key={'REBUILD'}>
                            {'REBUILD'}
                        </MenuItem>

                        <MenuItem value={'RELOAD'} key={'RELOAD'}>
                            {'RELOAD'}
                        </MenuItem>
                    </Select>
                </FormControl>
            ))}
        </div>
    );
}

type PositionalGradeProps = {
    position: string;
    grade: number;
    className?: string;
};

function PositionalGrade({position, grade, className}: PositionalGradeProps) {
    return (
        <div className={`${styles.positionalGrade} ${className || ''}`}>
            <div>{position}</div>
            <div>{grade}/10</div>
        </div>
    );
}

type OutlookProps = {
    outlook: string;
    className?: string;
};

function Outlook({outlook, className}: OutlookProps) {
    return (
        <div className={`${styles.outlook} ${className || ''}`}>{outlook}</div>
    );
}
