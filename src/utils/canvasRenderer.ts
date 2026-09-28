import { DesignElement, TextElement, ClipartElement, ImageElement } from '../types';

/**
 * Loads an SVG string into an HTMLImageElement
 */
export function loadSvgImage(svgContent: string, fill?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let processedSvg = svgContent;
    if (fill) {
      // Replace currentColor or primary stroke/fill
      processedSvg = processedSvg.replace(/currentColor/g, fill);
    }
    const blob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Loads an image from URL/dataURL
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Draws a curved text along an arc if specified
 */
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  angleRad: number
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  const totalLength = text.length;
  const step = angleRad / Math.max(1, totalLength - 1);
  const startAngle = -angleRad / 2;

  for (let i = 0; i < totalLength; i++) {
    const char = text[i];
    const angle = startAngle + i * step;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Render all design elements onto a Canvas context with scaling
 */
export async function renderElementsToCanvas(
  ctx: CanvasRenderingContext2D,
  elements: DesignElement[],
  scale: number = 1
) {
  for (const el of elements) {
    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;

    // Apply translation and rotation around the element's center
    const cx = (el.x + el.width / 2) * scale;
    const cy = (el.y + el.height / 2) * scale;
    ctx.translate(cx, cy);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.translate(-cx, -cy);

    const x = el.x * scale;
    const y = el.y * scale;
    const w = el.width * scale;
    const h = el.height * scale;

    if (el.type === 'text') {
      const textEl = el as TextElement;
      const fontSize = (textEl.fontSize || 20) * scale;
      const weight = textEl.isBold ? 'bold' : 'normal';
      const style = textEl.isItalic ? 'italic' : 'normal';
      ctx.font = `${style} ${weight} ${fontSize}px '${textEl.fontFamily || 'Cairo'}', sans-serif`;
      ctx.fillStyle = textEl.fill || '#1E293B';
      ctx.textAlign = textEl.align || 'center';
      ctx.textBaseline = 'middle';

      if (textEl.shadowColor && textEl.shadowBlur) {
        ctx.shadowColor = textEl.shadowColor;
        ctx.shadowBlur = textEl.shadowBlur * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
      }

      const textX = textEl.align === 'left' ? x : textEl.align === 'right' ? x + w : x + w / 2;
      const textY = y + h / 2;

      if (textEl.isCurved && textEl.curveRadius) {
        drawCurvedText(ctx, textEl.text, x + w / 2, textY, Math.abs(textEl.curveRadius) * scale, 0.8);
      } else {
        ctx.fillText(textEl.text, textX, textY);
      }

      if (textEl.stroke && textEl.strokeWidth) {
        ctx.strokeStyle = textEl.stroke;
        ctx.lineWidth = textEl.strokeWidth * scale;
        ctx.strokeText(textEl.text, textX, textY);
      }
    } else if (el.type === 'clipart') {
      const clipEl = el as ClipartElement;
      try {
        const img = await loadSvgImage(clipEl.svgContent, clipEl.fill);
        ctx.drawImage(img, x, y, w, h);
      } catch (err) {
        console.warn('Could not draw clipart:', err);
      }
    } else if (el.type === 'image') {
      const imgEl = el as ImageElement;
      try {
        const img = await loadImage(imgEl.src);
        if (imgEl.shape === 'circle') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, x, y, w, h);
          ctx.restore();
        } else {
          ctx.drawImage(img, x, y, w, h);
        }
      } catch (err) {
        console.warn('Could not draw image:', err);
      }
    }

    ctx.restore();
  }
}

/**
 * Exports production-ready 300 DPI transparent PNG for DTF / DTG printing
 */
export async function exportPrintReadyFile(
  elements: DesignElement[],
  originalWidth: number = 320,
  originalHeight: number = 380,
  dpi: number = 300
): Promise<{ dataUrl: string; width: number; height: number; dpi: number }> {
  // 300 DPI scaling factor relative to 72/96 web screen
  const scale = 5; // e.g. 320 * 5 = 1600px width for DTF transfer
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(originalWidth * scale);
  canvas.height = Math.round(originalHeight * scale);
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas 2d context');

  // Clear with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  await renderElementsToCanvas(ctx, elements, scale);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: canvas.width,
    height: canvas.height,
    dpi,
  };
}

/**
 * Downloads a dataUrl directly to the user's browser
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
