import React from 'react';

// Generates a deterministic high-density 2D QR-matrix visualization for any payload string
const QRCodeView = ({ value = 'IMOVIES-TICKET', size = 160 }) => {
  // Simple deterministic pseudorandom matrix from value string
  const gridSize = 25;
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString(value);

  // Determine if a cell in the 25x25 grid is filled
  const isFilled = (r, c) => {
    // 3 corner alignment finder squares (7x7)
    // Top-left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right
    if (r < 7 && c >= gridSize - 7) {
      const cc = c - (gridSize - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) {
      const rr = r - (gridSize - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Timing pattern bars
    if (r === 6 || c === 6) {
      return (r + c) % 2 === 0;
    }

    // Pseudorandom data bits derived from value + position
    const val = (seed * (r + 1) * 31 + c * 17 + (r ^ c)) % 100;
    return val > 44;
  };

  const cellSize = size / gridSize;

  return (
    <div className="inline-block p-3 bg-white rounded-xl shadow-md border border-slate-200">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => {
            if (isFilled(r, c)) {
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize + 0.3}
                  height={cellSize + 0.3}
                  fill="#0f172a"
                />
              );
            }
            return null;
          })
        )}
      </svg>
      <div className="text-[10px] text-center font-mono font-bold text-slate-700 mt-1 uppercase tracking-wider">
        SCAN AT GATE
      </div>
    </div>
  );
};

export default QRCodeView;
