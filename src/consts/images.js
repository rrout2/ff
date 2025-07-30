"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.futureValueDVM = exports.eliteValueDVMCCO = exports.eliteValueDVMCCC = exports.dualEliteDVMRCC = exports.dualEliteDVMCCO = exports.oneYearReloadDVM = exports.rbHeavyGraph = exports.wellRoundedGraphCCR = exports.wellRoundedGraphCCO = exports.wrFactorGraphCCR = exports.wrFactoryGraphCCO = exports.hardRebuildGraphRRR = exports.hardRebuildGraphRRC = exports.futureValueGraph = exports.eliteValueGraphCCO = exports.eliteValueGraphCCC = exports.dualEliteGraphRCC = exports.dualEliteGraphCCO = exports.oneYearReloadGraph = exports.blankBlueprintV2 = exports.holdIcon = exports.sellIcon = exports.buyIcon = exports.nflLogo = exports.tierLogos = exports.nflSilhouette = exports.teamBackgrounds = exports.teamSilhouettes = exports.blueprint2 = exports.draftCapitalBackground = exports.draftCapitalScale = exports.circleSlider = exports.riskSafetyScale = exports.rebuildContendScale = exports.outlook3 = exports.outlook2 = exports.outlook1 = exports.silhouette = exports.blankRedraftBp = exports.blankblueprint = exports.slider = exports.scale = exports.blankLogo = exports.teamLogos = exports.longRed = exports.longGreen = exports.mediumRed = exports.mediumGreen = exports.shortRed = exports.shortGreen = void 0;
exports.horizontalScale = exports.rookieMap = exports.blankRookie = exports.rbHeavy = exports.wrFactory = exports.oneYearReload = exports.wellRounded = exports.hardRebuild = exports.futureValue = exports.eliteValue = exports.eliteQbTe = exports.dualEliteQb = exports.blankLive = exports.domainLogo = exports.domainShield = exports.tradeMeterNeedle = exports.tradeMeterButton = exports.blankInfiniteV4 = exports.blankInfiniteV3 = exports.blankInfiniteV2 = exports.softSell = exports.softBuy = exports.hardSell = exports.hardBuy = exports.blankInfinite = exports.eliteQbTeDVMRCC = exports.eliteQbTeDVMCCO = exports.rbHeavyDVM = exports.wellRoundedDVMCCR = exports.wellRoundedDVMCCO = exports.wrFactoryDVMCCR = exports.wrFactoryDVMCCO = exports.hardRebuildDVMRRR = exports.hardRebuildDVMRRC = void 0;
var ari_png_1 = require("../assets/logos/standard/ari.png");
var atl_png_1 = require("../assets/logos/standard/atl.png");
var bal_png_1 = require("../assets/logos/standard/bal.png");
var buf_png_1 = require("../assets/logos/standard/buf.png");
var car_png_1 = require("../assets/logos/standard/car.png");
var chi_png_1 = require("../assets/logos/standard/chi.png");
var cin_png_1 = require("../assets/logos/standard/cin.png");
var cle_png_1 = require("../assets/logos/standard/cle.png");
var dal_png_1 = require("../assets/logos/standard/dal.png");
var den_png_1 = require("../assets/logos/standard/den.png");
var det_png_1 = require("../assets/logos/standard/det.png");
var gb_png_1 = require("../assets/logos/standard/gb.png");
var hou_png_1 = require("../assets/logos/standard/hou.png");
var ind_png_1 = require("../assets/logos/standard/ind.png");
var jax_png_1 = require("../assets/logos/standard/jax.png");
var kc_png_1 = require("../assets/logos/standard/kc.png");
var lv_png_1 = require("../assets/logos/standard/lv.png");
var lac_png_1 = require("../assets/logos/standard/lac.png");
var lar_png_1 = require("../assets/logos/standard/lar.png");
var mia_png_1 = require("../assets/logos/standard/mia.png");
var min_png_1 = require("../assets/logos/standard/min.png");
var ne_png_1 = require("../assets/logos/standard/ne.png");
var no_png_1 = require("../assets/logos/standard/no.png");
var nyg_png_1 = require("../assets/logos/standard/nyg.png");
var nyj_png_1 = require("../assets/logos/standard/nyj.png");
var phi_png_1 = require("../assets/logos/standard/phi.png");
var pit_png_1 = require("../assets/logos/standard/pit.png");
var sf_png_1 = require("../assets/logos/standard/sf.png");
var sea_png_1 = require("../assets/logos/standard/sea.png");
var tb_png_1 = require("../assets/logos/standard/tb.png");
var ten_png_1 = require("../assets/logos/standard/ten.png");
var wsh_png_1 = require("../assets/logos/standard/wsh.png");
var nfl_png_1 = require("../assets/logos/standard/nfl.png");
exports.nflLogo = nfl_png_1.default;
var ARI_png_1 = require("../assets/logos/silhouettes/ARI.png");
var ATL_png_1 = require("../assets/logos/silhouettes/ATL.png");
var BAL_png_1 = require("../assets/logos/silhouettes/BAL.png");
var BUF_png_1 = require("../assets/logos/silhouettes/BUF.png");
var CAR_png_1 = require("../assets/logos/silhouettes/CAR.png");
var CHI_png_1 = require("../assets/logos/silhouettes/CHI.png");
var CIN_png_1 = require("../assets/logos/silhouettes/CIN.png");
var CLE_png_1 = require("../assets/logos/silhouettes/CLE.png");
var DAL_png_1 = require("../assets/logos/silhouettes/DAL.png");
var DEN_png_1 = require("../assets/logos/silhouettes/DEN.png");
var DET_png_1 = require("../assets/logos/silhouettes/DET.png");
var GB_png_1 = require("../assets/logos/silhouettes/GB.png");
var HOU_png_1 = require("../assets/logos/silhouettes/HOU.png");
var IND_png_1 = require("../assets/logos/silhouettes/IND.png");
var JAX_png_1 = require("../assets/logos/silhouettes/JAX.png");
var KC_png_1 = require("../assets/logos/silhouettes/KC.png");
var LV_png_1 = require("../assets/logos/silhouettes/LV.png");
var LAC_png_1 = require("../assets/logos/silhouettes/LAC.png");
var LAR_png_1 = require("../assets/logos/silhouettes/LAR.png");
var MIA_png_1 = require("../assets/logos/silhouettes/MIA.png");
var MIN_png_1 = require("../assets/logos/silhouettes/MIN.png");
var NE_png_1 = require("../assets/logos/silhouettes/NE.png");
var NO_png_1 = require("../assets/logos/silhouettes/NO.png");
var NYG_png_1 = require("../assets/logos/silhouettes/NYG.png");
var NYJ_png_1 = require("../assets/logos/silhouettes/NYJ.png");
var PHI_png_1 = require("../assets/logos/silhouettes/PHI.png");
var PIT_png_1 = require("../assets/logos/silhouettes/PIT.png");
var SF_png_1 = require("../assets/logos/silhouettes/SF.png");
var SEA_png_1 = require("../assets/logos/silhouettes/SEA.png");
var TB_png_1 = require("../assets/logos/silhouettes/TB.png");
var TEN_png_1 = require("../assets/logos/silhouettes/TEN.png");
var WAS_png_1 = require("../assets/logos/silhouettes/WAS.png");
var nfl_logo_png_1 = require("../assets/logos/silhouettes/nfl_logo.png");
exports.nflSilhouette = nfl_logo_png_1.default;
var ARI_png_2 = require("../assets/teamBackgrounds/ARI.png");
var ATL_png_2 = require("../assets/teamBackgrounds/ATL.png");
var BAL_png_2 = require("../assets/teamBackgrounds/BAL.png");
var BUF_png_2 = require("../assets/teamBackgrounds/BUF.png");
var CAR_png_2 = require("../assets/teamBackgrounds/CAR.png");
var CHI_png_2 = require("../assets/teamBackgrounds/CHI.png");
var CIN_png_2 = require("../assets/teamBackgrounds/CIN.png");
var CLE_png_2 = require("../assets/teamBackgrounds/CLE.png");
var DAL_png_2 = require("../assets/teamBackgrounds/DAL.png");
var DEN_png_2 = require("../assets/teamBackgrounds/DEN.png");
var DET_png_2 = require("../assets/teamBackgrounds/DET.png");
var GB_png_2 = require("../assets/teamBackgrounds/GB.png");
var HOU_png_2 = require("../assets/teamBackgrounds/HOU.png");
var IND_png_2 = require("../assets/teamBackgrounds/IND.png");
var JAX_png_2 = require("../assets/teamBackgrounds/JAX.png");
var KC_png_2 = require("../assets/teamBackgrounds/KC.png");
var LAC_png_2 = require("../assets/teamBackgrounds/LAC.png");
var LAR_png_2 = require("../assets/teamBackgrounds/LAR.png");
var LV_png_2 = require("../assets/teamBackgrounds/LV.png");
var MIA_png_2 = require("../assets/teamBackgrounds/MIA.png");
var MIN_png_2 = require("../assets/teamBackgrounds/MIN.png");
var NE_png_2 = require("../assets/teamBackgrounds/NE.png");
var NO_png_2 = require("../assets/teamBackgrounds/NO.png");
var NYG_png_2 = require("../assets/teamBackgrounds/NYG.png");
var NYJ_png_2 = require("../assets/teamBackgrounds/NYJ.png");
var PHI_png_2 = require("../assets/teamBackgrounds/PHI.png");
var PIT_png_2 = require("../assets/teamBackgrounds/PIT.png");
var SF_png_2 = require("../assets/teamBackgrounds/SF.png");
var SEA_png_2 = require("../assets/teamBackgrounds/SEA.png");
var TB_png_2 = require("../assets/teamBackgrounds/TB.png");
var TEN_png_2 = require("../assets/teamBackgrounds/TEN.png");
var WAS_png_2 = require("../assets/teamBackgrounds/WAS.png");
var blank_png_1 = require("../assets/logos/blank.png");
exports.blankLogo = blank_png_1.default;
var blueprint2_0_png_1 = require("../assets/blueprint2.0.png");
exports.blueprint2 = blueprint2_0_png_1.default;
var scale_png_1 = require("../assets/scale.png");
exports.scale = scale_png_1.default;
var slider_png_1 = require("../assets/slider.png");
exports.slider = slider_png_1.default;
var blankblueprint_jpg_1 = require("../assets/blankblueprint.jpg");
exports.blankblueprint = blankblueprint_jpg_1.default;
var blueprintredraft_1_png_1 = require("../assets/blueprintredraft_1.png");
exports.blankRedraftBp = blueprintredraft_1_png_1.default;
var riskSafetyScale_png_1 = require("../assets/riskSafetyScale.png");
exports.riskSafetyScale = riskSafetyScale_png_1.default;
var silhouette_png_1 = require("../assets/silhouette.png");
exports.silhouette = silhouette_png_1.default;
var outlook1_png_1 = require("../assets/outlook1.png");
exports.outlook1 = outlook1_png_1.default;
var outlook2_png_1 = require("../assets/outlook2.png");
exports.outlook2 = outlook2_png_1.default;
var outlook3_png_1 = require("../assets/outlook3.png");
exports.outlook3 = outlook3_png_1.default;
var rebuildContendScale_png_1 = require("../assets/rebuildContendScale.png");
exports.rebuildContendScale = rebuildContendScale_png_1.default;
var circleSlider_png_1 = require("../assets/circleSlider.png");
exports.circleSlider = circleSlider_png_1.default;
var draftCapitalScale_png_1 = require("../assets/draftCapitalScale.png");
exports.draftCapitalScale = draftCapitalScale_png_1.default;
var draftCapitalBackground_png_1 = require("../assets/draftCapitalBackground.png");
exports.draftCapitalBackground = draftCapitalBackground_png_1.default;
var BUY_png_1 = require("../assets/2.0/BUY.png");
exports.buyIcon = BUY_png_1.default;
var SELL_png_1 = require("../assets/2.0/SELL.png");
exports.sellIcon = SELL_png_1.default;
var HOLD_png_1 = require("../assets/2.0/HOLD.png");
exports.holdIcon = HOLD_png_1.default;
var S_png_1 = require("../assets/tiers/S.png");
var A_png_1 = require("../assets/tiers/A.png");
var B_png_1 = require("../assets/tiers/B.png");
var C_png_1 = require("../assets/tiers/C.png");
var D_png_1 = require("../assets/tiers/D.png");
var E_png_1 = require("../assets/tiers/E.png");
var F_png_1 = require("../assets/tiers/F.png");
var G_png_1 = require("../assets/tiers/G.png");
var H_png_1 = require("../assets/tiers/H.png");
var I_png_1 = require("../assets/tiers/I.png");
var short_red_png_1 = require("../assets/2.0/arrows/short_red.png");
exports.shortRed = short_red_png_1.default;
var short_green_png_1 = require("../assets/2.0/arrows/short_green.png");
exports.shortGreen = short_green_png_1.default;
var medium_red_png_1 = require("../assets/2.0/arrows/medium_red.png");
exports.mediumRed = medium_red_png_1.default;
var medium_green_png_1 = require("../assets/2.0/arrows/medium_green.png");
exports.mediumGreen = medium_green_png_1.default;
var long_red_png_1 = require("../assets/2.0/arrows/long_red.png");
exports.longRed = long_red_png_1.default;
var long_green_png_1 = require("../assets/2.0/arrows/long_green.png");
exports.longGreen = long_green_png_1.default;
var _2_0_background_update__1__png_1 = require("../assets/2.0/2.0_background_update (1).png");
exports.blankBlueprintV2 = _2_0_background_update__1__png_1.default;
var _1R_OCC_png_1 = require("../assets/2.0/outlook_graphs/1R-OCC.png");
exports.oneYearReloadGraph = _1R_OCC_png_1.default;
var DQ___QT_CCO_png_1 = require("../assets/2.0/outlook_graphs/DQ & QT-CCO.png");
exports.dualEliteGraphCCO = DQ___QT_CCO_png_1.default;
var DQ___QT_RCC_png_1 = require("../assets/2.0/outlook_graphs/DQ & QT-RCC.png");
exports.dualEliteGraphRCC = DQ___QT_RCC_png_1.default;
var EV_CCC_png_1 = require("../assets/2.0/outlook_graphs/EV-CCC.png");
exports.eliteValueGraphCCC = EV_CCC_png_1.default;
var EV_CCO_png_1 = require("../assets/2.0/outlook_graphs/EV-CCO.png");
exports.eliteValueGraphCCO = EV_CCO_png_1.default;
var FV_RCC_png_1 = require("../assets/2.0/outlook_graphs/FV-RCC.png");
exports.futureValueGraph = FV_RCC_png_1.default;
var HR_RRC_png_1 = require("../assets/2.0/outlook_graphs/HR-RRC.png");
exports.hardRebuildGraphRRC = HR_RRC_png_1.default;
var HR_RRR_png_1 = require("../assets/2.0/outlook_graphs/HR-RRR.png");
exports.hardRebuildGraphRRR = HR_RRR_png_1.default;
var WF_CCO_png_1 = require("../assets/2.0/outlook_graphs/WF-CCO.png");
exports.wrFactoryGraphCCO = WF_CCO_png_1.default;
var WF_CCR_png_1 = require("../assets/2.0/outlook_graphs/WF-CCR.png");
exports.wrFactorGraphCCR = WF_CCR_png_1.default;
var WR_CCO_png_1 = require("../assets/2.0/outlook_graphs/WR-CCO.png");
exports.wellRoundedGraphCCO = WR_CCO_png_1.default;
var WR_CCR_png_1 = require("../assets/2.0/outlook_graphs/WR-CCR.png");
exports.wellRoundedGraphCCR = WR_CCR_png_1.default;
var RH_CCR_png_1 = require("../assets/2.0/outlook_graphs/RH-CCR.png");
exports.rbHeavyGraph = RH_CCR_png_1.default;
var _1R_OCC_png_2 = require("../assets/2.0/dvms/1R-OCC.png");
exports.oneYearReloadDVM = _1R_OCC_png_2.default;
var DQ_CCO_png_1 = require("../assets/2.0/dvms/DQ-CCO.png");
exports.dualEliteDVMCCO = DQ_CCO_png_1.default;
var DQ_RCC_png_1 = require("../assets/2.0/dvms/DQ-RCC.png");
exports.dualEliteDVMRCC = DQ_RCC_png_1.default;
var EV_CCC_png_2 = require("../assets/2.0/dvms/EV-CCC.png");
exports.eliteValueDVMCCC = EV_CCC_png_2.default;
var EV_CCO_png_2 = require("../assets/2.0/dvms/EV-CCO.png");
exports.eliteValueDVMCCO = EV_CCO_png_2.default;
var FV_RCC_png_2 = require("../assets/2.0/dvms/FV-RCC.png");
exports.futureValueDVM = FV_RCC_png_2.default;
var HR_RRC_png_2 = require("../assets/2.0/dvms/HR-RRC.png");
exports.hardRebuildDVMRRC = HR_RRC_png_2.default;
var HR_RRR_png_2 = require("../assets/2.0/dvms/HR-RRR.png");
exports.hardRebuildDVMRRR = HR_RRR_png_2.default;
var WF_CCO_png_2 = require("../assets/2.0/dvms/WF-CCO.png");
exports.wrFactoryDVMCCO = WF_CCO_png_2.default;
var WF_CCR_png_2 = require("../assets/2.0/dvms/WF-CCR.png");
exports.wrFactoryDVMCCR = WF_CCR_png_2.default;
var WR_CCO_png_2 = require("../assets/2.0/dvms/WR-CCO.png");
exports.wellRoundedDVMCCO = WR_CCO_png_2.default;
var WR_CCR_png_2 = require("../assets/2.0/dvms/WR-CCR.png");
exports.wellRoundedDVMCCR = WR_CCR_png_2.default;
var RH_CCR_png_2 = require("../assets/2.0/dvms/RH-CCR.png");
exports.rbHeavyDVM = RH_CCR_png_2.default;
var QT_CCO_png_1 = require("../assets/2.0/dvms/QT-CCO.png");
exports.eliteQbTeDVMCCO = QT_CCO_png_1.default;
var QT_RCC_png_1 = require("../assets/2.0/dvms/QT-RCC.png");
exports.eliteQbTeDVMRCC = QT_RCC_png_1.default;
// Infinite BP
var Infinite_background_png_1 = require("../assets/infinite/Infinite_background.png");
exports.blankInfinite = Infinite_background_png_1.default;
var blankInfinite_v2_png_1 = require("../assets/infinite/blankInfinite_v2.png");
exports.blankInfiniteV2 = blankInfinite_v2_png_1.default;
var blankInfinite_v3_png_1 = require("../assets/infinite/blankInfinite_v3.png");
exports.blankInfiniteV3 = blankInfinite_v3_png_1.default;
var blankInfinite_v4_png_1 = require("../assets/infinite/blankInfinite_v4.png");
exports.blankInfiniteV4 = blankInfinite_v4_png_1.default;
var Hard_Buy_png_1 = require("../assets/infinite/Hard_Buy.png");
exports.hardBuy = Hard_Buy_png_1.default;
var Hard_sell_png_1 = require("../assets/infinite/Hard_sell.png");
exports.hardSell = Hard_sell_png_1.default;
var Soft_buy_png_1 = require("../assets/infinite/Soft_buy.png");
exports.softBuy = Soft_buy_png_1.default;
var soft_sell_png_1 = require("../assets/infinite/soft_sell.png");
exports.softSell = soft_sell_png_1.default;
var Trade_meter_button_png_1 = require("../assets/infinite/tradeMeter/Trade_meter_button.png");
exports.tradeMeterButton = Trade_meter_button_png_1.default;
var Trade_meter_needle_png_1 = require("../assets/infinite/tradeMeter/Trade_meter_needle.png");
exports.tradeMeterNeedle = Trade_meter_needle_png_1.default;
var domain_shield_png_1 = require("../assets/infinite/domain_shield.png");
exports.domainShield = domain_shield_png_1.default;
var domain_logo_png_1 = require("../assets/infinite/domain_logo.png");
exports.domainLogo = domain_logo_png_1.default;
// Live BP
var Livestream_background_png_1 = require("../assets/live/Livestream_background.png");
exports.blankLive = Livestream_background_png_1.default;
var Dual_Elite_QB_png_1 = require("../assets/live/archetypes/Dual Elite QB.png");
exports.dualEliteQb = Dual_Elite_QB_png_1.default;
var Elite_QB_TE_png_1 = require("../assets/live/archetypes/Elite QB-TE.png");
exports.eliteQbTe = Elite_QB_TE_png_1.default;
var Elite_Value_png_1 = require("../assets/live/archetypes/Elite Value.png");
exports.eliteValue = Elite_Value_png_1.default;
var Future_Value_png_1 = require("../assets/live/archetypes/Future Value.png");
exports.futureValue = Future_Value_png_1.default;
var Hard_Rebuild_png_1 = require("../assets/live/archetypes/Hard Rebuild.png");
exports.hardRebuild = Hard_Rebuild_png_1.default;
var One_Year_Reload_png_1 = require("../assets/live/archetypes/One Year Reload.png");
exports.oneYearReload = One_Year_Reload_png_1.default;
var Well_Rounded_png_1 = require("../assets/live/archetypes/Well Rounded.png");
exports.wellRounded = Well_Rounded_png_1.default;
var WR_Factory_png_1 = require("../assets/live/archetypes/WR Factory.png");
exports.wrFactory = WR_Factory_png_1.default;
var RB_Heavy_png_1 = require("../assets/live/archetypes/RB Heavy.png");
exports.rbHeavy = RB_Heavy_png_1.default;
// Rookie Draft BP
var rookie_bp_blank_png_1 = require("../assets/rookieDraft/rookie_bp_blank.png");
exports.blankRookie = rookie_bp_blank_png_1.default;
var ashtonJeanty_png_1 = require("../assets/rookieDraft/rookieCards/ashtonJeanty.png");
var brashardSmith_png_1 = require("../assets/rookieDraft/rookieCards/brashardSmith.png");
var bhayshulTuten_png_1 = require("../assets/rookieDraft/rookieCards/bhayshulTuten.png");
var cadeKlubnik_png_1 = require("../assets/rookieDraft/rookieCards/cadeKlubnik.png");
var camSkattebo_png_1 = require("../assets/rookieDraft/rookieCards/camSkattebo.png");
var camWard_png_1 = require("../assets/rookieDraft/rookieCards/camWard.png");
var carsonBeck_png_1 = require("../assets/rookieDraft/rookieCards/carsonBeck.png");
var colstonLoveland_png_1 = require("../assets/rookieDraft/rookieCards/colstonLoveland.png");
var damienMartinez_png_1 = require("../assets/rookieDraft/rookieCards/damienMartinez.png");
var devinNeal_png_1 = require("../assets/rookieDraft/rookieCards/devinNeal.png");
var dillonGabriel_png_1 = require("../assets/rookieDraft/rookieCards/dillonGabriel.png");
var djGiddens_png_1 = require("../assets/rookieDraft/rookieCards/djGiddens.png");
var dontEThornton_png_1 = require("../assets/rookieDraft/rookieCards/dontEThornton.png");
var dylanSampson_png_1 = require("../assets/rookieDraft/rookieCards/dylanSampson.png");
var elicAyomanor_png_1 = require("../assets/rookieDraft/rookieCards/elicAyomanor.png");
var elijahArroyo_png_1 = require("../assets/rookieDraft/rookieCards/elijahArroyo.png");
var emekaEgbuka_png_1 = require("../assets/rookieDraft/rookieCards/emekaEgbuka.png");
var evanStewart_png_1 = require("../assets/rookieDraft/rookieCards/evanStewart.png");
var gunnarHelm_png_1 = require("../assets/rookieDraft/rookieCards/gunnarHelm.png");
var haroldFanninJr_png_1 = require("../assets/rookieDraft/rookieCards/haroldFanninJr.png");
var isaiahBond_png_1 = require("../assets/rookieDraft/rookieCards/isaiahBond.png");
var jackBech_png_1 = require("../assets/rookieDraft/rookieCards/jackBech.png");
var jalenMilroe_png_1 = require("../assets/rookieDraft/rookieCards/jalenMilroe.png");
var jalenRoyals_png_1 = require("../assets/rookieDraft/rookieCards/jalenRoyals.png");
var jarquezHunter_png_1 = require("../assets/rookieDraft/rookieCards/jarquezHunter.png");
var jaxsonDart_png_1 = require("../assets/rookieDraft/rookieCards/jaxsonDart.png");
var jaydenHiggins_png_1 = require("../assets/rookieDraft/rookieCards/jaydenHiggins.png");
var jaydnOtt_png_1 = require("../assets/rookieDraft/rookieCards/jaydnOtt.png");
var jaydonBlue_png_1 = require("../assets/rookieDraft/rookieCards/jaydonBlue.png");
var jaylinNoel_png_1 = require("../assets/rookieDraft/rookieCards/jaylinNoel.png");
var jordanJames_png_1 = require("../assets/rookieDraft/rookieCards/jordanJames.png");
var kalebJohnson_png_1 = require("../assets/rookieDraft/rookieCards/kalebJohnson.png");
var kalelMullings_png_1 = require("../assets/rookieDraft/rookieCards/kalelMullings.png");
var kurtisRourke_png_1 = require("../assets/rookieDraft/rookieCards/kurtisRourke.png");
var kyleMccord_png_1 = require("../assets/rookieDraft/rookieCards/kyleMccord.png");
var kyleMonangai_png_1 = require("../assets/rookieDraft/rookieCards/kyleMonangai.png");
var kyleWilliams_png_1 = require("../assets/rookieDraft/rookieCards/kyleWilliams.png");
var kyrenLacy_png_1 = require("../assets/rookieDraft/rookieCards/kyrenLacy.png");
var lequintAllen_png_1 = require("../assets/rookieDraft/rookieCards/lequintAllen.png");
var leVeonMoss_png_1 = require("../assets/rookieDraft/rookieCards/leVeonMoss.png");
var lukeLachey_png_1 = require("../assets/rookieDraft/rookieCards/lukeLachey.png");
var lutherBurden_png_1 = require("../assets/rookieDraft/rookieCards/lutherBurden.png");
var masonTaylor_png_1 = require("../assets/rookieDraft/rookieCards/masonTaylor.png");
var matthewGolden_png_1 = require("../assets/rookieDraft/rookieCards/matthewGolden.png");
var nicSingleton_png_1 = require("../assets/rookieDraft/rookieCards/nicSingleton.png");
var ollieGordon_png_1 = require("../assets/rookieDraft/rookieCards/ollieGordon.png");
var omarionHampton_png_1 = require("../assets/rookieDraft/rookieCards/omarionHampton.png");
var orondeGadsden_png_1 = require("../assets/rookieDraft/rookieCards/orondeGadsden.png");
var patBryant_png_1 = require("../assets/rookieDraft/rookieCards/patBryant.png");
var quinnEwers_png_1 = require("../assets/rookieDraft/rookieCards/quinnEwers.png");
var quinshonJudkins_png_1 = require("../assets/rookieDraft/rookieCards/quinshonJudkins.png");
var raheimSanders_png_1 = require("../assets/rookieDraft/rookieCards/raheimSanders.png");
var rickyWhite_png_1 = require("../assets/rookieDraft/rookieCards/rickyWhite.png");
var rjHarvey_png_1 = require("../assets/rookieDraft/rookieCards/rjHarvey.png");
var savionWilliams_png_1 = require("../assets/rookieDraft/rookieCards/savionWilliams.png");
var shedeurSanders_png_1 = require("../assets/rookieDraft/rookieCards/shedeurSanders.png");
var tahjBrooks_png_1 = require("../assets/rookieDraft/rookieCards/tahjBrooks.png");
var taiFelton_png_1 = require("../assets/rookieDraft/rookieCards/taiFelton.png");
var terranceFerguson_png_1 = require("../assets/rookieDraft/rookieCards/terranceFerguson.png");
var tetMcmillian_png_1 = require("../assets/rookieDraft/rookieCards/tetMcmillian.png");
var tezJohnson_png_1 = require("../assets/rookieDraft/rookieCards/tezJohnson.png");
var toryHorton_png_1 = require("../assets/rookieDraft/rookieCards/toryHorton.png");
var travisHunter_png_1 = require("../assets/rookieDraft/rookieCards/travisHunter.png");
var treHarris_png_1 = require("../assets/rookieDraft/rookieCards/treHarris.png");
var treveyonHenderson_png_1 = require("../assets/rookieDraft/rookieCards/treveyonHenderson.png");
var trevorEtienne_png_1 = require("../assets/rookieDraft/rookieCards/trevorEtienne.png");
var tylerShough_png_1 = require("../assets/rookieDraft/rookieCards/tylerShough.png");
var tylerWarren_png_1 = require("../assets/rookieDraft/rookieCards/tylerWarren.png");
var willHoward_png_1 = require("../assets/rookieDraft/rookieCards/willHoward.png");
var woodyMarks_png_1 = require("../assets/rookieDraft/rookieCards/woodyMarks.png");
var xavierRestrepo_png_1 = require("../assets/rookieDraft/rookieCards/xavierRestrepo.png");
var jacoreyBrooks_png_1 = require("../assets/rookieDraft/rookieCards/jacoreyBrooks.png");
var nickNash_png_1 = require("../assets/rookieDraft/rookieCards/nickNash.png");
var antwaneWells_png_1 = require("../assets/rookieDraft/rookieCards/antwaneWells.png");
var donovanEdwards_png_1 = require("../assets/rookieDraft/rookieCards/donovanEdwards.png");
var marcusYarns_png_1 = require("../assets/rookieDraft/rookieCards/marcusYarns.png");
var coreyKiner_png_1 = require("../assets/rookieDraft/rookieCards/coreyKiner.png");
var arianSmith_png_1 = require("../assets/rookieDraft/rookieCards/arianSmith.png");
var chimereDike_png_1 = require("../assets/rookieDraft/rookieCards/chimereDike.png");
var jaylinLane_png_1 = require("../assets/rookieDraft/rookieCards/jaylinLane.png");
var isaacTeslaa_png_1 = require("../assets/rookieDraft/rookieCards/isaacTeslaa.png");
var horizontalScale_png_1 = require("../assets/horizontalScale.png");
exports.horizontalScale = horizontalScale_png_1.default;
var tierLogos = new Map([
    ['S', S_png_1.default],
    ['A', A_png_1.default],
    ['B', B_png_1.default],
    ['C', C_png_1.default],
    ['D', D_png_1.default],
    ['E', E_png_1.default],
    ['F', F_png_1.default],
    ['G', G_png_1.default],
    ['H', H_png_1.default],
    ['I', I_png_1.default],
]);
exports.tierLogos = tierLogos;
var teamLogos = new Map([
    ['ari', ari_png_1.default],
    ['ARI', ari_png_1.default],
    ['atl', atl_png_1.default],
    ['ATL', atl_png_1.default],
    ['bal', bal_png_1.default],
    ['BAL', bal_png_1.default],
    ['buf', buf_png_1.default],
    ['BUF', buf_png_1.default],
    ['car', car_png_1.default],
    ['CAR', car_png_1.default],
    ['chi', chi_png_1.default],
    ['CHI', chi_png_1.default],
    ['cin', cin_png_1.default],
    ['CIN', cin_png_1.default],
    ['cle', cle_png_1.default],
    ['CLE', cle_png_1.default],
    ['dal', dal_png_1.default],
    ['DAL', dal_png_1.default],
    ['den', den_png_1.default],
    ['DEN', den_png_1.default],
    ['det', det_png_1.default],
    ['DET', det_png_1.default],
    ['gb', gb_png_1.default],
    ['GB', gb_png_1.default],
    ['hou', hou_png_1.default],
    ['HOU', hou_png_1.default],
    ['ind', ind_png_1.default],
    ['IND', ind_png_1.default],
    ['jac', jax_png_1.default],
    ['JAC', jax_png_1.default],
    ['jax', jax_png_1.default],
    ['JAX', jax_png_1.default],
    ['kc', kc_png_1.default],
    ['KC', kc_png_1.default],
    ['lv', lv_png_1.default],
    ['LV', lv_png_1.default],
    ['lac', lac_png_1.default],
    ['LAC', lac_png_1.default],
    ['lar', lar_png_1.default],
    ['LAR', lar_png_1.default],
    ['mia', mia_png_1.default],
    ['MIA', mia_png_1.default],
    ['min', min_png_1.default],
    ['MIN', min_png_1.default],
    ['ne', ne_png_1.default],
    ['NE', ne_png_1.default],
    ['no', no_png_1.default],
    ['NO', no_png_1.default],
    ['nyg', nyg_png_1.default],
    ['NYG', nyg_png_1.default],
    ['nyj', nyj_png_1.default],
    ['NYJ', nyj_png_1.default],
    ['phi', phi_png_1.default],
    ['PHI', phi_png_1.default],
    ['pit', pit_png_1.default],
    ['PIT', pit_png_1.default],
    ['sf', sf_png_1.default],
    ['SF', sf_png_1.default],
    ['sea', sea_png_1.default],
    ['SEA', sea_png_1.default],
    ['tb', tb_png_1.default],
    ['TB', tb_png_1.default],
    ['ten', ten_png_1.default],
    ['TEN', ten_png_1.default],
    ['was', wsh_png_1.default],
    ['WAS', wsh_png_1.default],
    ['wsh', wsh_png_1.default],
    ['WSH', wsh_png_1.default],
    ['RP', nfl_png_1.default],
    ['rp', nfl_png_1.default],
    ['RP-', nfl_png_1.default],
    ['rp-', nfl_png_1.default],
]);
exports.teamLogos = teamLogos;
var teamBackgrounds = new Map([
    ['ari', ARI_png_2.default],
    ['ARI', ARI_png_2.default],
    ['atl', ATL_png_2.default],
    ['ATL', ATL_png_2.default],
    ['bal', BAL_png_2.default],
    ['BAL', BAL_png_2.default],
    ['buf', BUF_png_2.default],
    ['BUF', BUF_png_2.default],
    ['car', CAR_png_2.default],
    ['CAR', CAR_png_2.default],
    ['chi', CHI_png_2.default],
    ['CHI', CHI_png_2.default],
    ['cin', CIN_png_2.default],
    ['CIN', CIN_png_2.default],
    ['cle', CLE_png_2.default],
    ['CLE', CLE_png_2.default],
    ['dal', DAL_png_2.default],
    ['DAL', DAL_png_2.default],
    ['den', DEN_png_2.default],
    ['DEN', DEN_png_2.default],
    ['det', DET_png_2.default],
    ['DET', DET_png_2.default],
    ['gb', GB_png_2.default],
    ['GB', GB_png_2.default],
    ['hou', HOU_png_2.default],
    ['HOU', HOU_png_2.default],
    ['ind', IND_png_2.default],
    ['IND', IND_png_2.default],
    ['jac', JAX_png_2.default],
    ['JAC', JAX_png_2.default],
    ['jax', JAX_png_2.default],
    ['JAX', JAX_png_2.default],
    ['kc', KC_png_2.default],
    ['KC', KC_png_2.default],
    ['lv', LV_png_2.default],
    ['LV', LV_png_2.default],
    ['lac', LAC_png_2.default],
    ['LAC', LAC_png_2.default],
    ['lar', LAR_png_2.default],
    ['LAR', LAR_png_2.default],
    ['mia', MIA_png_2.default],
    ['MIA', MIA_png_2.default],
    ['min', MIN_png_2.default],
    ['MIN', MIN_png_2.default],
    ['ne', NE_png_2.default],
    ['NE', NE_png_2.default],
    ['no', NO_png_2.default],
    ['NO', NO_png_2.default],
    ['nyg', NYG_png_2.default],
    ['NYG', NYG_png_2.default],
    ['nyj', NYJ_png_2.default],
    ['NYJ', NYJ_png_2.default],
    ['phi', PHI_png_2.default],
    ['PHI', PHI_png_2.default],
    ['pit', PIT_png_2.default],
    ['PIT', PIT_png_2.default],
    ['sf', SF_png_2.default],
    ['SF', SF_png_2.default],
    ['sea', SEA_png_2.default],
    ['SEA', SEA_png_2.default],
    ['tb', TB_png_2.default],
    ['TB', TB_png_2.default],
    ['ten', TEN_png_2.default],
    ['TEN', TEN_png_2.default],
    ['was', WAS_png_2.default],
    ['WAS', WAS_png_2.default],
]);
exports.teamBackgrounds = teamBackgrounds;
var teamSilhouettes = new Map([
    ['ari', ARI_png_1.default],
    ['ARI', ARI_png_1.default],
    ['atl', ATL_png_1.default],
    ['ATL', ATL_png_1.default],
    ['bal', BAL_png_1.default],
    ['BAL', BAL_png_1.default],
    ['buf', BUF_png_1.default],
    ['BUF', BUF_png_1.default],
    ['car', CAR_png_1.default],
    ['CAR', CAR_png_1.default],
    ['chi', CHI_png_1.default],
    ['CHI', CHI_png_1.default],
    ['cin', CIN_png_1.default],
    ['CIN', CIN_png_1.default],
    ['cle', CLE_png_1.default],
    ['CLE', CLE_png_1.default],
    ['dal', DAL_png_1.default],
    ['DAL', DAL_png_1.default],
    ['den', DEN_png_1.default],
    ['DEN', DEN_png_1.default],
    ['det', DET_png_1.default],
    ['DET', DET_png_1.default],
    ['gb', GB_png_1.default],
    ['GB', GB_png_1.default],
    ['hou', HOU_png_1.default],
    ['HOU', HOU_png_1.default],
    ['ind', IND_png_1.default],
    ['IND', IND_png_1.default],
    ['jac', JAX_png_1.default],
    ['JAC', JAX_png_1.default],
    ['jax', JAX_png_1.default],
    ['JAX', JAX_png_1.default],
    ['kc', KC_png_1.default],
    ['KC', KC_png_1.default],
    ['lv', LV_png_1.default],
    ['LV', LV_png_1.default],
    ['lac', LAC_png_1.default],
    ['LAC', LAC_png_1.default],
    ['lar', LAR_png_1.default],
    ['LAR', LAR_png_1.default],
    ['mia', MIA_png_1.default],
    ['MIA', MIA_png_1.default],
    ['min', MIN_png_1.default],
    ['MIN', MIN_png_1.default],
    ['ne', NE_png_1.default],
    ['NE', NE_png_1.default],
    ['no', NO_png_1.default],
    ['NO', NO_png_1.default],
    ['nyg', NYG_png_1.default],
    ['NYG', NYG_png_1.default],
    ['nyj', NYJ_png_1.default],
    ['NYJ', NYJ_png_1.default],
    ['phi', PHI_png_1.default],
    ['PHI', PHI_png_1.default],
    ['pit', PIT_png_1.default],
    ['PIT', PIT_png_1.default],
    ['sf', SF_png_1.default],
    ['SF', SF_png_1.default],
    ['sea', SEA_png_1.default],
    ['SEA', SEA_png_1.default],
    ['tb', TB_png_1.default],
    ['TB', TB_png_1.default],
    ['ten', TEN_png_1.default],
    ['TEN', TEN_png_1.default],
    ['was', WAS_png_1.default],
    ['WAS', WAS_png_1.default],
]);
exports.teamSilhouettes = teamSilhouettes;
var rookieMap = new Map([
    ['Ashton Jeanty', ashtonJeanty_png_1.default],
    ['Brashard Smith', brashardSmith_png_1.default],
    ['Cade Klubnik', cadeKlubnik_png_1.default],
    ['Cam Skattebo', camSkattebo_png_1.default],
    ['Cameron Ward', camWard_png_1.default],
    ['Cam Ward', camWard_png_1.default],
    ['Carson Beck', carsonBeck_png_1.default],
    ['Colston Loveland', colstonLoveland_png_1.default],
    ['Damien Martinez', damienMartinez_png_1.default],
    ['Devin Neal', devinNeal_png_1.default],
    ['Dillon Gabriel', dillonGabriel_png_1.default],
    ['DJ Giddens', djGiddens_png_1.default],
    ["Dont'e Thornton", dontEThornton_png_1.default],
    ['Dylan Sampson', dylanSampson_png_1.default],
    ['Elic Ayomanor', elicAyomanor_png_1.default],
    ['Emeka Egbuka', emekaEgbuka_png_1.default],
    ['Evan Stewart', evanStewart_png_1.default],
    ['Gunnar Helm', gunnarHelm_png_1.default],
    ['Harold Fannin', haroldFanninJr_png_1.default],
    ['Isaiah Bond', isaiahBond_png_1.default],
    ['Jack Bech', jackBech_png_1.default],
    ['Jalen Milroe', jalenMilroe_png_1.default],
    ['Jalen Royals', jalenRoyals_png_1.default],
    ['Jarquez Hunter', jarquezHunter_png_1.default],
    ['Jaxson Dart', jaxsonDart_png_1.default],
    ['Jayden Higgins', jaydenHiggins_png_1.default],
    ['Jaydn Ott', jaydnOtt_png_1.default],
    ['Jaylin Noel', jaylinNoel_png_1.default],
    ['Jordan James', jordanJames_png_1.default],
    ['Kaleb Johnson', kalebJohnson_png_1.default],
    ['Kalel Mullings', kalelMullings_png_1.default],
    ['Kurtis Rourke', kurtisRourke_png_1.default],
    ['Kyle Monangai', kyleMonangai_png_1.default],
    ['Kyren Lacy', kyrenLacy_png_1.default],
    ["Le'Veon Moss", leVeonMoss_png_1.default],
    ['Luke Lachey', lukeLachey_png_1.default],
    ['Luther Burden', lutherBurden_png_1.default],
    ['Nic Singleton', nicSingleton_png_1.default],
    ['Ollie Gordon II', ollieGordon_png_1.default],
    ['Omarion Hampton', omarionHampton_png_1.default],
    ['Oronde Gadsden', orondeGadsden_png_1.default],
    ['Quinn Ewers', quinnEwers_png_1.default],
    ['Quinshon Judkins', quinshonJudkins_png_1.default],
    ['Ricky White', rickyWhite_png_1.default],
    ['RJ Harvey', rjHarvey_png_1.default],
    ['Shedeur Sanders', shedeurSanders_png_1.default],
    ['Tahj Brooks', tahjBrooks_png_1.default],
    ['Tai Felton', taiFelton_png_1.default],
    ['Terrance Ferguson', terranceFerguson_png_1.default],
    ['Tetairoa McMillan', tetMcmillian_png_1.default],
    ['Tez Johnson', tezJohnson_png_1.default],
    ['Tory Horton', toryHorton_png_1.default],
    ['Travis Hunter', travisHunter_png_1.default],
    ['Tre Harris', treHarris_png_1.default],
    ['TreVeyon Henderson', treveyonHenderson_png_1.default],
    ['TreyVeon Henderson', treveyonHenderson_png_1.default],
    ['Trevor Etienne', trevorEtienne_png_1.default],
    ['Tyler Warren', tylerWarren_png_1.default],
    ['Woody Marks', woodyMarks_png_1.default],
    ['Xavier Restrepo', xavierRestrepo_png_1.default],
    ['Kyle McCord', kyleMccord_png_1.default],
    ['LeQuint Allen', lequintAllen_png_1.default],
    ['Mason Taylor', masonTaylor_png_1.default],
    ['Matthew Golden', matthewGolden_png_1.default],
    ['Savion Williams', savionWilliams_png_1.default],
    ['Will Howard', willHoward_png_1.default],
    ['Bhayshul Tuten', bhayshulTuten_png_1.default],
    ['Elijah Arroyo', elijahArroyo_png_1.default],
    ['Tyler Shough', tylerShough_png_1.default],
    ['Jaydon Blue', jaydonBlue_png_1.default],
    ['Kyle Williams', kyleWilliams_png_1.default],
    ['Pat Bryant', patBryant_png_1.default],
    ['Raheim Sanders', raheimSanders_png_1.default],
    ['Donovan Edwards', donovanEdwards_png_1.default],
    ['Corey Kiner', coreyKiner_png_1.default],
    ['Antwane Wells Jr.', antwaneWells_png_1.default],
    ['Nick Nash', nickNash_png_1.default],
    ['Marcus Yarns', marcusYarns_png_1.default],
    ["Ja'Corey Brooks", jacoreyBrooks_png_1.default],
    ['Arian Smith', arianSmith_png_1.default],
    ['Chimere Dike', chimereDike_png_1.default],
    ['Jaylin Lane', jaylinLane_png_1.default],
    ['Isaac Teslaa', isaacTeslaa_png_1.default],
]);
exports.rookieMap = rookieMap;
