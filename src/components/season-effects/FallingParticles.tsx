import { motion } from 'framer-motion';
import type { FallingParticle } from './ParticleUtils';

export function FallingParticles({
  particles,
  className = '',
}: {
  particles: FallingParticle[];
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            opacity: p.opacity,
          }}
          // Use viewport units to avoid %/layout quirks — keeps animation working consistently.
          initial={{ y: '-20vh', x: 0, rotate: 0 }}
          animate={{ y: '120vh', x: p.drift, rotate: p.rotate }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

