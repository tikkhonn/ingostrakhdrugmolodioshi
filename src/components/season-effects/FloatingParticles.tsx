import { motion } from 'framer-motion';
import type { FloatingParticle } from './ParticleUtils';

export function FloatingParticles({
  particles,
  className = '',
}: {
  particles: FloatingParticle[];
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            left: `${p.x}%`,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            opacity: p.opacity,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: p.opacity * 0.6 }}
          animate={{ x: p.driftX, y: p.driftY, rotate: p.rotate, opacity: p.opacity }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

