import React, {useState} from 'react';
import styles from './ThreeYearOutlook.module.css';
import {Stage, Layer, Shape, Text, Arrow, Line} from 'react-konva';
import StyledNumberInput from '../../../shared/StyledNumberInput';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import ExportButton from '../../../shared/ExportButton';

export enum OutlookType {
    RELOAD = 'RELOAD',
    CONTEND = 'CONTEND',
    REBUILD = 'REBUILD',
}
export type Outlook = OutlookType[];
const ALL_OUTLOOKS = Object.values(OutlookType);
export const useThreeYearOutlook = () => {
    const [values, setValues] = useState([
        50, 60, 65, 90, 80, 85, 85, 50, 25, 30,
    ]);
    const [outlook, setOutlook] = useState<Outlook>([
        OutlookType.RELOAD,
        OutlookType.CONTEND,
        OutlookType.REBUILD,
    ]);
    return {
        values,
        setValues,
        outlook,
        setOutlook,
    };
};

export default function ThreeYearOutlook({teamName}: {teamName?: string}) {
    const {values, setValues, outlook, setOutlook} = useThreeYearOutlook();
    return (
        <div>
            <ExportButton
                pngName={`${teamName}_three_year_outlook.png`}
                className={'threeYearOutlookPng'}
            />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <InputComponent
                    values={values}
                    setValues={setValues}
                    outlook={outlook}
                    setOutlook={setOutlook}
                />
            </div>
            <GraphicComponent
                values={values}
                outlook={outlook}
                graphicClassName="threeYearOutlookPng"
            />
        </div>
    );
}

export function InputComponent({
    values,
    setValues,
    outlook,
    setOutlook,
}: {
    values: number[];
    setValues: (values: number[]) => void;
    outlook: Outlook;
    setOutlook: (outlook: Outlook) => void;
}) {
    return (
        <>
            <div className={styles.outlookInputColumn}>
                {values.map((value, idx) => (
                    <StyledNumberInput
                        key={idx}
                        value={value}
                        onChange={(_, newValue) => {
                            setValues(
                                values.map((currValue, i) =>
                                    i === idx ? newValue ?? 0 : currValue
                                )
                            );
                        }}
                        min={0}
                        max={100}
                        label={'Value ' + (idx + 1)}
                    />
                ))}
            </div>
            <div className={styles.outlookInputColumn}>
                {outlook.map((_, idx) => {
                    return (
                        <FormControl>
                            <InputLabel>Year {idx + 1}</InputLabel>
                            <Select
                                key={idx}
                                value={outlook[idx]}
                                onChange={e => {
                                    const newOutlook = outlook.slice();
                                    newOutlook[idx] = e.target
                                        .value as OutlookType;
                                    setOutlook(newOutlook);
                                }}
                                label={'Year ' + (idx + 1)}
                            >
                                {ALL_OUTLOOKS.map((outlookType, idx) => (
                                    <MenuItem value={outlookType} key={idx}>
                                        {outlookType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                })}
            </div>
        </>
    );
}

type GraphicComponentProps = {
    values: number[];
    outlook: Outlook;
    graphicClassName?: string;
};

export function GraphicComponent({
    graphicClassName,
    outlook,
    values,
}: GraphicComponentProps) {
    const width = 600;
    const height = 400;

    function outlookTypeToColor(outlook: OutlookType) {
        switch (outlook) {
            case OutlookType.RELOAD:
                return '#F58020';
            case OutlookType.CONTEND:
                return '#D7DF21';
            case OutlookType.REBUILD:
                return 'red';
        }
    }

    const GraphLine = ({
        startIdx,
        endIdx,
        outlook,
    }: {
        startIdx: number;
        endIdx: number;
        outlook: OutlookType;
    }) => (
        <Arrow
            points={values
                .slice(startIdx, endIdx + 1)
                .map((val, idx) => {
                    return [
                        ((startIdx + idx) * width) / 9,
                        height - val * (height / 100),
                    ];
                })
                .flat()}
            fill={outlookTypeToColor(outlook)}
            stroke={outlookTypeToColor(outlook)}
            strokeWidth={12}
            lineCap={'round'}
            pointerWidth={endIdx < values.length - 1 ? 0 : 10}
            pointerLength={endIdx < values.length - 1 ? 0 : 10}
        />
    );
    const TextLabel = ({idx, outlook}: {idx: number; outlook: OutlookType}) => (
        <Text
            x={(idx * width) / 3}
            y={(3 * height) / 4}
            width={200}
            height={50}
            fontSize={28}
            fontFamily="Erbaum Bold"
            fill={outlookTypeToColor(outlook)}
            align="center"
            verticalAlign="middle"
            text={outlook}
        />
    );
    return (
        <Stage
            width={width + 20}
            height={height}
            className={`${styles.graphicComponent} ${graphicClassName ?? ''}`}
        >
            <Layer>
                <Line
                    points={[width / 3, height, width / 3, 0]}
                    stroke={'gray'}
                    dash={[10, 10]}
                />
                <Line
                    points={[(2 * width) / 3, height, (2 * width) / 3, 0]}
                    stroke={'gray'}
                    dash={[10, 10]}
                />
                <Shape
                    sceneFunc={(context, shape) => {
                        context.beginPath();
                        context.moveTo(0, height);
                        values.forEach((value, idx) => {
                            context.lineTo(
                                (idx * width) / 9,
                                height - value * (height / 100)
                            );
                        });
                        context.lineTo(width, height);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }}
                    fill={'gray'}
                    opacity={0.5}
                />
                {outlook.map((outlookType, idx) => (
                    <GraphLine
                        key={idx}
                        startIdx={idx * 3}
                        endIdx={(idx + 1) * 3}
                        outlook={outlookType}
                    />
                ))}
                {outlook.map((outlookType, idx) => (
                    <TextLabel key={idx} outlook={outlookType} idx={idx} />
                ))}
            </Layer>
        </Stage>
    );
}
