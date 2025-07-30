"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = Settings;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var hooks_1 = require("../../../../../hooks/hooks");
var Settings_module_css_1 = require("./Settings.module.css");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var fantasy_1 = require("../../../../../consts/fantasy");
var ExportButton_1 = require("../../../shared/ExportButton");
function Settings(_a) {
    var roster = _a.roster, leagueId = _a.leagueId, numRosters = _a.numRosters, teamName = _a.teamName, graphicComponentClass = _a.graphicComponentClass;
    var league = (0, hooks_1.useLeague)(leagueId);
    var playerData = (0, hooks_1.usePlayerData)();
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _b = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _b.startingLineup, benchString = _b.benchString;
    (0, hooks_1.useTitle)('Settings - Blueprint Generator');
    function humanReadablePosition(position) {
        switch (position) {
            case fantasy_1.FLEX:
                return 'WR/RB/TE';
            case fantasy_1.WR_RB_FLEX:
                return 'WR/RB';
            case fantasy_1.WR_TE_FLEX:
                return 'WR/TE';
            case fantasy_1.SUPER_FLEX:
                return 'QB/WR/RB/TE';
        }
        return position;
    }
    function rosterComponent() {
        if (!playerData || !roster)
            return <></>;
        return (<>
                <div>
                    <h3>Projected Starters: </h3>
                    {startingLineup.map(function (_a) {
                var player = _a.player, position = _a.position;
                var starterString = "".concat(player.first_name, " ").concat(player.last_name).toLocaleUpperCase();
                var posTeamString = "".concat(player.position, " - ").concat(player.team);
                return (<div className={Settings_module_css_1.default.playerRow}>
                                <div className={Settings_module_css_1.default.column}>
                                    {humanReadablePosition(position)}
                                </div>
                                {copyWrapper(starterString, Settings_module_css_1.default.column)}
                                {copyWrapper(posTeamString, Settings_module_css_1.default.column)}
                            </div>);
            })}
                </div>
                <div className={Settings_module_css_1.default.bench}>
                    <h3>Bench: </h3>
                    {copyWrapper(benchString)}
                </div>
            </>);
    }
    function rosterSettingsComponent() {
        var _a, _b, _c;
        var wrtFlex = (_a = rosterSettings.get(fantasy_1.FLEX)) !== null && _a !== void 0 ? _a : 0;
        var wrFlex = (_b = rosterSettings.get(fantasy_1.WR_RB_FLEX)) !== null && _b !== void 0 ? _b : 0;
        var wtFlex = (_c = rosterSettings.get(fantasy_1.WR_TE_FLEX)) !== null && _c !== void 0 ? _c : 0;
        var rosterSettingsArray = Array.from(rosterSettings);
        var hasFlexes = rosterSettingsArray.filter(function (_a) {
            var position = _a[0];
            return fantasy_1.FLEX_SET.has(position);
        })
            .length > 0;
        var hasBench = !!rosterSettings.get(fantasy_1.BENCH);
        return (<div className={Settings_module_css_1.default.rosterSettings}>
                <h3>League Settings: </h3>

                {rosterSettingsArray
                .filter(function (_a) {
                var position = _a[0];
                return fantasy_1.SUPER_FLEX_SET.has(position);
            })
                .map(function (_a) {
                var position = _a[0], count = _a[1];
                return (<div key={position}>{"".concat(count, " ").concat(position)}</div>);
            })}

                {hasFlexes && (<div key={fantasy_1.FLEX}>
                        <div key={fantasy_1.FLEX}>{wrtFlex + wrFlex + wtFlex} FLEX</div>
                        <div className={Settings_module_css_1.default.indented}>
                            <div>{wrtFlex} W/R/T</div>
                            <div>{wrFlex} W/R</div>
                            <div>{wtFlex} W/T</div>
                        </div>
                    </div>)}

                {hasBench && (<div key={fantasy_1.BENCH}>{rosterSettings.get(fantasy_1.BENCH)} BN</div>)}
            </div>);
    }
    function otherSettingsComponent() {
        var _a, _b, _c, _d;
        var scoringSettings = league === null || league === void 0 ? void 0 : league.scoring_settings;
        if (!scoringSettings)
            return <></>;
        return (<div className={Settings_module_css_1.default.otherSettings}>
                <div>{numRosters} team league</div>
                <div>SF: {rosterSettings.has(fantasy_1.SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {(_a = scoringSettings.rec) !== null && _a !== void 0 ? _a : 0}</div>
                <div className={Settings_module_css_1.default.indented}>
                    <div>RB Bonus: {(_b = scoringSettings.bonus_rec_rb) !== null && _b !== void 0 ? _b : 0}</div>
                    <div>WR Bonus: {(_c = scoringSettings.bonus_rec_wr) !== null && _c !== void 0 ? _c : 0}</div>
                    <div>TE Bonus: {(_d = scoringSettings.bonus_rec_te) !== null && _d !== void 0 ? _d : 0}</div>
                </div>
                <div>Pass TD: {scoringSettings.pass_td}</div>
                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>);
    }
    return (<div>
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <GraphicComponent numRosters={numRosters} graphicComponentClass={graphicComponentClass} transparent={false}/>
            </div>
            {!graphicComponentClass && (<ExportButton_1.default className={Settings_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_settings.png")}/>)}
            {!graphicComponentClass && rosterSettingsComponent()}
            {!graphicComponentClass && otherSettingsComponent()}
            {!graphicComponentClass && rosterComponent()}
        </div>);
}
function copyWrapper(text, className) {
    return (<div className={Settings_module_css_1.default.copyWrapper + ' ' + (className !== null && className !== void 0 ? className : '')}>
            <material_1.IconButton onClick={function () { return navigator.clipboard.writeText(text); }} size="small">
                <icons_material_1.ContentCopy />
            </material_1.IconButton>
            {text}
        </div>);
}
function InputComponent(_a) {
    var otherSettings = _a.otherSettings, setOtherSettings = _a.setOtherSettings;
    return (<material_1.TextField style={{ margin: '4px' }} label={'Other Settings'} value={otherSettings} onChange={function (e) {
            setOtherSettings(e.target.value);
        }}/>);
}
function GraphicComponent(_a) {
    var numRosters = _a.numRosters, otherSettings = _a.otherSettings, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent;
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var playerData = (0, hooks_1.usePlayerData)();
    var rosterSettings = (0, hooks_1.useRosterSettingsFromId)(leagueId);
    function graphicComponent() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!playerData)
            return <></>;
        var scoringSettings = league === null || league === void 0 ? void 0 : league.scoring_settings;
        if (!scoringSettings)
            return <></>;
        var wrtFlex = (_a = rosterSettings.get(fantasy_1.FLEX)) !== null && _a !== void 0 ? _a : 0;
        var wrFlex = (_b = rosterSettings.get(fantasy_1.WR_RB_FLEX)) !== null && _b !== void 0 ? _b : 0;
        var wtFlex = (_c = rosterSettings.get(fantasy_1.WR_TE_FLEX)) !== null && _c !== void 0 ? _c : 0;
        return (<div className={"".concat(Settings_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : Settings_module_css_1.default.background)}>
                <div className={Settings_module_css_1.default.row}>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        QB: {rosterSettings.get(fantasy_1.QB)}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        RB: {rosterSettings.get(fantasy_1.RB)}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        WR: {rosterSettings.get(fantasy_1.WR)}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        TE: {rosterSettings.get(fantasy_1.TE)}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        FLEX: {wrtFlex + wrFlex + wtFlex}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.red)}>
                        BN: {rosterSettings.get(fantasy_1.BENCH)}
                    </div>
                </div>
                <div className={Settings_module_css_1.default.row}>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.blue)}>
                        TEAMS: {numRosters}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.blue)}>
                        SF:{' '}
                        {rosterSettings.has(fantasy_1.SUPER_FLEX) &&
                rosterSettings.get(fantasy_1.SUPER_FLEX) > 0
                ? 'YES'
                : 'NO'}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.blue)}>
                        PPR: {(_e = (_d = scoringSettings.rec) === null || _d === void 0 ? void 0 : _d.toFixed(1)) !== null && _e !== void 0 ? _e : 0}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.blue)}>
                        TEP: {(_g = (_f = scoringSettings.bonus_rec_te) === null || _f === void 0 ? void 0 : _f.toFixed(1)) !== null && _g !== void 0 ? _g : 0}
                    </div>
                    <div className={"".concat(Settings_module_css_1.default.chip, " ").concat(Settings_module_css_1.default.blue)}>
                        TAXI: {league.settings.taxi_slots}
                    </div>
                </div>
                {otherSettings !== undefined && (<div className={Settings_module_css_1.default.otherSettings}>{otherSettings}</div>)}
            </div>);
    }
    return graphicComponent();
}
