import React, { useMemo, useState } from 'react';

export default function ManualBuilder({
  playersById,
  rosterIds,
  onAdd,
  onRemove,
  positions,
  onPositions,
  teamName,
  onTeamName,
}) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return [];
    return Object.entries(playersById || {})
      .filter(([, p]) =>
        (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`)
          .toLowerCase()
          .includes(s)
      )
      .slice(0, 40)
      .map(([id, p]) => ({
        id,
        name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`,
        pos: (Array.isArray(p.fantasy_positions)
          ? p.fantasy_positions[0]
          : p.position || ''
        ).toUpperCase(),
        team: (p.team || '').toUpperCase(),
      }));
  }, [search, playersById]);

  const posKeys = ['qb', 'rb', 'wr', 'te', 'flex', 'bench', 'superflex'];

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => onTeamName?.(e.target.value)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {posKeys.map((k) => (
          <label key={k} style={{ fontSize: 12, textTransform: 'uppercase' }}>
            {k}{' '}
            <input
              type="number"
              min={0}
              value={positions?.[k] ?? 0}
              onChange={(e) =>
                onPositions?.({ [k]: Number(e.target.value) })
              }
            />
          </label>
        ))}
      </div>

      <input
        placeholder="Search player…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {options.length > 0 && (
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #eee',
            maxHeight: 160,
            overflow: 'auto',
          }}
        >
          {options.map((o) => (
            <div
              key={o.id}
              style={{ padding: '6px 8px', cursor: 'pointer' }}
              onClick={() => onAdd?.(o.id)}
              title={`${o.name} — ${o.pos} ${o.team}`}
            >
              {o.name} — {o.pos} {o.team}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
        Roster ({rosterIds?.length || 0})
      </div>
      <div
        style={{
          border: '1px solid #eee',
          maxHeight: 200,
          overflow: 'auto',
        }}
      >
        {(rosterIds || []).map((id) => {
          const p = playersById?.[id] || {};
          const nm =
            p.full_name ||
            `${p.first_name || ''} ${p.last_name || ''}`.trim();
          const pos = (
            Array.isArray(p.fantasy_positions)
              ? p.fantasy_positions[0]
              : p.position || ''
          ).toUpperCase();
          const team = (p.team || '').toUpperCase();
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
              }}
              title={`${nm} — ${pos} ${team}`}
            >
              <span>
                {nm} — {pos} {team}
              </span>
              <button onClick={() => onRemove?.(id)}>remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
