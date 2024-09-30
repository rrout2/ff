import React, {useEffect, useState} from 'react';
import styles from './PositionalGrades.module.css';
import {Layer, RegularPolygon, Shape, Stage, Text} from 'react-konva';
import StyledNumberInput from '../../../shared/StyledNumberInput';
import ExportButton from '../../../shared/ExportButton';
import {COLORS} from '../../../../../consts/colors';

export function usePositionalGrades() {
    const [overall, setOverall] = useState(7);
    const [qb, setQb] = useState(7);
    const [rb, setRb] = useState(7);
    const [wr, setWr] = useState(7);
    const [te, setTe] = useState(7);
    const [depth, setDepth] = useState(7);
    useEffect(() => {
        // Needed to force re-render to center grade values.
        setOverall(8);
        setQb(8);
        setRb(8);
        setWr(8);
        setTe(8);
        setDepth(8);
    }, []);
    return {
        overall,
        setOverall,
        qb,
        setQb,
        rb,
        setRb,
        wr,
        setWr,
        te,
        setTe,
        depth,
        setDepth,
    };
}

const CENTER = [300, 300];
export default function PositionalGrades({teamName}: {teamName?: string}) {
    const {
        overall,
        setOverall,
        qb,
        setQb,
        rb,
        setRb,
        wr,
        setWr,
        te,
        setTe,
        depth,
        setDepth,
    } = usePositionalGrades();
    return (
        <>
            <ExportButton
                className={styles.graphicComponent}
                pngName={`${teamName}_positional_grades.png`}
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <InputComponent
                    overall={overall}
                    setOverall={setOverall}
                    qb={qb}
                    setQb={setQb}
                    rb={rb}
                    setRb={setRb}
                    wr={wr}
                    setWr={setWr}
                    te={te}
                    setTe={setTe}
                    depth={depth}
                    setDepth={setDepth}
                />
            </div>
            <GraphicComponent
                overall={overall}
                qb={qb}
                rb={rb}
                wr={wr}
                te={te}
                depth={depth}
            />
        </>
    );
}

interface InputComponentProps {
    overall: number;
    setOverall: (value: number) => void;
    qb: number;
    setQb: (value: number) => void;
    rb: number;
    setRb: (value: number) => void;
    wr: number;
    setWr: (value: number) => void;
    te: number;
    setTe: (value: number) => void;
    depth: number;
    setDepth: (value: number) => void;
}

export function InputComponent({
    overall,
    setOverall,
    qb,
    setQb,
    rb,
    setRb,
    wr,
    setWr,
    te,
    setTe,
    depth,
    setDepth,
}: InputComponentProps) {
    return (
        <>
            <StyledNumberInput
                value={overall}
                onChange={(_, value) => setOverall(value || 0)}
                label="Overall"
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={qb}
                onChange={(_, value) => setQb(value || 0)}
                label="QB"
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={rb}
                onChange={(_, value) => setRb(value || 0)}
                label="RB"
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={wr}
                onChange={(_, value) => setWr(value || 0)}
                label="WR"
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={te}
                onChange={(_, value) => setTe(value || 0)}
                label="TE"
                min={0}
                max={10}
            />
            <StyledNumberInput
                value={depth}
                onChange={(_, value) => setDepth(value || 0)}
                label="Depth"
                min={0}
                max={10}
            />
        </>
    );
}

type GraphicComponentProps = {
    overall: number;
    qb: number;
    rb: number;
    wr: number;
    te: number;
    depth: number;
    graphicClassName?: string;
};
export function GraphicComponent({
    overall,
    qb,
    rb,
    wr,
    te,
    depth,
    graphicClassName,
}: GraphicComponentProps) {
    const hexRadius = 250;
    const coordinates: {
        x: number;
        y: number;
        grade: number;
        position: string;
    }[] = [
        {
            x: CENTER[0],
            y: CENTER[1] - hexRadius * (overall / 10),
            grade: overall,
            position: 'overall',
        },
        {
            x: CENTER[0] + hexRadius * Math.cos(Math.PI / 6) * (qb / 10),
            y: CENTER[1] - hexRadius * Math.sin(Math.PI / 6) * (qb / 10),
            grade: qb,
            position: 'QB',
        },
        {
            x: CENTER[0] + hexRadius * Math.cos(Math.PI / 6) * (rb / 10),
            y: CENTER[1] + hexRadius * Math.sin(Math.PI / 6) * (rb / 10),
            grade: rb,
            position: 'RB',
        },
        {
            x: CENTER[0],
            y: CENTER[1] + hexRadius * (wr / 10),
            grade: wr,
            position: 'WR',
        },
        {
            x: CENTER[0] - hexRadius * Math.cos(Math.PI / 6) * (te / 10),
            y: CENTER[1] + hexRadius * Math.sin(Math.PI / 6) * (te / 10),
            grade: te,
            position: 'TE',
        },
        {
            x: CENTER[0] - hexRadius * Math.cos(Math.PI / 6) * (depth / 10),
            y: CENTER[1] - hexRadius * Math.sin(Math.PI / 6) * (depth / 10),
            grade: depth,
            position: 'depth',
        },
    ];
    return (
        <Stage
            width={600}
            height={600}
            className={`${styles.graphicComponent} ${graphicClassName ?? ''}`}
        >
            <Layer>
                <BackgroundHexagon radius={500} />
                <BackgroundHexagon radius={400} />
                <BackgroundHexagon radius={300} />
                <BackgroundHexagon radius={200} />
                <BackgroundHexagon radius={100} />
                <GradeShape coordinates={coordinates} />
                <GradeCircles coordinates={coordinates} />
                <GradeLabels coordinates={coordinates} />
            </Layer>
        </Stage>
    );
}

interface GradeShapeProps {
    coordinates: {
        x: number;
        y: number;
        grade: number;
        position: string;
    }[];
}

const GradeShape = ({coordinates}: GradeShapeProps) => {
    return (
        <Shape
            sceneFunc={(context, shape) => {
                context.beginPath();
                coordinates.forEach(({x, y}) => {
                    context.lineTo(x, y);
                });
                context.closePath();
                context.fillStrokeShape(shape);
            }}
            stroke={'white'}
            strokeWidth={3}
            fill={'#0D2544'}
            opacity={0.7}
        />
    );
};

const GradeCircles = ({coordinates}: GradeShapeProps) => {
    return (
        <>
            {coordinates.map(({x, y, position}) => (
                <Shape
                    key={position}
                    sceneFunc={(context, shape) => {
                        context.beginPath();
                        context.arc(x, y, 20, 0, 2 * Math.PI);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }}
                    stroke={'#023049'}
                    fill={COLORS.get(position)!}
                />
            ))}
        </>
    );
};

const GradeLabels = ({coordinates}: GradeShapeProps) => {
    return (
        <>
            {coordinates.map(({x, y, grade, position}) => {
                return (
                    <Text
                        key={position}
                        x={x - 25}
                        y={y - 23}
                        width={50}
                        height={50}
                        fontSize={20}
                        fontFamily="Erbaum"
                        fill={'#023049'}
                        align="center"
                        verticalAlign="middle"
                        text={grade.toString()}
                    />
                );
            })}
        </>
    );
};

const BackgroundHexagon = ({radius}: {radius: number}) => {
    return (
        <RegularPolygon
            x={CENTER[0]}
            y={CENTER[1]}
            sides={6}
            radius={radius}
            width={radius}
            height={radius}
            stroke={'gray'}
            strokeWidth={3}
        />
    );
};
