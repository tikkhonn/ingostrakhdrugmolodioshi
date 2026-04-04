import { useMemo } from 'react';
import { FallingParticles } from './FallingParticles';
import { generateFallingParticles, type FallingParticle } from './ParticleUtils';

export function AutumnEffect({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo((): FallingParticle[] => {
    const count = Math.max(20, Math.round(48 * intensity));
    const opacity = Math.max(0.18, 0.32 * intensity);
    const drift = 34 * intensity;
    const rotate = 75 * intensity;
    const durationMin = 10 / intensity;
    const durationMax = 16 / intensity;

    return generateFallingParticles(count, {
      xRange: [0, 100],
      sizeRange: [7, 16],
      durationRange: [durationMin, durationMax],
      delayRange: [0, 6],
      drift,
      rotate,
      color: ['var(--particle-autumn-1)', 'var(--particle-autumn-2)', 'var(--particle-autumn-3)'],
      opacity,
      borderRadius: '20% 80% 60% 40% / 30% 40% 60% 70%',
    });
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <FallingParticles particles={particles} />
    </div>
  );
}

