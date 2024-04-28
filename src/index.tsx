import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LeaguePage from './pages/League/League';
import reportWebVitals from './reportWebVitals';
import {HashRouter, Routes, Route} from 'react-router-dom';
import TeamPage from './pages/Team/TeamPage/TeamPage';
import {QueryClient, QueryClientProvider} from 'react-query';
import PlayerPage from './pages/Player/PlayerPage/PlayerPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <HashRouter basename="/">
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/league" element={<LeaguePage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/player" element={<PlayerPage />} />
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
