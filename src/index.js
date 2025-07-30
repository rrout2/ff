"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
require("./index.css");
var App_1 = require("./App");
var League_1 = require("./components/League/League");
var reportWebVitals_1 = require("./reportWebVitals");
var react_router_dom_1 = require("react-router-dom");
var TeamPage_1 = require("./components/Team/TeamPage/TeamPage");
var react_query_1 = require("@tanstack/react-query");
var PlayerPage_1 = require("./components/Player/PlayerPage/PlayerPage");
var PlayerSearch_1 = require("./components/Player/Search/PlayerSearch");
var NflTeam_1 = require("./components/NflTeam/NflTeam");
var AllTransactions_1 = require("./components/Transactions/AllTransactions");
var BlueprintGenerator_1 = require("./components/Blueprint/v1/BlueprintGenerator");
var NewGenerator_1 = require("./components/Blueprint/v2/NewGenerator");
var Rankings_1 = require("./components/Rankings/Rankings");
var Infinite_1 = require("./components/Blueprint/infinite/Infinite/Infinite");
var FindTeamId_1 = require("./components/FindTeamId/FindTeamId");
var NonSleeeperInfinite_1 = require("./components/NonSleeeperInfinite/NonSleeeperInfinite");
var Live_1 = require("./components/Blueprint/Live/Live");
var RookieDraft_1 = require("./components/Blueprint/rookieDraft/RookieDraft/RookieDraft");
var root = client_1.default.createRoot(document.getElementById('root'));
var queryClient = new react_query_1.QueryClient();
root.render(<react_1.default.StrictMode>
        <react_query_1.QueryClientProvider client={queryClient}>
            <react_router_dom_1.HashRouter basename="/">
                <react_router_dom_1.Routes>
                    <react_router_dom_1.Route path="/" element={<App_1.default />}/>
                    <react_router_dom_1.Route path="/league" element={<League_1.default />}/>
                    <react_router_dom_1.Route path="/team" element={<TeamPage_1.default />}/>
                    <react_router_dom_1.Route path="/player" element={<PlayerPage_1.default />}/>
                    <react_router_dom_1.Route path="/player/search" element={<PlayerSearch_1.default />}/>
                    <react_router_dom_1.Route path="/nfl" element={<NflTeam_1.default />}/>
                    <react_router_dom_1.Route path="/transactions" element={<AllTransactions_1.default />}/>
                    <react_router_dom_1.Route path="/blueprint" element={<BlueprintGenerator_1.default />}/>
                    <react_router_dom_1.Route path="/blueprint-gen" element={<BlueprintGenerator_1.default />}/>
                    <react_router_dom_1.Route path="/blueprintv2" element={<NewGenerator_1.default />}/>
                    <react_router_dom_1.Route path="/rankings" element={<Rankings_1.default />}/>
                    <react_router_dom_1.Route path="/infinite" element={<Infinite_1.default />}/>
                    <react_router_dom_1.Route path="/findteamid" element={<FindTeamId_1.default />}/>
                    <react_router_dom_1.Route path="/nonsleeperinfinite" element={<NonSleeeperInfinite_1.default />}/>
                    <react_router_dom_1.Route path="live" element={<Live_1.default />}/>
                    <react_router_dom_1.Route path="/rookie" element={<RookieDraft_1.default />}/>
                </react_router_dom_1.Routes>
            </react_router_dom_1.HashRouter>
        </react_query_1.QueryClientProvider>
    </react_1.default.StrictMode>);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
(0, reportWebVitals_1.default)();
