import React from 'react';
import styles from './Canvas.module.scss';

export type PaintCoords = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

interface CanvasProps {
  onPaint: (data: PaintCoords) => void;
  onInit: (ref: CanvasRenderingContext2D) => void;
  onClear: () => void;
}

const Canvas: React.FC<CanvasProps> = function Canvas({ onPaint, onInit, onClear }) {
  const rootRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.width = 600;
      rootRef.current.height = 600;
      const ctx = rootRef.current.getContext('2d');
      if (ctx) {
        onInit(ctx);
        ctx.lineCap = 'round';
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'black';
        rootRef.current.addEventListener('mousemove', (e) => {
          const x = e.offsetX;
          const y = e.offsetY;
          const dx = e.movementX;
          const dy = e.movementY;
          if (e.buttons > 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - dx, y - dy);
            ctx.stroke();
            ctx.closePath();

            onPaint({ x, y, dy, dx });
          }
        });
      }
    }
  }, []);
  const handleClickClear = () => {
    onClear();
    if (rootRef.current) {
      const ctx = rootRef.current.getContext('2d');
      ctx?.clearRect(0, 0, 600, 600);
    }
  };
  return (
    <div>
      <canvas ref={rootRef} className={styles.root} />
      <button onClick={handleClickClear}>clear</button>
    </div>
  );
};

export default Canvas;
