"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FindTeamId;
var react_1 = require("react");
var FindTeamId_module_css_1 = require("./FindTeamId.module.css");
var material_1 = require("@mui/material");
var axios_1 = require("axios");
function FindTeamId() {
    var _a = (0, react_1.useState)(-1), teamId = _a[0], setTeamId = _a[1];
    var _b = (0, react_1.useState)(''), teamName = _b[0], setTeamName = _b[1];
    var _c = (0, react_1.useState)(''), leagueId = _c[0], setLeagueId = _c[1];
    function getAllUsers(leagueId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.sleeper.app/v1/league/".concat(leagueId, "/users"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    }
    function findTeamId() {
        return __awaiter(this, void 0, void 0, function () {
            var users, usernames, newTeamId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getAllUsers(leagueId)];
                    case 1:
                        users = _a.sent();
                        if (users.length === 0) {
                            setTeamId(-1);
                            alert("No users found for league ID '".concat(leagueId, "'"));
                            return [2 /*return*/];
                        }
                        usernames = users.map(getDisplayName);
                        newTeamId = usernames.findIndex(function (u) { return u.toLowerCase().trim() === teamName.toLowerCase().trim(); });
                        if (newTeamId === -1) {
                            setTeamId(-1);
                            alert("Team not found for '".concat(teamName, "'.\nAllowed names: ").concat(usernames.reduce(function (prev, curr) { return "".concat(prev, "\n'").concat(curr, "'"); }, '')));
                            return [2 /*return*/];
                        }
                        setTeamId(newTeamId);
                        navigator.clipboard.writeText(newTeamId.toString());
                        return [2 /*return*/];
                }
            });
        });
    }
    function getDisplayName(user) {
        var _a;
        return "".concat(((_a = user === null || user === void 0 ? void 0 : user.metadata) === null || _a === void 0 ? void 0 : _a.team_name) || (user === null || user === void 0 ? void 0 : user.display_name));
    }
    return (<div className={FindTeamId_module_css_1.default.container}>
            <material_1.TextField label="League ID" value={leagueId} onChange={function (e) { return setLeagueId(e.target.value); }}/>
            <material_1.TextField label="Team Name" value={teamName} onChange={function (e) { return setTeamName(e.target.value); }} onKeyDown={function (e) {
            if (e.key === 'Enter' &&
                teamName !== '' &&
                leagueId !== '') {
                findTeamId();
            }
        }}/>
            <div className={FindTeamId_module_css_1.default.buttons}>
                <material_1.Button variant="outlined" onClick={function () {
            setTeamId(-1);
            setTeamName('');
            setLeagueId('');
        }} disabled={teamId === -1 && teamName === '' && leagueId === ''}>
                    Clear
                </material_1.Button>
                <material_1.Button disabled={teamName === '' || leagueId === ''} variant="outlined" onClick={findTeamId}>
                    Submit
                </material_1.Button>
            </div>
            {teamId > -1 && (<div>
                    <div>
                        Your team ID is{' '}
                        <span className={FindTeamId_module_css_1.default.foundTeamId}>{teamId}</span>,{' '}
                        and has been copied to your clipboard.
                    </div>
                </div>)}
        </div>);
}
