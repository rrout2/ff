import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Exports a DOM node sized 1920x1080 to a landscape PDF (scales to A4 width)
export async function exportNodeAsPdf(node, filename = 'whiteboard.pdf') {
  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: 2,            // higher = sharper
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation:'landscape', unit:'pt', format:'a4' });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // keep aspect ratio of 1920x1080 inside A4 landscape
  const imgW = pageW - 32;              // left/right margin
  const imgH = (imgW * 1080) / 1920;
  const x = 16;
  const y = (pageH - imgH) / 2;

  pdf.addImage(imgData, 'PNG', x, y, imgW, imgH);
  pdf.save(filename);
}
