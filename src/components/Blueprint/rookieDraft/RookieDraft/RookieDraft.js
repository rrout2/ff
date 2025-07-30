"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verdict = void 0;
exports.sortDraftPicks = sortDraftPicks;
exports.useRookieDraft = useRookieDraft;
exports.default = RookieDraft;
exports.RookieDraftInputs = RookieDraftInputs;
exports.RookieDraftGraphic = RookieDraftGraphic;
var RookieDraft_module_css_1 = require("./RookieDraft.module.css");
var images_1 = require("../../../../consts/images");
var react_1 = require("react");
var BigBoy_1 = require("../../v1/modules/BigBoy/BigBoy");
var material_1 = require("@mui/material");
var Clear_1 = require("@mui/icons-material/Clear");
var hooks_1 = require("../../../../hooks/hooks");
var sleeper_api_1 = require("../../../../sleeper-api/sleeper-api");
var urlParams_1 = require("../../../../consts/urlParams");
var TeamPage_1 = require("../../../Team/TeamPage/TeamPage");
var RosterTier_1 = require("../../infinite/RosterTier/RosterTier");
var fantasy_1 = require("../../../../consts/fantasy");
var BuySellHold_1 = require("../../infinite/BuySellHold/BuySellHold");
var StyledNumberInput_1 = require("../../shared/StyledNumberInput");
var Verdict;
(function (Verdict) {
    Verdict["Downtier"] = "Downtier";
    Verdict["Hold"] = "Hold";
    Verdict["ProvenAsset"] = "Proven Asset";
    Verdict["ProvenVet"] = "Proven Vet";
    Verdict["Uptier"] = "Uptier";
    Verdict["None"] = "";
})(Verdict || (exports.Verdict = Verdict = {}));
var VERDICT_OPTIONS = Object.values(Verdict);
function sortDraftPicks(a, b) {
    if (a.round === '' || b.round === '') {
        if (a.round === '' && b.round !== '') {
            return 1;
        }
        if (a.round !== '' && b.round === '') {
            return -1;
        }
        return 0;
    }
    if (a.pick === '' || b.pick === '') {
        if (a.pick === '' && b.pick !== '') {
            return 1;
        }
        if (a.pick !== '' && b.pick === '') {
            return -1;
        }
        return 0;
    }
    return a.round - b.round || a.pick - b.pick;
}
var firstRoundDraftStrategy = {
    header: '1st Round Picks',
    body: 'Never let a value faller make it past you. If there are no fallers, plan to prioritize your team need within a value tier. Note that late 1sts don’t have a superior hit rate to the early 2nd range. ',
};
var secondRoundDraftStrategy = {
    header: '2nd Round Picks',
    body: "Do not reach on 3rd round WRs in this range. If 1st or early 2nd round WRs lie in this range, take them. Prioritize day 2 RBs over everything. Don't pass up on Skattebo/Tuten in the mid to late 2nd.",
};
var thirdRoundDraftStrategy = {
    header: '3rd Round Picks',
    body: 'Use these picks on RBs, we have found that the hit rates for RBs in the 3rd round is very comparable to that of the hit rates in the 2nd. Keep in mind WRs have very low hit rates in this range.',
};
function useRookieDraft() {
    var _a, _b;
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _c = (0, hooks_1.useTeamIdFromUrl)(), teamId = _c[0], setTeamId = _c[1];
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var _d = (0, react_1.useState)([]), allUsers = _d[0], setAllUsers = _d[1];
    var _e = (0, react_1.useState)(), specifiedUser = _e[0], setSpecifiedUser = _e[1];
    var roster = (0, hooks_1.useRoster)(rosters, teamId, leagueId).roster;
    var _f = (0, react_1.useState)(['', '', '']), outlooks = _f[0], setOutlooks = _f[1];
    var _g = (0, react_1.useState)([
        { round: '', pick: '', verdict: Verdict.None },
        { round: '', pick: '', verdict: Verdict.None },
        { round: '', pick: '', verdict: Verdict.None },
        { round: '', pick: '', verdict: Verdict.None },
    ]), draftPicks = _g[0], setDraftPicks = _g[1];
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX) || ((_a = rosterSettings.get(fantasy_1.QB)) !== null && _a !== void 0 ? _a : 0) > 1;
    var _h = (0, RosterTier_1.useRosterTierAndPosGrades)(isSuperFlex, (_b = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _b !== void 0 ? _b : 0, roster), qbGrade = _h.qbGrade, rbGrade = _h.rbGrade, wrGrade = _h.wrGrade, teGrade = _h.teGrade, tier = _h.tier;
    // 4 picks, 3 targets per pick
    var _j = (0, react_1.useState)([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]), rookieTargets = _j[0], setRookieTargets = _j[1];
    var _k = (0, react_1.useState)([0, 1]), autoPopulatedDraftStrategy = _k[0], setAutoPopulatedDraftStrategy = _k[1]; // 0 = 1st round, 1 = 2nd round, 2 = 3rd round
    var _l = (0, react_1.useState)([
        {
            header: '2nd Round Picks',
            body: 'Draft Strategy Body',
        },
        {
            header: '3rd Round Picks',
            body: 'Draft Strategy Body',
        },
    ]), draftStrategy = _l[0], setDraftStrategy = _l[1];
    (0, react_1.useEffect)(function () {
        if (autoPopulatedDraftStrategy.length !== 2) {
            setDraftStrategy([
                firstRoundDraftStrategy,
                secondRoundDraftStrategy,
            ]);
            return;
        }
        var newDraftStrategy = autoPopulatedDraftStrategy.map(function (strategy) {
            switch (strategy) {
                case 0:
                    return firstRoundDraftStrategy;
                case 1:
                    return secondRoundDraftStrategy;
                case 2:
                    return thirdRoundDraftStrategy;
                default:
                    return { header: '', body: '' };
            }
        });
        setDraftStrategy(newDraftStrategy);
    }, [autoPopulatedDraftStrategy]);
    var _m = (0, hooks_1.useRookieRankings)(isSuperFlex), getRookieTier = _m.getRookieTier, sortByRookieRank = _m.sortByRookieRank;
    var _o = (0, react_1.useState)(0), draftCapitalScore = _o[0], setDraftCapitalScore = _o[1];
    var pickMoves = (0, hooks_1.usePickMoves)(isSuperFlex).pickMoves;
    (0, react_1.useEffect)(function () {
        if (tier === RosterTier_1.RosterTier.Unknown)
            return;
        resetDraftPickVerdict(0);
        resetRookieTargets(0);
    }, [draftPicks[0].round, draftPicks[0].pick, pickMoves, tier]);
    (0, react_1.useEffect)(function () {
        if (tier === RosterTier_1.RosterTier.Unknown)
            return;
        resetDraftPickVerdict(1);
        resetRookieTargets(1);
    }, [draftPicks[1].round, draftPicks[1].pick, pickMoves, tier]);
    (0, react_1.useEffect)(function () {
        if (tier === RosterTier_1.RosterTier.Unknown)
            return;
        resetDraftPickVerdict(2);
        resetRookieTargets(2);
    }, [draftPicks[2].round, draftPicks[2].pick, pickMoves, tier]);
    (0, react_1.useEffect)(function () {
        if (tier === RosterTier_1.RosterTier.Unknown)
            return;
        resetDraftPickVerdict(3);
        resetRookieTargets(3);
    }, [draftPicks[3].round, draftPicks[3].pick, pickMoves, tier]);
    /**
     * Calculates the pick number based on the round and pick within that round.
     *
     * @param round - The draft round, which can be a number or an empty string.
     * @param pick - The pick position within the round, which can be a number or an empty string.
     * @returns The calculated pick number (1-indexed), or -1 if the round or pick is not specified.
     */
    function getPickNumber(round, pick) {
        var _a;
        if (round === '' || pick === '') {
            return -1;
        }
        var leagueSize = (_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0;
        return (round - 1) * leagueSize + pick;
    }
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId() || +teamId >= allUsers.length) {
            return;
        }
        setSpecifiedUser(allUsers === null || allUsers === void 0 ? void 0 : allUsers[+teamId]);
    }, [allUsers, teamId]);
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId()) {
            return;
        }
        if (+teamId >= allUsers.length) {
            // if the teamId is out of bounds, reset it
            setTeamId('0');
        }
    }, [allUsers, teamId]);
    var _p = (0, react_1.useState)(''), archetype = _p[0], setArchetype = _p[1];
    (0, react_1.useEffect)(function () {
        if (!leagueId || !rosters)
            return;
        var ownerIds = new Set(rosters.map(function (r) { return r.owner_id; }));
        (0, sleeper_api_1.getAllUsers)(leagueId).then(function (users) {
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            return setAllUsers(users.filter(function (u) { return ownerIds.has(u.user_id); }));
        });
    }, [leagueId, rosters]);
    function hasTeamId() {
        return teamId !== '' && teamId !== urlParams_1.NONE_TEAM_ID;
    }
    function resetRookieTargets(index) {
        setRookieTargets(function (oldRookieTargets) {
            var newRookieTargets = oldRookieTargets.slice();
            var dp = draftPicks[index];
            var pickNumber = getPickNumber(dp.round, dp.pick);
            var tier = pickNumber > 0 ? getRookieTier(pickNumber) : [];
            while (tier.length < 3) {
                tier.push('');
            }
            newRookieTargets[index] = tier;
            return newRookieTargets;
        });
    }
    function resetDraftPickVerdict(index) {
        if (index < 0 || index >= draftPicks.length) {
            return;
        }
        setDraftPicks(function (oldDraftPicks) {
            var newDraftPicks = oldDraftPicks.slice();
            var dp = draftPicks[index];
            newDraftPicks[index] = __assign(__assign({}, dp), { verdict: Verdict.Hold });
            return newDraftPicks.sort(sortDraftPicks);
        });
    }
    return {
        leagueId: leagueId,
        teamId: teamId,
        setTeamId: setTeamId,
        allUsers: allUsers,
        specifiedUser: specifiedUser,
        setSpecifiedUser: setSpecifiedUser,
        rosters: rosters,
        roster: roster,
        outlooks: outlooks,
        setOutlooks: setOutlooks,
        draftPicks: draftPicks,
        setDraftPicks: setDraftPicks,
        rookieTargets: rookieTargets,
        setRookieTargets: setRookieTargets,
        autoPopulatedDraftStrategy: autoPopulatedDraftStrategy,
        setAutoPopulatedDraftStrategy: setAutoPopulatedDraftStrategy,
        draftStrategy: draftStrategy,
        setDraftStrategy: setDraftStrategy,
        draftCapitalScore: draftCapitalScore,
        setDraftCapitalScore: setDraftCapitalScore,
        qbGrade: qbGrade,
        rbGrade: rbGrade,
        wrGrade: wrGrade,
        teGrade: teGrade,
        archetype: archetype,
        setArchetype: setArchetype,
        isSuperFlex: isSuperFlex,
        sortByRookieRank: sortByRookieRank,
    };
}
function RookieDraft() {
    var _a = useRookieDraft(), allUsers = _a.allUsers, specifiedUser = _a.specifiedUser, teamId = _a.teamId, setTeamId = _a.setTeamId, leagueId = _a.leagueId, archetype = _a.archetype, setArchetype = _a.setArchetype, outlooks = _a.outlooks, setOutlooks = _a.setOutlooks, draftPicks = _a.draftPicks, setDraftPicks = _a.setDraftPicks, rookieTargets = _a.rookieTargets, setRookieTargets = _a.setRookieTargets, draftStrategy = _a.draftStrategy, setDraftStrategy = _a.setDraftStrategy, draftCapitalScore = _a.draftCapitalScore, setDraftCapitalScore = _a.setDraftCapitalScore, qbGrade = _a.qbGrade, rbGrade = _a.rbGrade, wrGrade = _a.wrGrade, teGrade = _a.teGrade, autoPopulatedDraftStrategy = _a.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _a.setAutoPopulatedDraftStrategy, sortByRookieRank = _a.sortByRookieRank;
    return (<div>
            <RookieDraftInputs allUsers={allUsers} specifiedUser={specifiedUser} teamId={teamId} setTeamId={setTeamId} leagueId={leagueId} archetype={archetype} setArchetype={setArchetype} outlooks={outlooks} setOutlooks={setOutlooks} draftPicks={draftPicks} setDraftPicks={setDraftPicks} rookieTargets={rookieTargets} setRookieTargets={setRookieTargets} draftStrategy={draftStrategy} setDraftStrategy={setDraftStrategy} draftCapitalScore={draftCapitalScore} setDraftCapitalScore={setDraftCapitalScore} autoPopulatedDraftStrategy={autoPopulatedDraftStrategy} setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy} sortByRookieRank={sortByRookieRank}/>
            <RookieDraftGraphic archetype={archetype} teamName={(0, sleeper_api_1.getTeamName)(specifiedUser)} outlooks={outlooks} teamNeeds={(0, BuySellHold_1.getPositionalOrder)({
            qbGrade: qbGrade,
            rbGrade: rbGrade,
            wrGrade: wrGrade,
            teGrade: teGrade,
        })} draftPicks={draftPicks} rookieTargets={rookieTargets} draftStrategy={draftStrategy} draftCapitalScore={draftCapitalScore}/>
        </div>);
}
function RookieDraftInputs(_a) {
    var allUsers = _a.allUsers, specifiedUser = _a.specifiedUser, teamId = _a.teamId, setTeamId = _a.setTeamId, leagueId = _a.leagueId, archetype = _a.archetype, setArchetype = _a.setArchetype, outlooks = _a.outlooks, setOutlooks = _a.setOutlooks, draftPicks = _a.draftPicks, setDraftPicks = _a.setDraftPicks, rookieTargets = _a.rookieTargets, setRookieTargets = _a.setRookieTargets, draftStrategy = _a.draftStrategy, setDraftStrategy = _a.setDraftStrategy, draftCapitalScore = _a.draftCapitalScore, setDraftCapitalScore = _a.setDraftCapitalScore, autoPopulatedDraftStrategy = _a.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _a.setAutoPopulatedDraftStrategy, sortByRookieRank = _a.sortByRookieRank;
    var rounds = __spreadArray([], Array(5).keys(), true).map(function (x) { return x + 1; });
    var picks = __spreadArray([], Array((allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) || 24).keys(), true).map(function (x) { return x + 1; });
    var rookieOptions = Array.from(images_1.rookieMap.keys()).sort(sortByRookieRank);
    return (<>
            {leagueId && allUsers && setTeamId && teamId !== undefined && (<TeamPage_1.TeamSelectComponent teamId={teamId} setTeamId={setTeamId} allUsers={allUsers} specifiedUser={specifiedUser} style={{
                margin: '4px',
                maxWidth: '800px',
            }}/>)}
            {setArchetype && (<material_1.FormControl className={RookieDraft_module_css_1.default.formControlInput}>
                    <material_1.InputLabel>Archetype</material_1.InputLabel>
                    <material_1.Select value={archetype} label="Archetype" onChange={function (event) {
                setArchetype(event.target.value);
            }}>
                        <material_1.MenuItem value={''} key={''}>
                            Choose an Archetype:
                        </material_1.MenuItem>
                        {Object.values(BigBoy_1.Archetype).map(function (arch, idx) { return (<material_1.MenuItem value={arch} key={idx}>
                                {arch}
                            </material_1.MenuItem>); })}
                    </material_1.Select>
                </material_1.FormControl>)}
            {outlooks &&
            setOutlooks &&
            outlooks.map(function (_, idx) { return (<material_1.FormControl key={idx} className={RookieDraft_module_css_1.default.formControlInput}>
                        <material_1.InputLabel>Year {idx + 1}</material_1.InputLabel>
                        <material_1.Select label={"Year ".concat(idx + 1)} value={outlooks[idx]} onChange={function (event) {
                    var newOutlooks = outlooks.slice();
                    newOutlooks[idx] = event.target.value;
                    setOutlooks(newOutlooks);
                }}>
                            <material_1.MenuItem value={''} key={''}>
                                Choose an outlook:
                            </material_1.MenuItem>
                            <material_1.MenuItem value={'CONTEND'} key={'CONTEND'}>
                                {'CONTEND'}
                            </material_1.MenuItem>
                            <material_1.MenuItem value={'REBUILD'} key={'REBUILD'}>
                                {'REBUILD'}
                            </material_1.MenuItem>

                            <material_1.MenuItem value={'RELOAD'} key={'RELOAD'}>
                                {'RELOAD'}
                            </material_1.MenuItem>
                        </material_1.Select>
                    </material_1.FormControl>); })}
            <div className={RookieDraft_module_css_1.default.draftPickInputColumn}>
                {draftPicks.slice(0, 4).map(function (_, idx) { return (<div key={idx} className={RookieDraft_module_css_1.default.draftPickInputRow}>
                        <material_1.Tooltip title="Clear Pick">
                            <material_1.IconButton onClick={function () {
                var newDraftPicks = draftPicks.slice();
                newDraftPicks[idx] = {
                    round: '',
                    pick: '',
                    verdict: Verdict.None,
                };
                setDraftPicks(newDraftPicks);
            }}>
                                <Clear_1.default />
                            </material_1.IconButton>
                        </material_1.Tooltip>
                        <material_1.FormControl key={"".concat(idx, " round")} style={{ width: '120px' }}>
                            <material_1.InputLabel>Round {idx + 1}</material_1.InputLabel>
                            <material_1.Select label={"Round ".concat(idx + 1)} value={draftPicks[idx].round.toString()} onChange={function (event) {
                var newDraftPicks = draftPicks.slice();
                if (event.target.value === '') {
                    newDraftPicks[idx].round = '';
                }
                else {
                    newDraftPicks[idx].round =
                        +event.target.value;
                }
                setDraftPicks(newDraftPicks);
            }}>
                                <material_1.MenuItem value={''} key={''}>
                                    Choose a round:
                                </material_1.MenuItem>
                                {rounds.map(function (round) { return (<material_1.MenuItem value={round} key={round}>
                                        {round}
                                    </material_1.MenuItem>); })}
                            </material_1.Select>
                        </material_1.FormControl>
                        <material_1.FormControl key={"".concat(idx, " pick")} style={{ width: '120px' }}>
                            <material_1.InputLabel>Pick {idx + 1}</material_1.InputLabel>
                            <material_1.Select label={"Pick ".concat(idx + 1)} value={draftPicks[idx].pick.toString()} onChange={function (event) {
                var newDraftPicks = draftPicks.slice();
                if (event.target.value === '') {
                    newDraftPicks[idx].pick = '';
                }
                else {
                    newDraftPicks[idx].pick =
                        +event.target.value;
                }
                setDraftPicks(newDraftPicks);
            }}>
                                <material_1.MenuItem value={''} key={''}>
                                    Choose a pick:
                                </material_1.MenuItem>
                                {picks.map(function (pick) { return (<material_1.MenuItem value={pick} key={pick}>
                                        {pick}
                                    </material_1.MenuItem>); })}
                            </material_1.Select>
                        </material_1.FormControl>
                        <material_1.FormControl key={"".concat(idx, " verdict")} style={{ width: '140px' }}>
                            <material_1.InputLabel>Verdict {idx + 1}</material_1.InputLabel>
                            <material_1.Select label={"Verdict ".concat(idx + 1)} value={draftPicks[idx].verdict} onChange={function (event) {
                var newDraftPicks = draftPicks.slice();
                var newVerdict = event.target.value;
                if (newVerdict !== Verdict.Downtier &&
                    newVerdict !== Verdict.Hold &&
                    newVerdict !== Verdict.ProvenAsset &&
                    newVerdict !== Verdict.ProvenVet &&
                    newVerdict !== Verdict.Uptier) {
                    newDraftPicks[idx].verdict =
                        Verdict.None;
                }
                else {
                    newDraftPicks[idx].verdict = newVerdict;
                }
                setDraftPicks(newDraftPicks);
            }}>
                                <material_1.MenuItem value={''} key={''}>
                                    Choose a verdict:
                                </material_1.MenuItem>
                                {VERDICT_OPTIONS.filter(function (verdict) { return verdict !== Verdict.None; }).map(function (verdict) { return (<material_1.MenuItem value={verdict} key={verdict}>
                                        {verdict}
                                    </material_1.MenuItem>); })}
                            </material_1.Select>
                        </material_1.FormControl>
                        {[0, 1, 2].map(function (targetIdx) { return (<material_1.FormControl key={"".concat(idx, " rookie ").concat(targetIdx)} style={{ width: '150px' }}>
                                <material_1.InputLabel>
                                    Pick {idx + 1} Target {targetIdx + 1}
                                </material_1.InputLabel>
                                <material_1.Select label={"Rookie ".concat(idx + 1, " Target ").concat(targetIdx + 1)} value={rookieTargets[idx][targetIdx]} onChange={function (event) {
                    var newRookieTargets = rookieTargets.slice();
                    var newTarget = event.target.value;
                    newRookieTargets[idx][targetIdx] =
                        newTarget;
                    setRookieTargets(newRookieTargets);
                }}>
                                    <material_1.MenuItem value={''} key={''}>
                                        Choose a target:
                                    </material_1.MenuItem>
                                    {rookieOptions.map(function (rookie) { return (<material_1.MenuItem value={rookie} key={rookie}>{"".concat(rookie)}</material_1.MenuItem>); })}
                                </material_1.Select>
                            </material_1.FormControl>); })}
                    </div>); })}
            </div>
            <div className={RookieDraft_module_css_1.default.draftStrategyInputs}>
                {draftStrategy.map(function (strategy, idx) { return (<div key={idx} className={RookieDraft_module_css_1.default.draftStrategyInputColumn}>
                        <material_1.FormControl key={"".concat(idx, " draft strategy Autofill")}>
                            <material_1.InputLabel>
                                Draft Strategy Autofill {idx + 1}
                            </material_1.InputLabel>
                            <material_1.Select label={"Draft Strategy Autofill ".concat(idx + 1)} value={"".concat(autoPopulatedDraftStrategy[idx])} onChange={function (event) {
                var newDraftStrategy = autoPopulatedDraftStrategy.slice();
                if (event.target.value === '') {
                    newDraftStrategy[idx] = -1;
                }
                else {
                    newDraftStrategy[idx] =
                        +event.target.value;
                }
                setAutoPopulatedDraftStrategy(newDraftStrategy);
            }}>
                                <material_1.MenuItem value={''} key={''}>
                                    Choose a round draft strategy to autofill:
                                </material_1.MenuItem>
                                <material_1.MenuItem value={0} key={0}>
                                    {'1st'}
                                </material_1.MenuItem>
                                <material_1.MenuItem value={1} key={1}>
                                    {'2nd'}
                                </material_1.MenuItem>
                                <material_1.MenuItem value={2} key={2}>
                                    {'3rd'}
                                </material_1.MenuItem>
                            </material_1.Select>
                        </material_1.FormControl>
                        <material_1.TextField value={strategy.header} onChange={function (e) {
                var newDraftStrategy = draftStrategy.slice();
                newDraftStrategy[idx].header = e.target.value;
                setDraftStrategy(newDraftStrategy);
            }} key={"".concat(idx, " header")} label={"Draft Strategy Header ".concat(idx + 1)}/>
                        <material_1.TextField value={strategy.body} onChange={function (e) {
                var newDraftStrategy = draftStrategy.slice();
                newDraftStrategy[idx].body = e.target.value;
                setDraftStrategy(newDraftStrategy);
            }} key={"".concat(idx, " body")} label={"Draft Strategy Body ".concat(idx + 1)} multiline style={{ width: '400px' }}/>
                    </div>); })}
            </div>
            {setDraftCapitalScore && (<div className={RookieDraft_module_css_1.default.draftCapitalScoreInput}>
                    <StyledNumberInput_1.default value={draftCapitalScore} label="Draft Capital Score" min={0} max={10} step={1} onChange={function (_, value) {
                if (value === null) {
                    return;
                }
                setDraftCapitalScore(value);
            }} width={'140px'}/>
                </div>)}
        </>);
}
function RookieDraftGraphic(_a) {
    var archetype = _a.archetype, teamName = _a.teamName, outlooks = _a.outlooks, teamNeeds = _a.teamNeeds, draftPicks = _a.draftPicks, rookieTargets = _a.rookieTargets, draftStrategy = _a.draftStrategy, draftCapitalScore = _a.draftCapitalScore;
    return (<div className={RookieDraft_module_css_1.default.rookieDraftGraphic}>
            <div className={RookieDraft_module_css_1.default.teamName}>{teamName}</div>
            {archetype && (<img src={BigBoy_1.ARCHETYPE_TO_IMAGE.get(archetype)} className={RookieDraft_module_css_1.default.archetypeImage}/>)}
            {outlooks.map(function (outlook, idx) { return (<div key={idx} className={"".concat(RookieDraft_module_css_1.default.outlook, " ").concat(RookieDraft_module_css_1.default["year".concat(idx + 1)])}>
                    {outlook}
                </div>); })}
            {teamNeeds.map(function (pos, idx) { return (<react_1.Fragment key={idx}>
                    <div className={"".concat(RookieDraft_module_css_1.default.teamNeed, " ").concat(RookieDraft_module_css_1.default["need".concat(idx + 1)])}>
                        {pos}
                    </div>
                    <div className={"".concat(RookieDraft_module_css_1.default.shadow, " ").concat(RookieDraft_module_css_1.default["shadow".concat(idx + 1)])}/>
                </react_1.Fragment>); })}
            {draftPicks.slice(0, 4).map(function (draftPick, idx) {
            var noPick = !draftPick.round || !draftPick.pick || !draftPick.verdict;
            var pickDisplay = noPick
                ? 'N/A'
                : "".concat(draftPick.round, ".").concat(draftPick.pick && draftPick.pick < 10 ? '0' : '').concat(draftPick.pick);
            return (<react_1.Fragment key={idx}>
                        <div className={"".concat(RookieDraft_module_css_1.default.draftPick, " ").concat(RookieDraft_module_css_1.default["draftPick".concat(idx + 1)])}>
                            {pickDisplay}
                        </div>
                        {!noPick && (<div className={"".concat(RookieDraft_module_css_1.default.verdict, " ").concat(RookieDraft_module_css_1.default["verdict".concat(idx + 1)], " ").concat(RookieDraft_module_css_1.default[draftPick.verdict
                        .toLowerCase()
                        .replace(' ', '')])}>
                                {draftPick.verdict.toUpperCase()}
                            </div>)}
                        <div className={"".concat(RookieDraft_module_css_1.default.target, " ").concat(RookieDraft_module_css_1.default["target".concat(idx + 1)])}>
                            {pickDisplay}
                        </div>
                    </react_1.Fragment>);
        })}
            {[0, 1, 2, 3].map(function (idx) {
            var numTargets = rookieTargets[idx].filter(function (target) { return target !== ''; }).length;
            return (<div key={"".concat(idx, " line")} className={"".concat(RookieDraft_module_css_1.default.line, " ").concat(RookieDraft_module_css_1.default["line".concat(idx + 1)], " ").concat(numTargets === 2
                    ? RookieDraft_module_css_1.default.shorterLine
                    : numTargets <= 1
                        ? RookieDraft_module_css_1.default.shortestLine
                        : '')}/>);
        })}
            {rookieTargets.map(function (pick, pickIdx) {
            return pick.map(function (target, targetIdx) {
                return target &&
                    images_1.rookieMap.get(target) && (<img key={"".concat(pickIdx, " ").concat(targetIdx)} className={"".concat(RookieDraft_module_css_1.default.rookieTarget, " ").concat(RookieDraft_module_css_1.default["rookieTarget".concat(pickIdx + 1)], " ").concat(RookieDraft_module_css_1.default["rookieTargetRow".concat(pickIdx < 2
                        ? targetIdx + 1
                        : targetIdx + 4)])} src={images_1.rookieMap.get(target)}/>);
            });
        })}
            {draftStrategy.map(function (strategy, idx) { return (<react_1.Fragment key={"".concat(idx, " draft strategy")}>
                    <div className={"".concat(RookieDraft_module_css_1.default.draftStrategyHeader, " ").concat(RookieDraft_module_css_1.default["draftStrategyHeader".concat(idx + 1)])}>
                        {strategy.header}
                    </div>
                    <div className={"".concat(RookieDraft_module_css_1.default.draftStrategyBody, " ").concat(RookieDraft_module_css_1.default["draftStrategyBody".concat(idx + 1)])}>
                        {strategy.body}
                    </div>
                </react_1.Fragment>); })}
            <div className={RookieDraft_module_css_1.default.draftCapitalScore}>
                {draftCapitalScore}/10
            </div>
            <div>
                <div className={RookieDraft_module_css_1.default.draftCapitalScaleBg}/>
                <img src={images_1.horizontalScale} className={RookieDraft_module_css_1.default.draftCapitalScale} style={{
            width: "".concat((650 * draftCapitalScore) / 10, "px"),
        }}/>
                <div className={RookieDraft_module_css_1.default.draftCapitalSlider} style={{
            width: "".concat((650 * draftCapitalScore) / 10, "px"),
        }}/>
            </div>
            <img src={images_1.blankRookie}/>
        </div>);
}
