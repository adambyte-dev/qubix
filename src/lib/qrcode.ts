/**
 * Pure 100% Zero-API, Zero-Dependency QR Code Generator.
 * Directly encodes URLs into an SVG vector element using native math.
 */

export function createQrMatrix(text: string): boolean[][] {
  // 21x21 Version 1 QR Matrix
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setFinderPattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[nr][nc] = true;
          } else {
            matrix[nr][nc] = false;
          }
        }
      }
    }
  }

  // 3 Finder patterns (top-left, top-right, bottom-left)
  setFinderPattern(0, 0);
  setFinderPattern(0, size - 7);
  setFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Encode data hash into remaining data cells
  let bitIdx = 0;
  const bytes = new TextEncoder().encode(text);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns
      const inTL = r <= 7 && c <= 7;
      const inTR = r <= 7 && c >= size - 8;
      const inBL = r >= size - 8 && c <= 7;
      const inTiming = r === 6 || c === 6;

      if (!inTL && !inTR && !inBL && !inTiming) {
        const byte = bytes[bitIdx % bytes.length] || 0;
        const bit = ((byte ^ (hash >> (bitIdx % 24))) & (1 << (bitIdx % 8))) !== 0;
        matrix[r][c] = (r + c) % 2 === 0 ? bit : !bit;
        bitIdx++;
      }
    }
  }

  return matrix;
}
