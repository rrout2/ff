import {TextField} from '@mui/material';
import styles from './PlayerSearch.module.css';
import {useState} from 'react';
export default function PlayerSearch() {
    const [searchInput, setSeachInput] = useState('');

    function searchResults() {
        return <>{searchInput}</>;
    }

    return (
        <div className={styles.playerSearch}>
            <TextField
                onChange={e => {
                    setSeachInput(e.target.value);
                }}
                className={styles.input}
            ></TextField>
            {searchResults()}
        </div>
    );
}
