import html2canvas from "html2canvas";

/* --- recognizers --- */
const isSleeperHeadshot = (src = "") =>
  /sleepercdn\.com\/.*\/players\/thumb\/\d+\.jpg/i.test(src);

/* target headshot selectors (adjust if you use different classnames) */
const HEADSHOT_SELECTOR = 'img.player-headshot, img.starter-headshot, img.rec-headshot';

/* --- helpers --- */
const abs = (u) => {
  try { return new URL(u, location.href).href; } catch { return u; }
};

/* fetch any image (local or remote) as data URL */
async function toDataURL(url) {
  const res = await fetch(url, { mode: "cors", credentials: "omit" });
  if (!res.ok) throw new Error(`fetch ${url} ${res.status}`);
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsDataURL(blob);
  });
}

/* CORS-friendly proxy for sleeper (weserv) -> then dataURL */
async function sleeperToDataURL(origUrl) {
  const hostPath = String(origUrl).replace(/^https?:\/\//i, "");
  const proxy = `https://images.weserv.nl/?url=${hostPath}`;
  return toDataURL(proxy);
}

/* wait for images in the LIVE node (helps size/measurement) */
async function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map(img => new Promise((res) => {
      if (img.complete && img.naturalWidth > 0) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    }))
  );
}

/**
 * Export a DOM node to PNG.
 * - inlines headshots (local + Sleeper) as data URLs in the clone
 * - does NOT touch the live DOM
 */
export async function exportNodeAsPng(node, filename = "whiteboard.png", opts = {}) {
  if (!node) return;

  const {
    scale = Math.max(2, Math.min(4, (window.devicePixelRatio || 1) * 2)),
    backgroundColor = "#ffffff",
  } = opts;

  try { if (document.fonts?.ready) await document.fonts.ready; } catch {}
  await waitForImages(node);

  // Build an absolute->dataURL map for headshots under this node
  const headshotImgs = Array.from(node.querySelectorAll(HEADSHOT_SELECTOR));
  const inlineMap = new Map(); // absURL -> dataURL

  await Promise.all(headshotImgs.map(async (img) => {
    const src = abs(img.currentSrc || img.src || "");
    if (!src) return;
    if (inlineMap.has(src)) return;

    try {
      const data =
        isSleeperHeadshot(src)
          ? await sleeperToDataURL(src)
          : await toDataURL(src);
      inlineMap.set(src, data);
    } catch {
      /* if fetch fails, html2canvas will still try with useCORS=true */
    }
  }));

  const width  = Math.ceil(node.scrollWidth);
  const height = Math.ceil(node.scrollHeight);

  const canvas = await html2canvas(node, {
    backgroundColor,
    scale,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    useCORS: true,          // allow normal CORS where possible
    allowTaint: false,
    imageTimeout: 15000,    // give images time to load
    logging: false,

    onclone: (doc) => {
      // 1) ensure relative URLs (e.g., /headshots/…) resolve in the clone
      const BASE = (import.meta?.env?.BASE_URL) || '/';
      const baseHref = `${location.origin}${BASE}`;
      const baseEl = doc.createElement('base');
      baseEl.setAttribute('href', baseHref);
      doc.head.prepend(baseEl);

      // 2) eager-load and inline any headshots in the clone
      doc.querySelectorAll('img').forEach((img) => {
        const src = abs(img.getAttribute('src') || img.currentSrc || "");

        // kill lazy behavior so html2canvas sees pixels
        if (img.getAttribute('loading') === 'lazy') img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync');

        if (inlineMap.has(src)) {
          img.setAttribute('src', inlineMap.get(src));
          img.removeAttribute('crossorigin'); // not needed for data URLs
        }
      });
    },
  });

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
