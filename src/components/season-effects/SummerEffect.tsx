import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';
import { generateFloatingParticles, type FloatingParticle } from './ParticleUtils';

export function SummerEffect({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo((): FloatingParticle[] => {
    const count = Math.max(12, Math.round(32 * intensity));
    const opacity = Math.max(0.16, 0.28 * intensity);
    const driftX = 18 * intensity;
    const driftY = 26 * intensity;
    const rotate = 35 * intensity;
    const durationMin = 9 / intensity;
    const durationMax = 14 / intensity;

    return generateFloatingParticles(count, {
      xRange: [0, 100],
      yRange: [10, 180],
      sizeRange: [5, 14],
      durationRange: [durationMin, durationMax],
      delayRange: [0, 6],
      driftX,
      driftY,
      rotate,
      color: ['var(--particle-summer-p1)', 'var(--particle-summer-p2)'],
      opacity,
      borderRadius: '9999px',
    });
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 50% 0%, var(--particle-summer-bg1), transparent 60%), ` +
            `radial-gradient(circle at 20% 20%, var(--particle-summer-bg2), transparent 50%)`,
        }}
        animate={{
          opacity: [0.10, 0.18, 0.10].map((v) => v * intensity),
          scale: [1, 1.01 + 0.03 * intensity, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sun rays: subtle static lines with slow bobbing */}
      {Array.from({ length: 7 }, (_, i) => {
        const angle = i * (180 / 7) - 60;
        const rayOpacity = 0.55 * intensity;
        const rayAmp = 10 * intensity;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-0 h-1/2 w-[2px] origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg)`,
              background: `linear-gradient(to bottom, rgba(0,163,255,0.0), var(--particle-summer-ray-end))`,
              opacity: rayOpacity,
            }}
            animate={{
              y: [0, -rayAmp, 0],
              opacity: [0.35, 0.50 + 0.12 * intensity, 0.35],
            }}
            transition={{ duration: 10 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}

      <FloatingParticles particles={particles} />
    </div>
  );
}

