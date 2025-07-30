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
exports.mockSearchParams = mockSearchParams;
var react_1 = require("@testing-library/react");
var BigBoy_1 = require("./BigBoy");
var react_router_dom_1 = require("react-router-dom");
var urlParams_1 = require("../../../../../consts/urlParams");
var user_event_1 = require("@testing-library/user-event");
var ROSTER = {
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
};
var NUM_ROSTERS = 10;
var TEAM_NAME = 'test Team Name';
var DEFAULT_URL_PARAMS = 'cornerstones=6770-7547-11631-11620' +
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
    '&suggestions=suggestion+1-suggestion+2-suggestion+3-suggestion+4-suggestion+5-suggestion+6';
function wrappedRender(component) {
    return (0, react_1.render)(<react_router_dom_1.HashRouter basename="/">
            <react_router_dom_1.Routes>
                <react_router_dom_1.Route path="/" element={component}/>
            </react_router_dom_1.Routes>
        </react_router_dom_1.HashRouter>);
}
describe('BigBoy v2', function () {
    it('can toggle preview', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, getByText, getByLabelText, getAllByText;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                case 1:
                    _a = _b.sent(), getByText = _a.getByText, getByLabelText = _a.getByLabelText, getAllByText = _a.getAllByText;
                    expect(getAllByText(TEAM_NAME)).toHaveLength(1);
                    expect(getByLabelText('Show Preview')).not.toBeChecked();
                    return [4 /*yield*/, user_event_1.default.click(getByText('Show Preview'))];
                case 2:
                    _b.sent();
                    expect(getByLabelText('Show Preview')).toBeChecked();
                    expect(getAllByText(TEAM_NAME)).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Settings', function () {
        it('renders settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, settingTiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        container = (_a.sent()).container;
                        settingTiles = container.querySelectorAll('.settingTile');
                        expect(settingTiles).toHaveLength(9);
                        expect(settingTiles[0]).toHaveTextContent("".concat(NUM_ROSTERS));
                        return [2 /*return*/];
                }
            });
        }); });
        it('can add other settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, getByLabelText, container, otherSettingsInput;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        _a = _b.sent(), getByLabelText = _a.getByLabelText, container = _a.container;
                        otherSettingsInput = getByLabelText('Other Settings');
                        expect(otherSettingsInput).toHaveValue('');
                        return [4 /*yield*/, user_event_1.default.type(otherSettingsInput, 'test settings content')];
                    case 2:
                        _b.sent();
                        expect(otherSettingsInput).toHaveValue('test settings content');
                        expect(container.querySelectorAll('.otherSettings')[0]).toHaveTextContent('test settings content');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('renders RosterGraphic', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, rosterGraphic;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                case 1:
                    container = (_a.sent()).container;
                    rosterGraphic = container.querySelector('.rosterGraphic');
                    expect(rosterGraphic).toBeInTheDocument();
                    expect(rosterGraphic).toHaveTextContent(/rome odunze/i);
                    expect(rosterGraphic).toHaveTextContent(/joe burrow/i);
                    expect(rosterGraphic).toHaveTextContent(/zack moss/i);
                    expect(rosterGraphic).toHaveTextContent(/trey mcbride/i);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('RisersFallers', function () {
        it('renders', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, risersFallersGraphic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        container = (_a.sent()).container;
                        risersFallersGraphic = container.querySelector('.risersFallersGraphic');
                        expect(risersFallersGraphic).toBeInTheDocument();
                        expect(risersFallersGraphic).toHaveTextContent(/J. Taylor/i);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Saving/Loading', function () {
        it('can save', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getByText, saveButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        getByText = (_a.sent()).getByText;
                        expect(window.location.href).not.toContain(urlParams_1.CORNERSTONES);
                        saveButton = getByText('Save');
                        expect(saveButton).toBeInTheDocument();
                        return [4 /*yield*/, user_event_1.default.click(saveButton)];
                    case 2:
                        _a.sent();
                        expect(window.location.href).toContain("".concat(urlParams_1.CORNERSTONES, "=6770-7547-8130-6813"));
                        expect(window.location.href).toContain("".concat(urlParams_1.SELLS, "=6770-7547-8130"));
                        expect(window.location.href).toContain("".concat(urlParams_1.BUYS, "=10229-5849-4866-10859-11565-11638"));
                        expect(window.location.href).toContain("".concat(urlParams_1.PLUS_MAP, "=F-F-F-F-F-F"));
                        expect(window.location.href).toContain("".concat(urlParams_1.HOLDS, "=6770-7547"));
                        return [2 /*return*/];
                }
            });
        }); });
        it('can update and save', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, getByText, getAllByLabelText, plusSwitch, saveButton;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        _a = _b.sent(), getByText = _a.getByText, getAllByLabelText = _a.getAllByLabelText;
                        plusSwitch = getAllByLabelText('plus?')[0];
                        expect(plusSwitch).toBeInTheDocument();
                        // Simulate a user clicking the "plus?" switch
                        return [4 /*yield*/, user_event_1.default.click(plusSwitch)];
                    case 2:
                        // Simulate a user clicking the "plus?" switch
                        _b.sent();
                        saveButton = getByText('Save');
                        return [4 /*yield*/, user_event_1.default.click(saveButton)];
                    case 3:
                        _b.sent();
                        expect(window.location.href).toContain("".concat(urlParams_1.PLUS_MAP, "=T-F-F-F-F-F"));
                        return [2 /*return*/];
                }
            });
        }); });
        it('can load from url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSearchParams();
                        return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        container = (_a.sent()).container;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var suggestedMovesGraphic = container.querySelector('.suggestedMovesGraphic');
                                expect(suggestedMovesGraphic).toHaveTextContent(/Rashee Rice \(\+\)/gm);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                var rosterGraphic = container.querySelector('.rosterGraphic');
                                expect(rosterGraphic).toHaveTextContent(/9th \/ 10/gm);
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                expect(container).toHaveTextContent(/extra settings/gm);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can clear url saved data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getByText, clearButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSearchParams();
                        return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        getByText = (_a.sent()).getByText;
                        expect(window.location.href).toContain(urlParams_1.CORNERSTONES);
                        clearButton = getByText('Clear');
                        return [4 /*yield*/, user_event_1.default.click(clearButton)];
                    case 2:
                        _a.sent();
                        expect(window.location.href).not.toContain(urlParams_1.CORNERSTONES);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can save rookie pick buys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var YEAR, _a, getAllByLabelText, getByText, findByText, buyInputs, _b, saveButton;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        YEAR = '2025';
                        return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        _a = _c.sent(), getAllByLabelText = _a.getAllByLabelText, getByText = _a.getByText, findByText = _a.findByText;
                        buyInputs = getAllByLabelText('Buy');
                        expect(buyInputs).toHaveLength(6);
                        return [4 /*yield*/, selectAutocompleteOption(buyInputs[0], "".concat(YEAR, " Rookie Picks"))];
                    case 2:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, findByText("".concat(YEAR, " Rookie Picks"))];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).toBeInTheDocument();
                        saveButton = getByText('Save');
                        return [4 /*yield*/, user_event_1.default.click(saveButton)];
                    case 4:
                        _c.sent();
                        expect(window.location.href).toContain("".concat(urlParams_1.BUYS, "=RP-").concat(YEAR));
                        return [2 /*return*/];
                }
            });
        }); });
        it('can load rookie pick buys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var YEAR, container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        YEAR = '2025';
                        mockSearchParams(DEFAULT_URL_PARAMS.replace('11565', "RP-".concat(YEAR)));
                        return [4 /*yield*/, wrappedRender(<BigBoy_1.default roster={ROSTER} numRosters={NUM_ROSTERS} teamName={TEAM_NAME} qbRank={0} rbRank={0} wrRank={0} teRank={0} isSuperFlex={true}/>)];
                    case 1:
                        container = (_a.sent()).container;
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                expect(container).toHaveTextContent("".concat(YEAR, " Rookie Picks"));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
var selectAutocompleteOption = function (inputElement, optionText) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Open dropdown
            return [4 /*yield*/, user_event_1.default.click(inputElement)];
            case 1:
                // Open dropdown
                _a.sent();
                return [4 /*yield*/, user_event_1.default.clear(inputElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, user_event_1.default.type(inputElement, optionText)];
            case 3:
                _a.sent();
                return [4 /*yield*/, user_event_1.default.keyboard('{Enter}')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
function mockSearchParams(paramsString) {
    if (paramsString === void 0) { paramsString = DEFAULT_URL_PARAMS; }
    var pathname = window.location.pathname;
    var url = paramsString ? "".concat(pathname, "#/?").concat(paramsString) : pathname;
    window.history.pushState({}, '', url);
}
