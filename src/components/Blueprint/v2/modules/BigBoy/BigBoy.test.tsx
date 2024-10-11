import {act} from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import BigBoy from './BigBoy';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {HashRouter, Route, Routes} from 'react-router-dom';
const ROSTER = {
    players: [
        '10235',
        '11620',
        '11629',
        '11631',
        '1479',
        '2133',
        '2216',
        '2374',
        '3225',
        '4037',
        '4137',
        '421',
        '5001',
        '5248',
        '5870',
        '5947',
        '6770',
        '6813',
        '6845',
        '7547',
        '7670',
        '8130',
    ],
} as Roster;

const NUM_ROSTERS = 10;
const TEAM_NAME = 'test Team Name';

function wrappedRender(component: JSX.Element) {
    return act(() =>
        render(
            <HashRouter basename="/">
                <Routes>
                    <Route path="/" element={component} />
                </Routes>
            </HashRouter>
        )
    );
}

describe('BigBoy', () => {
    it('can toggle preview', async () => {
        const {getByText, getByLabelText, getAllByText} = await wrappedRender(
            <BigBoy
                roster={ROSTER}
                numRosters={NUM_ROSTERS}
                teamName={TEAM_NAME}
            />
        );
        expect(getByLabelText('Show Preview')).not.toBeChecked();
        act(() => getByText('Show Preview').click());

        expect(getByLabelText('Show Preview')).toBeChecked();
        expect(getAllByText(TEAM_NAME)).toHaveLength(2);
    });

    describe('Settings', () => {
        it('renders settings', async () => {
            const {container} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );
            const settingTiles = container.querySelectorAll('.settingTile');

            expect(settingTiles).toHaveLength(9);
            expect(settingTiles[0]).toHaveTextContent(`${NUM_ROSTERS}`);
        });

        it('can add other settings', async () => {
            const {getByLabelText, container} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );
            const otherSettingsInput = getByLabelText('Other Settings');
            expect(otherSettingsInput).toHaveValue('');
            fireEvent.input(otherSettingsInput, {
                target: {value: 'test settings content'},
            });
            expect(otherSettingsInput).toHaveValue('test settings content');
            expect(
                container.querySelectorAll('.otherSettings')[0]
            ).toHaveTextContent('test settings content');
        });
    });

    it('renders RosterGraphic', async () => {
        const {container} = await wrappedRender(
            <BigBoy
                roster={ROSTER}
                numRosters={NUM_ROSTERS}
                teamName={TEAM_NAME}
            />
        );
        const rosterGraphic = container.querySelector('.rosterGraphic');

        expect(rosterGraphic).toBeInTheDocument();
        expect(rosterGraphic).toHaveTextContent(/rome odunze/i);
        expect(rosterGraphic).toHaveTextContent(/joe burrow/i);
        expect(rosterGraphic).toHaveTextContent(/zack moss/i);
        expect(rosterGraphic).toHaveTextContent(/trey mcbride/i);
    });

    describe('RisersFallers', () => {
        it('renders', async () => {
            const {container} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );
            const risersFallersGraphic = container.querySelector(
                '.risersFallersGraphic'
            );

            expect(risersFallersGraphic).toBeInTheDocument();
            expect(risersFallersGraphic).toHaveTextContent(/\+30%/i);
        });

        it('can be edited', async () => {
            const {container} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );

            const inputRows = container.querySelectorAll('.inputRow');
            expect(inputRows).toHaveLength(6);

            for (let i = 0; i < 50; i++) {
                fireEvent.click(inputRows[0].querySelector('button')!);
            }
            await waitFor(() => {
                expect(
                    container.querySelector('.risersFallersGraphic')
                ).toHaveTextContent(/\+25%/i);
            });
        });
    });
});
