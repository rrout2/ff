import React, { useMemo, useState } from 'react';
import MovesToMake from './MovesToMake';

function toOption(p, id) {
  const name = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim();
  const pos  = (p.position || '').toUpperCase();
  const tm   = (p.team || '').toUpperCase();
  return { id, label: `${name} (${pos}-${tm})` };
}

export default function MovesToMakeBuilder({
  playersById,
  rosterIds = [],     // pass your rosterIds if you want a tighter list
}) {
  const options = useMemo(() => {
    const ids = (rosterIds.length ? rosterIds : Object.keys(playersById || {})).slice(0, 2000); // keep sane
    return ids
      .map(id => ({ id, p: playersById?.[id] }))
      .filter(({ p }) => p && (p.position || p.pos))
      .map(({ id, p }) => toOption(p, id))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [playersById, rosterIds]);

  const [moves, setMoves] = useState([
    { id: 'trade',  label: 'TRADE',  variant: 'teal',  primary: null, recs: [null, null] },
    { id: 'uptier', label: 'UPTIER', variant: 'gold',  primary: null, recs: [null, null] },
    { id: 'pivot',  label: 'PIVOT',  variant: 'green', primary: null, recs: [null, null] },
  ]);

  const update = (i, key, value, recIndex = null) => {
    setMoves(prev => prev.map((m, idx) => {
      if (idx !== i) return m;
      if (key === 'primary') return { ...m, primary: value };
      if (key === 'rec') {
        const recs = [...(m.recs || [])];
        recs[recIndex] = value;
        return { ...m, recs };
      }
      return m;
    }));
  };

  return (
    <div>
      {/* Simple controls */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        {moves.map((m, i) => (
          <div key={m.id} style={{ minWidth: 320 }}>
            <div style={{ fontFamily: 'Prohibition, sans-serif', marginBottom: 6 }}>
              #{i + 1} {m.label}
            </div>
            <label style={{ display: 'block', fontSize: 12, opacity: .8 }}>Primary</label>
            <select value={m.primary || ''} onChange={e => update(i, 'primary', e.target.value || null)} style={{ width: '100%' }}>
              <option value="">— choose a player —</option>
              {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>

            <label style={{ display: 'block', marginTop: 8, fontSize: 12, opacity: .8 }}>Recommendation 1</label>
            <select value={m.recs?.[0] || ''} onChange={e => update(i, 'rec', e.target.value || null, 0)} style={{ width: '100%' }}>
              <option value="">— choose a player —</option>
              {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>

            <label style={{ display: 'block', marginTop: 8, fontSize: 12, opacity: .8 }}>Recommendation 2</label>
            <select value={m.recs?.[1] || ''} onChange={e => update(i, 'rec', e.target.value || null, 1)} style={{ width: '100%' }}>
              <option value="">— choose a player —</option>
              {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <MovesToMake moves={moves} playersById={playersById} />
    </div>
  );
}
