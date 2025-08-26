// Prefix every static path with the site base (important on GitHub Pages)
const BASE = import.meta.env.BASE_URL || '/';

export const localHeadshotUrl  = (id) =>
  `${BASE}headshots/${id}.jpg`;

export const remoteHeadshotUrl = (id) =>
  `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;
