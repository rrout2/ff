// Print just the whiteboard (node), scaled to one page in a hidden iframe.
// Inlines Sleeper headshots so they render in PDF.

const isSleeperHeadshot = (src = "") =>
  /sleepercdn\.com\/.*\/players\/thumb\/\d+\.jpg/i.test(src);

async function proxiedDataURL(origUrl) {
  const hostPath = String(origUrl).replace(/^https?:\/\//i, "");
  const proxy = `https://images.weserv.nl/?url=${hostPath}`;
  const res = await fetch(proxy, { mode: "cors" });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsDataURL(blob);
  });
}

function waitForImages(doc) {
  const imgs = Array.from(doc.querySelectorAll("img"));
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise((res) => {
          if (img.complete && img.naturalWidth > 0) return res();
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
        })
    )
  );
}

export async function printBoard(node, {
  page = "letter-landscape",  // 'letter-landscape' | 'letter-portrait' | 'a4-landscape' | 'a4-portrait'
  marginPx = 0,
} = {}) {
  if (!node) return;

  // Page sizes (CSS px @96dpi)
  const pageSizes = {
    "letter-landscape": { w: 11 * 96, h: 8.5 * 96 },
    "letter-portrait":  { w: 8.5 * 96, h: 11 * 96 },
    "a4-landscape":     { w: 297 / 25.4 * 96, h: 210 / 25.4 * 96 },
    "a4-portrait":      { w: 210 / 25.4 * 96, h: 297 / 25.4 * 96 },
  };
  const pagePx = pageSizes[page] || pageSizes["letter-landscape"];

  // Build a hidden iframe (no popup)
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = `${pagePx.w}px`;
  iframe.style.height = `${pagePx.h}px`;
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const BASE = (import.meta?.env?.BASE_URL) || "/";
  const baseHref = `${location.origin}${BASE}`;

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<base href="${baseHref}">
<title>Export</title>
<style>
  @page { size: ${pagePx.w}px ${pagePx.h}px; margin: 0; }
  html, body { margin:0; padding:0; background:#fff; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width:${pagePx.w}px; height:${pagePx.h}px; position:relative; overflow:hidden; }
  /* Start with NO scale; we'll measure then set the final scale */
  .board-wrap { position:absolute; left:50%; top:50%; transform: translate(-50%, -50%); transform-origin: top left; }
  * { animation:none !important; transition:none !important; }
</style>
</head>
<body>
  <div class="page"><div class="board-wrap"></div></div>
</body>
</html>`);
  doc.close();

  // Clone the board into the iframe
  const wrap = doc.querySelector(".board-wrap");
  const clone = node.cloneNode(true);
  wrap.appendChild(clone);

  // Eager-load images
  doc.querySelectorAll('img[loading="lazy"]').forEach(img => img.setAttribute('loading','eager'));

  // Inline Sleeper headshots
  const headshots = Array.from(doc.querySelectorAll("img"))
    .filter(img => isSleeperHeadshot(img.getAttribute("src") || img.currentSrc || ""));
  await Promise.all(headshots.map(async (img) => {
    try {
      const data = await proxiedDataURL(img.getAttribute("src") || img.currentSrc || "");
      img.setAttribute("src", data);
    } catch {}
  }));

  // Wait for fonts and images THEN measure the clone
  try { if (doc.fonts?.ready) await doc.fonts.ready; } catch {}
  await waitForImages(doc);

  // True size after layout in the print window
  // Use scrollWidth/Height for full bounding box (content, not just visible box)
  const boardW = wrap.scrollWidth || clone.scrollWidth || clone.getBoundingClientRect().width;
  const boardH = wrap.scrollHeight || clone.scrollHeight || clone.getBoundingClientRect().height;

  const usableW = pagePx.w - marginPx * 2;
  const usableH = pagePx.h - marginPx * 2;
  const scale = Math.min(usableW / boardW, usableH / boardH);

  // Fix dimensions, then apply scale
  wrap.style.width = `${boardW}px`;
  wrap.style.height = `${boardH}px`;
  wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;

  // Print and cleanup
  const win = iframe.contentWindow;
  const cleanup = () => { setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 300); };
  if ("onafterprint" in win) win.addEventListener("afterprint", cleanup, { once: true });
  else setTimeout(cleanup, 1200);

  win.focus();
  win.print();
}
