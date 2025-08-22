// Add the rest as you collect assets. Keys are Sleeper/NFL team codes.
import ARI from './team-logos/ARI.png';
import ATL from './team-logos/ATL.png';
import BAL from './team-logos/BAL.png';
import BUF from './team-logos/BUF.png';
import CAR from './team-logos/CAR.png';
import CHI from './team-logos/CHI.png';
import CIN from './team-logos/CIN.png';
import CLE from './team-logos/CLE.png';
import DAL from './team-logos/DAL.png';
import DEN from './team-logos/DEN.png';
import DET from './team-logos/DET.png';
import GB from './team-logos/GB.png';
import HOU from './team-logos/HOU.png';
import IND from './team-logos/IND.png';
import JAX from './team-logos/JAX.png';
import KC from './team-logos/KC.png';
import LAC from './team-logos/LAC.png';
import LAR from './team-logos/LAR.png';
import LV from './team-logos/LV.png';
import MIA from './team-logos/MIA.png';
import MIN from './team-logos/MIN.png';
import NE from './team-logos/NE.png';
import NO from './team-logos/NO.png';
import NYG from './team-logos/NYG.png';
import NYJ from './team-logos/NYJ.png';
import PHI from './team-logos/PHI.png';
import PIT from './team-logos/PIT.png';
import SEA from './team-logos/SEA.png';
import SF from './team-logos/SF.png';
import TB from './team-logos/TB.png';
import TEN from './team-logos/TEN.png';
import WAS from './team-logos/WAS.png';

const MAP = {
  ARI, ATL, BAL, BUF, CAR, CHI, CIN, CLE, DAL, DEN, DET, GB, HOU, IND, JAX, KC,
  LAC, LAR, LV, MIA, MIN, NE, NO, NYG, NYJ, PHI, PIT, SEA, SF, TB, TEN, WAS,
};

export function getTeamLogo(code) {
  if (!code) return null;
  const key = String(code).toUpperCase();
  return MAP[key] || null;
}
