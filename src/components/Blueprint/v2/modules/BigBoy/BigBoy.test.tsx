import {act} from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import BigBoy from './BigBoy';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {
    BUYS,
    CORNERSTONES,
    HOLDS,
    PLUS_MAP,
    SELLS,
} from '../../../../../consts/urlParams';
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

describe('BigBoy v2', () => {
    it('can toggle preview', async () => {
        const {getByText, getByLabelText, getAllByText} = await wrappedRender(
            <BigBoy
                roster={ROSTER}
                numRosters={NUM_ROSTERS}
                teamName={TEAM_NAME}
            />
        );
        expect(getAllByText(TEAM_NAME)).toHaveLength(1);
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
            expect(risersFallersGraphic).toHaveTextContent(/J. Taylor/i);
        });
    });

    describe('Saving/Loading', () => {
        it('can save', async () => {
            const {getByText} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );
            expect(window.location.href).not.toContain(CORNERSTONES);

            const saveButton = getByText('Save');
            expect(saveButton).toBeInTheDocument();
            act(() => saveButton.click());

            expect(window.location.href).toContain(
                `${CORNERSTONES}=6770-7547-11631-11620`
            );
            expect(window.location.href).toContain(`${SELLS}=6770-7547-11631`);
            expect(window.location.href).toContain(
                `${BUYS}=10229-5849-4866-10859-11565-11638`
            );
            expect(window.location.href).toContain(`${PLUS_MAP}=F-F-F-F-F-F`);
            expect(window.location.href).toContain(`${HOLDS}=6770-7547`);
        });

        it('can update and save', async () => {
            const {getByText, getAllByLabelText} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );

            // Find the first "plus?" switch and ensure it is present in the document
            const plusSwitch = getAllByLabelText('plus?')[0];
            expect(plusSwitch).toBeInTheDocument();

            // Simulate a user clicking the "plus?" switch
            act(() => plusSwitch.click());

            // Find the "Save" button and simulate a click to save changes
            const saveButton = getByText('Save');
            act(() => saveButton.click());

            expect(window.location.href).toContain(`${PLUS_MAP}=T-F-F-F-F-F`);
        });

        it('can load from url', async () => {
            mockSearchParams();
            const {container} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );

            await waitFor(() => {
                const suggestedMovesGraphic = container.querySelector(
                    '.suggestedMovesGraphic'
                );
                expect(suggestedMovesGraphic).toHaveTextContent(
                    /Rashee Rice \(\+\)/gm
                );
            });

            await waitFor(() => {
                const rosterGraphic = container.querySelector('.rosterGraphic');
                expect(rosterGraphic).toHaveTextContent(/9th \/ 10/gm);
            });

            await waitFor(() => {
                expect(container).toHaveTextContent(/extra settings/gm);
            });
        });

        it('can clear url saved data', async () => {
            mockSearchParams();
            const {getByText} = await wrappedRender(
                <BigBoy
                    roster={ROSTER}
                    numRosters={NUM_ROSTERS}
                    teamName={TEAM_NAME}
                />
            );

            expect(window.location.href).toContain(CORNERSTONES);

            const clearButton = getByText('Clear');
            act(() => clearButton.click());

            expect(window.location.href).not.toContain(CORNERSTONES);
        });
    });
});

export function mockSearchParams(
    paramsString = 'cornerstones=6770-7547-11631-11620' +
        '&sells=6770-7547-11631&' +
        'buys=10229-5849-4866-10859-11565-11638' +
        '&plusMap=T-F-F-F-F-F' +
        '&holds=6770-7547' +
        '&holdComments=comment+1-comment+2' +
        '&risers=6770-7547-11631' +
        '&fallers=11620-8130-6813' +
        '&riserValues=30-20-10' +
        '&fallerValues=10-20-30' +
        '&posGrades=7-5-5-7-7-10' +
        '&qbRank=9th' +
        '&rbRank=4th' +
        '&wrRank=4th' +
        '&teRank=4th' +
        '&archetype=FUTURE+VALUE' +
        '&otherSettings=extra+settings' +
        '&rookieComments=comment+1-comment+2' +
        '&suggestions=suggestion+1-suggestion+2-suggestion+3-suggestion+4-suggestion+5-suggestion+6'
) {
    const {pathname} = window.location;
    const url = paramsString ? `${pathname}#/?${paramsString}` : pathname;
    window.history.pushState({}, '', url);
}
