import { useMemo } from 'react';
import { FallingParticles } from './FallingParticles';
import { generateFallingParticles, type FallingParticle } from './ParticleUtils';

export function SpringEffect({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo((): FallingParticle[] => {
    const count = Math.max(18, Math.round(44 * intensity));
    const opacity = Math.max(0.18, 0.34 * intensity);
    const drift = 20 * intensity;
    const rotate = 70 * intensity;
    const durationMin = 8 / intensity;
    const durationMax = 12 / intensity;

    return generateFallingParticles(count, {
      xRange: [0, 100],
      sizeRange: [4, 11],
      durationRange: [durationMin, durationMax],
      delayRange: [0, 6],
      drift,
      rotate,
      color: ['var(--particle-spring-1)', 'var(--particle-spring-2)'],
      opacity,
      borderRadius: '40% 60% 70% 30% / 60% 40% 60% 40%',
    });
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Petals-ish: subtle falling particles */}
      <FallingParticles particles={particles} />
    </div>
  );
}

