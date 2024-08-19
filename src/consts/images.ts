import ari from '../assets/logos/ari.png';
import atl from '../assets/logos/atl.png';
import bal from '../assets/logos/bal.png';
import buf from '../assets/logos/buf.png';
import car from '../assets/logos/car.png';
import chi from '../assets/logos/chi.png';
import cin from '../assets/logos/cin.png';
import cle from '../assets/logos/cle.png';
import dal from '../assets/logos/dal.png';
import den from '../assets/logos/den.png';
import det from '../assets/logos/det.png';
import gb from '../assets/logos/gb.png';
import hou from '../assets/logos/hou.png';
import ind from '../assets/logos/ind.png';
import jac from '../assets/logos/jax.png';
import kc from '../assets/logos/kc.png';
import lv from '../assets/logos/lv.png';
import lac from '../assets/logos/lac.png';
import lar from '../assets/logos/lar.png';
import mia from '../assets/logos/mia.png';
import min from '../assets/logos/min.png';
import ne from '../assets/logos/ne.png';
import no from '../assets/logos/no.png';
import nyg from '../assets/logos/nyg.png';
import nyj from '../assets/logos/nyj.png';
import phi from '../assets/logos/phi.png';
import pit from '../assets/logos/pit.png';
import sf from '../assets/logos/sf.png';
import sea from '../assets/logos/sea.png';
import tb from '../assets/logos/tb.png';
import ten from '../assets/logos/ten.png';
import was from '../assets/logos/wsh.png';
import nfl from '../assets/logos/nfl.png';

// import ariSilh from '../assets/logos/silhouettes/ARI.png';
import atlSilh from '../assets/logos/silhouettes/ATL.png';
import balSilh from '../assets/logos/silhouettes/BAL.png';
import bufSilh from '../assets/logos/silhouettes/BUF.png';
import carSilh from '../assets/logos/silhouettes/CAR.png';
import chiSilh from '../assets/logos/silhouettes/CHI.png';
import cinSilh from '../assets/logos/silhouettes/CIN.png';
import cleSilh from '../assets/logos/silhouettes/CLE.png';
import dalSilh from '../assets/logos/silhouettes/DAL.png';
import denSilh from '../assets/logos/silhouettes/DEN.png';
import detSilh from '../assets/logos/silhouettes/DET.png';
import gbSilh from '../assets/logos/silhouettes/GB.png';
import houSilh from '../assets/logos/silhouettes/HOU.png';
import indSilh from '../assets/logos/silhouettes/IND.png';
import jaxSilh from '../assets/logos/silhouettes/JAX.png';
import kcSilh from '../assets/logos/silhouettes/KC.png';
// import lvSilh from '../assets/logos/silhouettes/LV.png';
import lacSilh from '../assets/logos/silhouettes/LAC.png';
// import larSilh from '../assets/logos/silhouettes/LAR.png';
import miaSilh from '../assets/logos/silhouettes/MIA.png';
import minSilh from '../assets/logos/silhouettes/MIN.png';
import neSilh from '../assets/logos/silhouettes/NE.png';
import noSilh from '../assets/logos/silhouettes/NO.png';
// import nygSilh from '../assets/logos/silhouettes/NYG.png';
import nyjSilh from '../assets/logos/silhouettes/NYJ.png';
import phiSilh from '../assets/logos/silhouettes/PHI.png';
import pitSilh from '../assets/logos/silhouettes/PIT.png';
import sfSilh from '../assets/logos/silhouettes/SF.png';
import seaSilh from '../assets/logos/silhouettes/SEA.png';
import tbSilh from '../assets/logos/silhouettes/TB.png';
import tenSilh from '../assets/logos/silhouettes/TEN.png';
import wasSilh from '../assets/logos/silhouettes/WAS.png';

import blankLogo from '../assets/logos/blank.png';
import blueprint2 from '../assets/blueprint2.0.png';
import scale from '../assets/scale.png';
import slider from '../assets/slider.png';
import blankblueprint from '../assets/blankblueprint.jpg';
import silhouette from '../assets/silhouette.png';
import outlook1 from '../assets/outlook1.png';
import outlook2 from '../assets/outlook2.png';
import outlook3 from '../assets/outlook3.png';
import rebuildContendScale from '../assets/rebuildContendScale.png';
import circleSlider from '../assets/circleSlider.png';
import draftCapitalScale from '../assets/draftCapitalScale.png';
import draftCapitalBackground from '../assets/draftCapitalBackground.png';
const teamLogos: Map<string, string> = new Map([
    ['ari', ari],
    ['ARI', ari],
    ['atl', atl],
    ['ATL', atl],
    ['bal', bal],
    ['BAL', bal],
    ['buf', buf],
    ['BUF', buf],
    ['car', car],
    ['CAR', car],
    ['chi', chi],
    ['CHI', chi],
    ['cin', cin],
    ['CIN', cin],
    ['cle', cle],
    ['CLE', cle],
    ['dal', dal],
    ['DAL', dal],
    ['den', den],
    ['DEN', den],
    ['det', det],
    ['DET', det],
    ['gb', gb],
    ['GB', gb],
    ['hou', hou],
    ['HOU', hou],
    ['ind', ind],
    ['IND', ind],
    ['jac', jac],
    ['JAC', jac],
    ['jax', jac],
    ['JAX', jac],
    ['kc', kc],
    ['KC', kc],
    ['lv', lv],
    ['LV', lv],
    ['lac', lac],
    ['LAC', lac],
    ['lar', lar],
    ['LAR', lar],
    ['mia', mia],
    ['MIA', mia],
    ['min', min],
    ['MIN', min],
    ['ne', ne],
    ['NE', ne],
    ['no', no],
    ['NO', no],
    ['nyg', nyg],
    ['NYG', nyg],
    ['nyj', nyj],
    ['NYJ', nyj],
    ['phi', phi],
    ['PHI', phi],
    ['pit', pit],
    ['PIT', pit],
    ['sf', sf],
    ['SF', sf],
    ['sea', sea],
    ['SEA', sea],
    ['tb', tb],
    ['TB', tb],
    ['ten', ten],
    ['TEN', ten],
    ['was', was],
    ['WAS', was],
    ['RP', nfl],
    ['rp', nfl],
    ['RP-', nfl],
    ['rp-', nfl],
]);

const teamSilhouettes: Map<string, string> = new Map([
    // ['ari', ariSilh],
    // ['ARI', ariSilh],
    ['atl', atlSilh],
    ['ATL', atlSilh],
    ['bal', balSilh],
    ['BAL', balSilh],
    ['buf', bufSilh],
    ['BUF', bufSilh],
    ['car', carSilh],
    ['CAR', carSilh],
    ['chi', chiSilh],
    ['CHI', chiSilh],
    ['cin', cinSilh],
    ['CIN', cinSilh],
    ['cle', cleSilh],
    ['CLE', cleSilh],
    ['dal', dalSilh],
    ['DAL', dalSilh],
    ['den', denSilh],
    ['DEN', denSilh],
    ['det', detSilh],
    ['DET', detSilh],
    ['gb', gbSilh],
    ['GB', gbSilh],
    ['hou', houSilh],
    ['HOU', houSilh],
    ['ind', indSilh],
    ['IND', indSilh],
    ['jac', jaxSilh],
    ['JAC', jaxSilh],
    ['jax', jaxSilh],
    ['JAX', jaxSilh],
    ['kc', kcSilh],
    ['KC', kcSilh],
    // ['lv', lvSilh],
    // ['LV', lvSilh],
    ['lac', lacSilh],
    ['LAC', lacSilh],
    // ['lar', larSilh],
    // ['LAR', larSilh],
    ['mia', miaSilh],
    ['MIA', miaSilh],
    ['min', minSilh],
    ['MIN', minSilh],
    ['ne', neSilh],
    ['NE', neSilh],
    ['no', noSilh],
    ['NO', noSilh],
    // ['nyg', nygSilh],
    // ['NYG', nygSilh],
    ['nyj', nyjSilh],
    ['NYJ', nyjSilh],
    ['phi', phiSilh],
    ['PHI', phiSilh],
    ['pit', pitSilh],
    ['PIT', pitSilh],
    ['sf', sfSilh],
    ['SF', sfSilh],
    ['sea', seaSilh],
    ['SEA', seaSilh],
    ['tb', tbSilh],
    ['TB', tbSilh],
    ['ten', tenSilh],
    ['TEN', tenSilh],
    ['was', wasSilh],
    ['WAS', wasSilh],
]);

export {
    teamLogos,
    blankLogo,
    scale,
    slider,
    blankblueprint,
    silhouette,
    outlook1,
    outlook2,
    outlook3,
    rebuildContendScale,
    circleSlider,
    draftCapitalScale,
    draftCapitalBackground,
    blueprint2,
    teamSilhouettes,
};
