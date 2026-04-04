import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

const tap = { scale: 0.97, transition: { type: 'spring' as const, stiffness: 550, damping: 28 } };
type MotionButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode;
};

/** Hover: quick scale-up + shadow. Transform только у Framer — без CSS transition на scale. */
export function MotionButton({ className = '', children, ...props }: MotionButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{
        scale: 1.07,
        transition: { type: 'spring', stiffness: 620, damping: 24, mass: 0.85 },
      }}
      whileTap={tap}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      className={`shadow-md transition-[box-shadow,background-color,color,border-color] duration-150 ease-out hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type MotionNavBtnProps = HTMLMotionProps<'button'> & { children: ReactNode };

export function MotionNavButton({ className = '', children, ...props }: MotionNavBtnProps) {
  return (
    <motion.button
      type="button"
      whileHover={{
        scale: 1.06,
        transition: { type: 'spring', stiffness: 650, damping: 26, mass: 0.85 },
      }}
      whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 550, damping: 28 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`transition-[color,background-color,box-shadow] duration-150 ease-out ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
