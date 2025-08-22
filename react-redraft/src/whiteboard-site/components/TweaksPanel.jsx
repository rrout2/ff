// /src/whiteboard-site/components/TweaksPanel.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function TweaksPanel({ overrides, onOverrides, onExport, hud }) {
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
    onOverrides(prev => {
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

  /* ------------------------------- blur/enter inputs ------------------------------- */
  function TextInput({ value, placeholder, onCommit, maxLength, counterFrom }) {
    const [local, setLocal] = useState(value ?? '');
    useEffect(() => { setLocal(value ?? ''); }, [value]);
    const commit = () => onCommit(local.trim() === '' ? undefined : local.trim());
    const onKeyDown = (e) => { if (e.key === 'Enter') commit(); };

    const left = typeof counterFrom === 'number'
      ? Math.max(0, counterFrom - (local?.length ?? 0))
      : null;

    return (
      <div style={{ display:'grid', gridTemplateColumns:left!==null ? '1fr auto' : '1fr', gap:8, alignItems:'center' }}>
        <input
          value={local}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e)=>setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
        />
        {left !== null && <span style={{ fontSize:12, opacity:.7, whiteSpace:'nowrap' }}>{left} left</span>}
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
        onChange={(e)=>setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        style={{ resize:'vertical' }}
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
      onChange={(e)=>{
        const raw = e.target.value;
        if (raw === '') set(setPath, undefined);
        else set(setPath, Number(raw));
      }}
    />
  );

  /* ======================== Manual Roster & Picks (UNCONTROLLED + SUBMIT) ======================== */
  const initialManual = Array.isArray(o?.manual?.roster) ? o.manual.roster : [];
  const [rowIds, setRowIds] = useState(initialManual.length ? initialManual.map((_,i)=>i) : [0]);
  const nextIdRef = useRef(rowIds.length);

  const nameRefs = useRef({}); // id -> input
  const pickRefs = useRef({}); // id -> input
  const [savedFlag, setSavedFlag] = useState(false);

  const addManualRow   = () => { const id = nextIdRef.current++; setRowIds(prev => [...prev, id]); };
  const removeManualRow= (id) => { setRowIds(prev => prev.filter(x => x !== id)); delete nameRefs.current[id]; delete pickRefs.current[id]; };

  const submitManualRoster = () => {
    const rows = rowIds.map((id, idx) => {
      const name = (nameRefs.current[id]?.value || '').trim();
      const pick = (pickRefs.current[id]?.value || '').trim();
      return { name, pick };
    }).filter(r => r.name.length > 0);

    set('manual.roster', rows.length ? rows : undefined);
    setSavedFlag(true);
    setTimeout(()=>setSavedFlag(false), 1600);
  };

  const ManualRow = ({ id, defaultName='', defaultPick='' }) => (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr auto', gap:8, alignItems:'center' }}>
      <input
        defaultValue={defaultName}
        placeholder="Player name (e.g., Bijan Robinson)"
        ref={(el)=>{ if (el) nameRefs.current[id] = el; }}
      />
      <input
        defaultValue={defaultPick}
        placeholder="Pick (1.07, #5, or 5)"
        ref={(el)=>{ if (el) pickRefs.current[id] = el; }}
      />
      <ClearBtn onClick={()=>removeManualRow(id)} />
    </div>
  );

  /* ====================== Moves editor (type-only; blur/Enter) ====================== */
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

    return (
      <div className="wb-card" style={{ padding: 12 }}>
        <div className="wb-card__title" style={{ marginBottom: 8 }}>{title}</div>

        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Column Label</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
            <TextInput value={label} placeholder={defaultLabel} onCommit={(v) => set(`${base}.label`, v)} maxLength={24} />
            <ClearBtn onClick={() => set(`${base}.label`, undefined)} />
          </div>
        </div>

        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Primary (type name)</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
            <TextInput value={primary} placeholder="e.g., Trey McBride" onCommit={(v) => set(`${base}.primary`, v)} maxLength={64} />
            <ClearBtn onClick={() => set(`${base}.primary`, undefined)} />
          </div>
        </div>

        <div className="wb-row" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Recommendation A (type name)</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
            <TextInput value={rec0} placeholder="e.g., Brock Bowers" onCommit={(v) => setRec(0, v)} maxLength={64} />
            <ClearBtn onClick={() => setRec(0, undefined)} />
          </div>
        </div>

        <div className="wb-row">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Recommendation B (type name)</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
            <TextInput value={rec1} placeholder="e.g., Colston Loveland" onCommit={(v) => setRec(1, v)} maxLength={64} />
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

  /* ============================ Badges (blur/Enter) ============================ */
  const SWRow = ({ index }) => {
    const base  = `rosterStrengths.items.${index}`;
    const color = get(`${base}.color`, '');
    const label = get(`${base}.label`, '');

    return (
      <div className="wb-row sw-row" style={{ display:'grid', gridTemplateColumns:'auto 1fr 2fr auto', gap:8, alignItems:'center' }}>
        <div style={{ fontWeight:700, opacity:.8 }}>Badge {index + 1}</div>
        <select value={color} onChange={(e) => set(`${base}.color`, e.target.value || undefined)}>
          <option value="">Auto</option>
          <option value="green">Strength (Green)</option>
          <option value="red">Weakness (Red)</option>
        </select>
        <TextInput value={label} placeholder="Label e.g. STRONG WR ROOM" onCommit={(v) => set(`${base}.label`, v)} maxLength={40} />
        <button onClick={() => set(base, undefined)} className="wb-danger" type="button">Clear</button>
      </div>
    );
  };

  const resetAll = () => onOverrides({});

  return (
    <div className="wb-tweaks">
      <div className="wb-grid">
        {/* Team & Tag */}
        <label>Team Name</label>
        <TextInput value={get('teamName', '')} placeholder="override team name…" onCommit={(v) => set('teamName', v)} />
        <label>Roster Tag</label>
        <TextInput value={get('rosterTag', '')} placeholder="e.g., BALANCED APPROACH" onCommit={(v) => set('rosterTag', v)} />

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
        <label>Stars (1–5)</label>{numInput(get('finalVerdict.stars', null), 'finalVerdict.stars', { min:1, max:5 })}
        <label>Verdict Text</label>
        <TextInput
          value={get('finalVerdict.note', '')}
          placeholder="Type your verdict (max 450 chars)…"
          onCommit={(v) => set('finalVerdict.note', v)}
          maxLength={450}
          counterFrom={450}
        />

        {/* Moves To Make (type names) */}
        <div className="wb-sep">Moves To Make (type names)</div>
        <MoveCardEditor moveId="trade"  title="#1 Column" />
        <MoveCardEditor moveId="uptier" title="#2 Column" />
        <MoveCardEditor moveId="pivot"  title="#3 Column" />

        {/* Manual Roster & Picks (UNCONTROLLED + SUBMIT) */}
        <div className="wb-sep">Manual Roster & Picks (type names + pick)</div>
        <div style={{ display:'grid', gap:8 }}>
          {rowIds.map((id, idx) => (
            <ManualRow
              key={id}
              id={id}
              defaultName={(o?.manual?.roster && o.manual.roster[idx]?.name) || ''}
              defaultPick={(o?.manual?.roster && o.manual.roster[idx]?.pick) || ''}
            />
          ))}
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button type="button" onClick={addManualRow}>Add Row</button>
            <button type="button" onClick={submitManualRoster}>Submit Manual Roster</button>
            {savedFlag && <span style={{ fontSize:12, color:'#2c7' }}>Saved!</span>}
          </div>

          {/* DEBUG: show what’s currently saved so you can verify submit worked */}
          <div style={{ fontSize:12, opacity:.75, marginTop:6 }}>Saved manual roster:</div>
          <pre style={{ background:'#fafafa', border:'1px solid #ddd', padding:8, fontSize:12, maxHeight:140, overflow:'auto' }}>
            {JSON.stringify(o?.manual?.roster || [], null, 2)}
          </pre>
        </div>

        {/* Roster Strengths & Weaknesses */}
        <div className="wb-sep">Roster Strengths & Weaknesses (3 badges)</div>
        <div style={{ gridColumn:'1 / -1', display:'grid', gap:8 }}>
          <SWRow index={0} />
          <SWRow index={1} />
          <SWRow index={2} />
        </div>

        {/* Actions */}
        <div className="wb-actions-row" style={{ gridColumn:'1 / -1' }}>
          <button onClick={onExport}>Download PDF</button>
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
