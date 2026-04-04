export type FallingParticle = {
  id: string;
  x: number; // 0..100 (percent)
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  drift: number; // px (sideways)
  rotate: number; // deg
  opacity: number; // 0..1
  color: string;
  borderRadius: string;
};

export type FloatingParticle = {
  id: string;
  x: number; // 0..100 (percent)
  y: number; // px from top
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px
  driftY: number; // px
  rotate: number; // deg
  opacity: number; // 0..1
  color: string;
  borderRadius: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateFallingParticles(
  count: number,
  cfg: Omit<FallingParticle, 'id' | 'x' | 'size' | 'duration' | 'delay' | 'color'> & {
    xRange: [number, number];
    sizeRange: [number, number];
    durationRange: [number, number];
    delayRange: [number, number];
    color: string | string[];
  }
) {
  return Array.from({ length: count }, (_, i) => {
    const x = rand(cfg.xRange[0], cfg.xRange[1]);
    const size = rand(cfg.sizeRange[0], cfg.sizeRange[1]);
    const duration = rand(cfg.durationRange[0], cfg.durationRange[1]);
    const delay = rand(cfg.delayRange[0], cfg.delayRange[1]);
    const color = Array.isArray(cfg.color) ? cfg.color[i % cfg.color.length] : cfg.color;

    return {
      id: `${i}-${Math.round(x * 10)}`,
      x,
      size,
      duration,
      delay,
      drift: rand(-cfg.drift, cfg.drift),
      rotate: rand(-cfg.rotate, cfg.rotate),
      opacity: rand(cfg.opacity, Math.min(1, cfg.opacity + 0.15)),
      color,
      borderRadius: cfg.borderRadius,
    };
  });
}

export function generateFloatingParticles(
  count: number,
  cfg: Omit<FloatingParticle, 'id' | 'x' | 'size' | 'duration' | 'delay' | 'y' | 'color'> & {
    xRange: [number, number];
    yRange: [number, number];
    sizeRange: [number, number];
    durationRange: [number, number];
    delayRange: [number, number];
    color: string | string[];
  }
) {
  return Array.from({ length: count }, (_, i) => {
    const x = rand(cfg.xRange[0], cfg.xRange[1]);
    const y = rand(cfg.yRange[0], cfg.yRange[1]);
    const size = rand(cfg.sizeRange[0], cfg.sizeRange[1]);
    const duration = rand(cfg.durationRange[0], cfg.durationRange[1]);
    const delay = rand(cfg.delayRange[0], cfg.delayRange[1]);
    const color = Array.isArray(cfg.color) ? cfg.color[i % cfg.color.length] : cfg.color;

    return {
      id: `${i}-${Math.round(x * 10)}`,
      x,
      y,
      size,
      duration,
      delay,
      driftX: rand(-cfg.driftX, cfg.driftX),
      driftY: rand(-cfg.driftY, cfg.driftY),
      rotate: rand(-cfg.rotate, cfg.rotate),
      opacity: rand(cfg.opacity, Math.min(1, cfg.opacity + 0.15)),
      color,
      borderRadius: cfg.borderRadius,
    };
  });
}

