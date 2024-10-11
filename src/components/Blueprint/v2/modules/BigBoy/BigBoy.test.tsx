import {act} from 'react';
import {render} from '@testing-library/react';
import BigBoy from './BigBoy';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {HashRouter, Route, Routes} from 'react-router-dom';
const ROSTER = {
    players: ['10229', '5849', '4866', '10859'],
} as Roster;

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
            <BigBoy roster={ROSTER} numRosters={10} teamName="test Team Name" />
        );
        expect(getByLabelText('Show Preview')).not.toBeChecked();
        act(() => getByText('Show Preview').click());

        expect(getByLabelText('Show Preview')).toBeChecked();
        expect(getAllByText('test Team Namea')).toHaveLength(2);
    });
});
