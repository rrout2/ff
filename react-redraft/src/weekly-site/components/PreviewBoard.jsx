// /src/weekly-site/components/PreviewBoard.jsx
import React, { useMemo } from 'react';

// Render your weekly canvas (adjust path if your file is elsewhere)
import WeeklyBoard from '../../weekly/WeeklyBoard.jsx';

export default function PreviewBoard({
  leagueId,
  teamName,
  settings,
  rosterIds,
  playersById,
  lineup,
  ownerId,
  draftPoints = [],
  moves = [],
  overrides = {},
  setHud, // optional: WeeklyBoard can call onHud(...) to update HUD
}) {
  // Week from URL (?week=) → overrides.week → default 1
  const week = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    const w = sp.get('week');
    const o = overrides?.week;
    const n = Number(isNaN(+w) ? o : w);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [overrides?.week]);

  // Forward week in overrides (so WeeklyBoard can show WEEK N label, etc.)
  const passOverrides = useMemo(() => ({ ...overrides, week }), [overrides, week]);

  return (
    <WeeklyBoard
      leagueId={leagueId}
      teamName={teamName}
      overrides={passOverrides}

      /* pass-throughs; WeeklyBoard can use or ignore these */
      settings={settings}
      rosterIds={rosterIds}
      playersById={playersById}
      lineup={lineup}
      ownerId={ownerId}
      draftPoints={draftPoints}
      moves={moves}

      /* optional HUD bridge */
      onHud={setHud}
    />
  );
}
