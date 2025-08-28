// /src/whiteboard-site/components/TweaksPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function TweaksPanel({
  overrides,
  onOverrides,
  onExport,
  hud,
  exportLabel = 'Download PNG',
  playersById = {},       // map of all players
  rosterIds = [],         // ids for the current roster (starters + bench)
}) {
  const o = overrides || {};

  /* -------------------- deep get/set (with moves normalization) -------------------- */
  const normalizeMovesContainer = (obj) => {
    const next = obj || {};
    const m = next.moves;
    if (Array.isArray(m)) {
      next.moves = {
        trade:  typeof m[0] === 'string' ? { primary: m[0] } : (m[0] || {}),
        uptier: typeof m[1] === 'string' ? { primary: m[1] } : (m[1] || {}),
        pivot:  typeof m[2] === 'string' ? { primary: m[2] } : (m[2] || {}),
      };
    } else if (!m || typeof m !== 'object') {
      next.moves = {};
    }
    return next;
  };

  const set = (path, val) => {
    onOverrides((prev) => {
      let next = normalizeMovesContainer(JSON.parse(JSON.stringify(prev || {})));
      const keys = path.split('.');
      let cur = next;

      if (path.startsWith('moves.')) {
        next = normalizeMovesContainer(next);
        cur = next;
      }

      keys.forEach((k, i) => {
        const last = i === keys.length - 1;
        if (last) {
          if (val === undefined) {
            try { delete cur[k]; } catch { cur[k] = undefined; }
          } else {
            cur[k] = val;
          }
        } else {
          if (typeof cur[k] === 'string') cur[k] = {};
          if (!cur[k] || typeof cur[k] !== 'object') {
            cur[k] = Number.isInteger(+keys[i + 1]) ? [] : {};
          }
          cur = cur[k];
        }
      });

      return next;
    });
  };

  const get = (path, fallback = '') => {
    try { return path.split('.').reduce((a, k) => (a && k in a ? a[k] : undefined), o) ?? fallback; }
    catch { return fallback; }
  };

  /* -------------------- TEAM CODE CANONICALIZATION (WAS/WASH -> WSH) -------------------- */
  const TEAM_ALIASES = { WAS: 'WSH', WASH: 'WSH' };
  const canonicalTeam = (t) => {
    const key = (t || '').toUpperCase();
    return TEAM_ALIASES[key] || key;
  };
  // For strings like "Player Name WR WAS" that may already be saved
  const normalizeCommitStringTeam = (s) => {
    if (!s) return s;
    const parts = String(s).trim().split(/\s+/);
    if (parts.length >= 3) {
      const last = parts[parts.length - 1];
      parts[parts.length - 1] = canonicalTeam(last);
      return parts.join(' ');
    }
    return s;
  };

  /* --------------------------------- small inputs --------------------------------- */
  function TextInput({ value, placeholder, onCommit, maxLength, counterFrom }) {
    const [local, setLocal] = useState(value ?? '');
    useEffect(() => { setLocal(value ?? ''); }, [value]);
    const commit = () => onCommit(local.trim() === '' ? undefined : local.trim());
    const onKeyDown = (e) => { if (e.key === 'Enter') commit(); };

    const left = typeof counterFrom === 'number'
      ? Math.max(0, counterFrom - (local?.length ?? 0))
      : null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: left !== null ? '1fr auto' : '1fr', gap: 8, alignItems: 'center' }}>
        <input
          value={local}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
        />
        {left !== null && <span style={{ fontSize: 12, opacity: .7, whiteSpace: 'nowrap' }}>{left} left</span>}
      </div>
    );
  }

  function TextArea({ value, placeholder, onCommit, maxLength, rows = 2 }) {
    const [local, setLocal] = useState(value ?? '');
    useEffect(() => { setLocal(value ?? ''); }, [value]);
    const commit = () => onCommit(local.trim() === '' ? undefined : local.trim());
    const onKeyDown = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit(); };
    return (
      <textarea
        value={local}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        style={{ resize: 'vertical' }}
      />
    );
  }

  const ClearBtn = ({ onClick }) => <button onClick={onClick} className="wb-danger" type="button">Clear</button>;

  const numInput = (val, setPath, { min = 0, max = 10, step = 1 } = {}) => (
    <input
      type="number"
      value={val ?? ''}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') set(setPath, undefined);
        else set(setPath, Number(raw));
      }}
    />
  );

  /* ============================= Player Autocomplete ============================== */
  // Filter to fantasy-relevant offense positions; keep Travis Hunter explicitly
  const INCLUDE_POS = new Set(['QB', 'RB', 'WR', 'TE']);
  const ALWAYS_KEEP = new Set(['TRAVIS HUNTER']); // plays both ways

  const allPlayerOptions = useMemo(() => {
    const arr = [];
    for (const [id, p] of Object.entries(playersById || {})) {
      const name = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).trim();
      if (!name) continue;
      const pos = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
      const teamRaw = (p.team || p.pro_team || p.team_abbr || '');
      const team = canonicalTeam(teamRaw);

      const keep = INCLUDE_POS.has(pos) || ALWAYS_KEEP.has(name.toUpperCase());
      if (!keep) continue;

      const label = team && pos ? `${name} — ${pos} • ${team}` : name;
      const search = `${name} ${pos} ${team}`.toLowerCase();
      const adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);

      arr.push({
        id, name, label, search, pos, team,
        adp: isFinite(adp) ? adp : 9999,
      });
    }
    arr.sort((a, b) => a.adp - b.adp || a.name.localeCompare(b.name));
    return arr;
  }, [playersById]);

  /* ---------- Build roster dropdown options from the current rosterIds ---------- */
  const rosterOptions = useMemo(() => {
    const opts = [];
    for (const id of rosterIds || []) {
      const p = playersById?.[id];
      if (!p) continue;
      const name = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).trim();
      const pos  = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
      const teamRaw = (p.team || p.pro_team || p.team_abbr || '');
      const team = canonicalTeam(teamRaw);
      const keep = INCLUDE_POS.has(pos) || ALWAYS_KEEP.has(name.toUpperCase());
      if (!keep) continue;

      const commitStr = [name, pos, team].filter(Boolean).join(' ');
      const label     = team && pos ? `${name} — ${pos} • ${team}` : name;
      if (!opts.some(o => o.value === commitStr)) {
        opts.push({ value: commitStr, label, name, pos, team });
      }
    }
    opts.sort((a, b) => a.label.localeCompare(b.label));
    return opts;
  }, [rosterIds, playersById]);

  /* ============================= Strength/Weakness options ============================= */
  const STRENGTH_OPTIONS = [
    'Best WR Room In The League',
    'Best RB Room In The League',
    'Best TE Room In The League',
    'Best QB Room In The League',
    'Strong WR Room',
    'Strong RB Room',
    'High Upside',
    'Low Risk',
    'Strong TE Room',
    'Strong QB Room',
    'Strong Reliability',
    'Strong Depth',
    'Value Necessary To Pivot',
    'Has Tools to Make a Playoff Push',
  ];

  const WEAKNESS_OPTIONS = [
    'Weak WR Room',
    'Weak RB Room',
    'Low Upside',
    'High Risk',
    'Weak TE Room',
    'Weak QB Room',
    'Weak Reliability',
    'Weak Depth',
    'Changes are Necessary to Compete',
  ];

  /* ============================= Roster Tag options (deduped) ============================= */
  const ROSTER_TAG_OPTIONS = [
    'The Juggernaut',
    'Riskit For Biskit',
    'Safe And Sound',
    'Balanced Approach',
    'Wi Tu Lo',
    'Mariana Trench',
    'Star Studded',
  ];

  /* ============================= Player Autocomplete (for recs) ============================== */
  function PlayerAutocomplete({ value, placeholder, onCommit, maxResults = 14 }) {
    const [input, setInput] = useState(value ?? '');
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(-1);

    useEffect(() => { setInput(value ?? ''); }, [value]);

    const q = (input || '').toLowerCase().trim();
    const suggestions = useMemo(() => {
      if (!allPlayerOptions.length) return [];
      if (!q) return allPlayerOptions.slice(0, maxResults);
      const starts = []; const contains = [];
      for (const opt of allPlayerOptions) {
        if (opt.search.startsWith(q)) starts.push(opt);
        else if (opt.search.includes(q)) contains.push(opt);
        if (starts.length >= maxResults) break;
      }
      return [...starts, ...contains].slice(0, maxResults);
    }, [q, allPlayerOptions, maxResults]);

    const commit = (val) => onCommit(val && val.trim() ? val.trim() : undefined);

    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) setOpen(true);
        else setHover((h) => Math.min((h < 0 ? -1 : h) + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (open) setHover((h) => Math.max(h - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (open && hover >= 0 && suggestions[hover]) {
          const chosen = suggestions[hover];
          setInput(chosen.name);
          setOpen(false);
          setHover(-1);
          commit([chosen.name, chosen.pos, chosen.team].filter(Boolean).join(' '));
        } else {
          setOpen(false);
          const exact = allPlayerOptions.find(opt => opt.name.toLowerCase() === (input||'').toLowerCase().trim());
          if (exact) commit([exact.name, exact.pos, exact.team].filter(Boolean).join(' '));
          else commit(input);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        <input
          value={input}
          placeholder={placeholder}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            const exact = allPlayerOptions.find(opt => opt.name.toLowerCase() === (input||'').toLowerCase().trim());
            if (exact) commit([exact.name, exact.pos, exact.team].filter(Boolean).join(' '));
            else commit(input);
          }}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          style={{ width: '100%' }}
        />
        {open && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute', zIndex: 9999, top: '100%', left: 0, right: 0,
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              boxShadow: '0 6px 20px rgba(0,0,0,.12)', marginTop: 4, maxHeight: 260, overflow: 'auto'
            }}
          >
            {suggestions.map((opt, idx) => (
              <div
                key={opt.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setInput(opt.name);
                  setOpen(false);
                  setHover(-1);
                  commit([opt.name, opt.pos, opt.team].filter(Boolean).join(' '));
                }}
                onMouseEnter={() => setHover(idx)}
                onMouseLeave={() => setHover(-1)}
                style={{
                  padding: '8px 10px', cursor: 'pointer',
                  background: hover === idx ? '#f3f4f6' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 14
                }}
              >
                <span style={{ opacity: .55, minWidth: 42, fontSize: 12 }}>
                  {opt.pos}{opt.team ? ` • ${opt.team}` : ''}
                </span>
                <span>{opt.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ========================= Label combo (datalist; also free-typing) ========================= */
  function LabelCombo({ value, onCommit, options, listId, placeholder = 'Select or type…', maxLength = 40 }) {
    const [local, setLocal] = useState(value ?? '');
    useEffect(() => { setLocal(value ?? ''); }, [value]);
    const commit = () => onCommit(local.trim() === '' ? undefined : local.trim());
    const onKeyDown = (e) => { if (e.key === 'Enter') commit(); };

    return (
      <div>
        <input
          list={listId}
          value={local}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e)=>setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          style={{ width:'100%' }}
        />
        <datalist id={listId}>
          {options.map(opt => <option key={opt} value={opt} />)}
        </datalist>
      </div>
    );
  }

  /* ====================== Moves editor (Primary = roster dropdown) ====================== */
  const LABEL_OPTIONS = ['TRADE', 'UPTIER', 'PIVOT'];

  const MoveCardEditor = ({ moveId, title }) => {
    const base = `moves.${moveId}`;
    const label   = get(`${base}.label`, '');
    const primary = get(`${base}.primary`, '');
    const rec0    = get(`${base}.recs.0`, '');
    const rec1    = get(`${base}.recs.1`, '');
    const note    = get(`${base}.note`, '');

    const setRec = (idx, val) => {
      const a = [get(`${base}.recs.0`, undefined), get(`${base}.recs.1`, undefined)];
      a[idx] = val;
      const clean = a.filter((x, i, ar) => x !== undefined || i < ar.length - 1);
      set(`${base}.recs`, clean.length ? clean : undefined);
    };

    const defaultLabel = moveId === 'trade' ? 'TRADE' : moveId === 'uptier' ? 'UPTIER' : 'PIVOT';

    const primaryField = () => {
      if (rosterOptions.length > 0) {
        // Normalize saved value (e.g., "... WAS" -> "... WSH") so the select shows correctly
        const normalizedPrimary = normalizeCommitStringTeam(primary || '');
        const valueIsOption = rosterOptions.some(o => o.value === normalizedPrimary);
        const selected = valueIsOption ? normalizedPrimary : '';
        return (
          <select
            value={selected}
            onChange={(e) => set(`${base}.primary`, e.target.value || undefined)}
          >
            <option value="">— Select player from your roster —</option>
            {rosterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      }
      return (
        <PlayerAutocomplete
          value={primary}
          placeholder="start typing a player…"
          onCommit={(v) => set(`${base}.primary`, v)}
          maxResults={14}
        />
      );
    };

    const playerField = (value, onCommit) => {
      const hasPlayers = playersById && Object.keys(playersById).length > 0;
      return hasPlayers ? (
        <PlayerAutocomplete value={value} placeholder="start typing a player…" onCommit={onCommit} maxResults={14} />
      ) : (
        <TextInput value={value} placeholder="type player name…" onCommit={onCommit} maxLength={64} />
      );
    };

    return (
      <div className="wb-card" style={{ padding: 12, overflow: 'visible' }}>
        <div className="wb-card__title" style={{ marginBottom: 8 }}>{title}</div>

        {/* Column Label = dropdown (TRADE / UPTIER / PIVOT) */}
        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Column Label</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <select
              value={(label || defaultLabel).toUpperCase()}
              onChange={(e) => set(`${base}.label`, e.target.value.toUpperCase())}
            >
              {LABEL_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ClearBtn onClick={() => set(`${base}.label`, undefined)} />
          </div>
        </div>

        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Primary (pick from your roster)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            {primaryField()}
            <ClearBtn onClick={() => set(`${base}.primary`, undefined)} />
          </div>
        </div>

        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Recommendation A (choose player)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            {playerField(rec0, (v) => setRec(0, v))}
            <ClearBtn onClick={() => setRec(0, undefined)} />
          </div>
        </div>

        <div className="wb-row">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Recommendation B (choose player)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            {playerField(rec1, (v) => setRec(1, v))}
            <ClearBtn onClick={() => setRec(1, undefined)} />
          </div>
        </div>

        <div className="wb-row" style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Option / Note</div>
          <TextArea
            value={note}
            placeholder="e.g., Package WR2 + RB4 for elite TE; or flip TE for WR upgrade"
            onCommit={(v) => set(`${base}.note`, v)}
            rows={3}
            maxLength={200}
          />
        </div>
      </div>
    );
  };

  /* ============================ Badges (dropdown + free-typing) ============================ */
  const SWRow = ({ index }) => {
    const base  = `rosterStrengths.items.${index}`;
    const color = get(`${base}.color`, '');
    const label = get(`${base}.label`, '');

    // Suggest based on color selection; Auto shows both lists.
    const listId = `sw-opts-${index}`;
    const options = color === 'green'
      ? STRENGTH_OPTIONS
      : color === 'red'
        ? WEAKNESS_OPTIONS
        : [...STRENGTH_OPTIONS, ...WEAKNESS_OPTIONS];

    return (
      <div className="wb-row sw-row" style={{ display:'grid', gridTemplateColumns:'auto 1fr 2fr auto', gap:8, alignItems:'center' }}>
        <div style={{ fontWeight:700, opacity:.8 }}>Badge {index + 1}</div>

        {/* color chooser */}
        <select value={color} onChange={(e) => set(`${base}.color`, e.target.value || undefined)}>
          <option value="">Auto</option>
          <option value="green">Strength (Green)</option>
          <option value="red">Weakness (Red)</option>
        </select>

        {/* label combobox with datalist (typed text allowed) */}
        <LabelCombo
          value={label}
          onCommit={(v) => set(`${base}.label`, v)}
          options={options}
          listId={listId}
          placeholder="Select or type a label…"
          maxLength={40}
        />

        <button onClick={() => set(base, undefined)} className="wb-danger" type="button">Clear</button>
      </div>
    );
  };

  /* ======================== Manual Roster & Picks (UNCONTROLLED) ======================== */
  const ManualRosterSection = () => {
    const initialManual = Array.isArray(o?.manual?.roster) ? o.manual.roster : [];
    const [rowIds, setRowIds] = useState(initialManual.length ? initialManual.map((_, i) => i) : [0]);
    const nextIdRef = useRef(rowIds.length);

    const nameRefs = useRef({}); // id -> input
    const pickRefs = useRef({}); // id -> input
    const [savedFlag, setSavedFlag] = useState(false);

    const addRow = () => { const id = nextIdRef.current++; setRowIds((prev) => [...prev, id]); };
    const removeRow = (id) => { setRowIds((prev) => prev.filter((x) => x !== id)); delete nameRefs.current[id]; delete pickRefs.current[id]; };

    const submit = () => {
      const rows = rowIds.map((id, idx) => {
        const name = (nameRefs.current[id]?.value || '').trim();
        const pick = (pickRefs.current[id]?.value || '').trim();
        return { name, pick };
      }).filter((r) => r.name.length > 0);

      set('manual.roster', rows.length ? rows : undefined);
      setSavedFlag(true);
      setTimeout(() => setSavedFlag(false), 1600);
    };

    const Row = ({ id, defaultName = '', defaultPick = '' }) => (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
        <input
          defaultValue={defaultName}
          placeholder="Player name (e.g., Bijan Robinson)"
          ref={(el) => { if (el) nameRefs.current[id] = el; }}
        />
        <input
          defaultValue={defaultPick}
          placeholder="Pick (1.07, #5, or 5)"
          ref={(el) => { if (el) pickRefs.current[id] = el; }}
        />
        <ClearBtn onClick={() => removeRow(id)} />
      </div>
    );

    return (
      <div style={{ display: 'grid', gap: 8, gridColumn: '1 / -1' }}>
        {rowIds.map((id, idx) => (
          <Row
            key={id}
            id={id}
            defaultName={(o?.manual?.roster && o.manual.roster[idx]?.name) || ''}
            defaultPick={(o?.manual?.roster && o.manual.roster[idx]?.pick) || ''}
          />
        ))}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={addRow}>Add Row</button>
          <button type="button" onClick={submit}>Submit Manual Roster</button>
          {savedFlag && <span style={{ fontSize: 12, color: '#2c7' }}>Saved!</span>}
        </div>

        <div style={{ fontSize: 12, opacity: .75, marginTop: 6 }}>Saved manual roster:</div>
        <pre style={{ background: '#fafafa', border: '1px solid #ddd', padding: 8, fontSize: 12, maxHeight: 140, overflow: 'auto' }}>
          {JSON.stringify(o?.manual?.roster || [], null, 2)}
        </pre>
      </div>
    );
  };

  /* ---------------------------------- render ---------------------------------- */
  return (
    <div className="wb-tweaks">
      <div className="wb-grid">
        {/* Team & Tag */}
        <label>Team Name</label>
        <TextInput value={get('teamName', '')} placeholder="override team name…" onCommit={(v) => set('teamName', v)} />

        {/* Roster Tag: dropdown + free-typing (like S/W badges) */}
        <label>Roster Tag</label>
        <LabelCombo
          value={get('rosterTag', '')}
          onCommit={(v) => set('rosterTag', v)}
          options={ROSTER_TAG_OPTIONS}
          listId="roster-tag-options"
          placeholder="Select or type a roster tag…"
          maxLength={40}
        />

        {/* Four Factors */}
        <div className="wb-sep">Four Factors (0–10)</div>
        <label>Upside</label>{numInput(get('fourFactors.upside', null), 'fourFactors.upside')}
        <label>Reliability</label>{numInput(get('fourFactors.reliability', null), 'fourFactors.reliability')}
        <label>Depth</label>{numInput(get('fourFactors.depth', null), 'fourFactors.depth')}
        <label>Risk</label>{numInput(get('fourFactors.risk', null), 'fourFactors.risk')}

        {/* Positional Grades */}
        <div className="wb-sep">Positional Grades (0–10)</div>
        <label>QB</label>{numInput(get('positionalGrades.QB', null), 'positionalGrades.QB')}
        <label>RB</label>{numInput(get('positionalGrades.RB', null), 'positionalGrades.RB')}
        <label>WR</label>{numInput(get('positionalGrades.WR', null), 'positionalGrades.WR')}
        <label>TE</label>{numInput(get('positionalGrades.TE', null), 'positionalGrades.TE')}

        {/* Final Verdict (stars + text) */}
        <div className="wb-sep">Final Verdict</div>
        <label>Stars (1–5)</label>{numInput(get('finalVerdict.stars', null), 'finalVerdict.stars', { min: 1, max: 5 })}
        <label>Verdict Text</label>
        <TextInput
          value={get('finalVerdict.note', '')}
          placeholder="Type your verdict (max 450 chars)…"
          onCommit={(v) => set('finalVerdict.note', v)}
          maxLength={450}
          counterFrom={450}
        />

        {/* Moves To Make */}
        <div className="wb-sep">Moves To Make (choose players)</div>
        <MoveCardEditor moveId="trade"  title="#1 Column" />
        <MoveCardEditor moveId="uptier" title="#2 Column" />
        <MoveCardEditor moveId="pivot"  title="#3 Column" />

        {/* Manual Roster & Picks */}
        <div className="wb-sep">Manual Roster & Picks (type names + pick)</div>
        <ManualRosterSection />

        {/* Roster Strengths & Weaknesses */}
        <div className="wb-sep">Roster Strengths & Weaknesses (3 badges)</div>
        <div style={{ gridColumn:'1 / -1', display:'grid', gap:8 }}>
          <SWRow index={0} />
          <SWRow index={1} />
          <SWRow index={2} />
        </div>

        {/* Actions */}
        <div className="wb-actions-row" style={{ gridColumn:'1 / -1' }}>
          <button onClick={onExport}>{exportLabel}</button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              alert('Share link copied!');
            }}
          >
            Copy Share Link
          </button>
          <button onClick={()=>onOverrides({})} className="wb-danger">Reset All</button>
        </div>

        {/* HUD */}
        <div className="wb-hud" style={{ gridColumn:'1 / -1' }}>
          <div><strong>ownerId:</strong> {hud?.ownerId || '—'}</div>
          <div><strong>roster:</strong> {hud?.rosterCount ?? 0}</div>
          <div><strong>starters:</strong> {hud?.startersCount ?? 0}</div>
          <div><strong>loading:</strong> {String(hud?.loading ?? false)}</div>
          {hud?.err && <div className="wb-err">{hud.err}</div>}
        </div>
      </div>
    </div>
  );
}
