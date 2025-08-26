import html2canvas from "html2canvas";

const waitForFonts = async () => {
  try { if (document.fonts?.ready) await document.fonts.ready; } catch {}
};

const dims = (node) => ({
  width:  Math.ceil(node.scrollWidth),
  height: Math.ceil(node.scrollHeight),
});

export async function exportNodeAsPng(node, filename = "whiteboard.png", opts = {}) {
  if (!node) return;

  // Tag the root so we can find it in the clone
  node.setAttribute("data-export-root", "1");

  await waitForFonts();

  const { width, height } = dims(node);
  const scale = opts.scale ?? Math.max(2, Math.min(4, window.devicePixelRatio * 2));

  const canvas = await html2canvas(node, {
    backgroundColor: opts.backgroundColor ?? "#ffffff",
    scale,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    useCORS: true,
    allowTaint: false,
    imageTimeout: 0,
    removeContainer: true,
    foreignObjectRendering: false, // most reliable; we’ll fall back if you want later
    logging: false,
    onclone: (doc) => {
      const root = doc.querySelector('[data-export-root="1"]');

      // Remove HUD/overlays from export only
      doc.querySelectorAll(".no-export, .wb-hud").forEach((el) => el && el.remove());

      // Make image tweaks IN THE CLONE ONLY (don’t touch your live preview)
      const imgs = Array.from(root.querySelectorAll("img"));
      imgs.forEach((img) => {
        try {
          const src = img.currentSrc || img.src || "";
          if (!src) return;

          const crossOrigin =
            /^https?:\/\//i.test(src) &&
            !src.startsWith(window.location.origin) &&
            !src.startsWith("data:") &&
            !src.startsWith("blob:");

          if (crossOrigin) {
            // ask for CORS in the clone
            img.setAttribute("crossorigin", "anonymous");
            img.setAttribute("referrerpolicy", "no-referrer");
            // cache-bust in the clone so it reloads with CORS headers
            const u = new URL(src, window.location.href);
            u.searchParams.set("cb", Date.now().toString());
            img.src = u.toString();
          }

          if (img.getAttribute("loading") === "lazy") img.setAttribute("loading", "eager");
          img.setAttribute("decoding", "sync");
        } catch {}
      });

      // Stabilize rendering in the clone
      const style = doc.createElement("style");
      style.textContent = `
        [data-export-root="1"], [data-export-root="1"] * {
          -webkit-font-smoothing: antialiased !important;
          text-rendering: geometricPrecision !important;
          animation: none !important;
          transition: none !important;
          filter: none !important;
        }
      `;
      doc.head.appendChild(style);
    },
  });

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
