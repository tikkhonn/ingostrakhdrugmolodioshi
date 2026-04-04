import { useMemo } from 'react';
import { FallingParticles } from './FallingParticles';
import { generateFallingParticles, type FallingParticle } from './ParticleUtils';

export function SnowEffect({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo((): FallingParticle[] => {
    const count = Math.max(26, Math.round(56 * intensity));
    const opacity = Math.max(0.28, 0.55 * intensity);
    const drift = 30 * intensity;
    const rotate = 42 * intensity;
    const durationMin = 9 / intensity;
    const durationMax = 14 / intensity;

    return generateFallingParticles(count, {
      xRange: [0, 100],
      sizeRange: [5, 12],
      durationRange: [durationMin, durationMax],
      delayRange: [0, 6],
      drift,
      rotate,
      color: 'var(--particle-snow)',
      opacity,
      borderRadius: '9999px',
    });
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <FallingParticles particles={particles} />
    </div>
  );
}

