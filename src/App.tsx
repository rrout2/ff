import './App.css';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    function leagueButton() {
        return (
            <Button
                onClick={() => {
                    navigate('league');
                }}
            >
                League
            </Button>
        );
    }
    return <div className="App">{leagueButton()}</div>;
}

export default App;
