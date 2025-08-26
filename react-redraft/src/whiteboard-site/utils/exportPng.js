import html2canvas from "html2canvas";

/* ---- helpers ---- */
const isSleeperHeadshot = (src = "") =>
  typeof src === "string" &&
  /sleepercdn\.com\/.*\/players\/thumb\//i.test(src);

/* fetch remote image as data URL so html2canvas can draw it */
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

/* wait for all <img> in the subtree to finish loading */
async function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
    )
  );
}

/**
 * Export a DOM node to PNG:
 *  - inlines ONLY Sleeper headshots as data URLs in the html2canvas clone
 *  - leaves all other images, PNGs and UI elements intact
 */
export async function exportNodeAsPng(node, filename = "whiteboard.png", opts = {}) {
  if (!node) return;

  const {
    scale = Math.max(2, Math.min(4, (window.devicePixelRatio || 1) * 2)),
    backgroundColor = "#ffffff",
  } = opts;

  try { if (document.fonts?.ready) await document.fonts.ready; } catch {}

  // ensure the live DOM has loaded images (helps with sizing/measurement)
  await waitForImages(node);

  // build headshot -> dataURL map up front
  const allImgs = Array.from(node.querySelectorAll("img"));
  const headshots = allImgs
    .map((img) => img.currentSrc || img.src)
    .filter((src) => isSleeperHeadshot(src));

  const inlineMap = new Map();
  await Promise.all(
    headshots.map(async (src) => {
      if (!inlineMap.has(src)) {
        try {
          const data = await toDataURL(src);
          inlineMap.set(src, data);
        } catch {
          // ignore; we'll fall back to useCORS path
        }
      }
    })
  );

  const width = Math.ceil(node.scrollWidth);
  const height = Math.ceil(node.scrollHeight);

  const canvas = await html2canvas(node, {
    backgroundColor,
    scale,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    useCORS: true,        // allow normal CORS when available
    allowTaint: false,
    imageTimeout: 0,
    logging: false,

    onclone: (doc) => {
      // only touch headshots; leave everything else alone
      doc.querySelectorAll("img").forEach((img) => {
        const src = img.currentSrc || img.src || "";
        // load eagerly so html2canvas sees pixels
        if (img.getAttribute("loading") === "lazy") img.setAttribute("loading", "eager");
        img.setAttribute("decoding", "sync");

        if (isSleeperHeadshot(src)) {
          // prefer our inlined data URL
          const inline = inlineMap.get(src);
          if (inline) {
            img.setAttribute("src", inline);
          } else {
            // last resort: hint CORS for the clone fetch
            img.setAttribute("crossorigin", "anonymous");
            img.setAttribute("referrerpolicy", "no-referrer");
            // cache-bust to force re-request with CORS
            try {
              const u = new URL(src, window.location.href);
              u.searchParams.set("cb", Date.now().toString());
              img.setAttribute("src", u.toString());
            } catch {}
          }
        }
      });

      // (no element removals; no global filters turned off)
    },
  });

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
