import {useState} from 'react';
import styles from './WaiverTargets.module.css';
import {TextField} from '@mui/material';
export default function WaiverTargets() {
    const [target, setTarget] = useState<string>('');
    return (
        <>
            <InputComponent target={target} setTarget={setTarget} />
            <GraphicComponent target={target} />
        </>
    );
}

interface GraphicComponentProps {
    target: string;
}

export function GraphicComponent({target}: GraphicComponentProps) {
    return (
        <div className={styles.graphicComponent}>
            <div className={styles.targetText}>
                {target.toLocaleUpperCase()}
            </div>
        </div>
    );
}

interface InputComponentProps {
    target: string;
    setTarget: (target: string) => void;
}

export function InputComponent({target, setTarget}: InputComponentProps) {
    return (
        <TextField
            style={{margin: '4px'}}
            label={'Waiver Target'}
            value={target}
            onChange={e => {
                setTarget(e.target.value);
            }}
        />
    );
}
