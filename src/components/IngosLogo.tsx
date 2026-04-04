import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

type IngosLogoProps = {
  onClick?: () => void;
  className?: string;
};

export function IngosLogo({ onClick, className = '' }: IngosLogoProps) {
  const inner = (
    <>
      <motion.div
        className="flex h-10 w-10 items-center justify-center rounded-btn bg-[#0066CC] text-white shadow-md shadow-[#0066CC]/30"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      >
        <Shield className="h-6 w-6" strokeWidth={2} aria-hidden />
      </motion.div>
      <div className="flex min-w-0 flex-col leading-tight text-left">
        <span className="truncate text-base font-bold tracking-tight text-ingos-text-primary sm:text-lg">
          Ингосстрах
        </span>
        <span className="hidden text-[11px] font-medium uppercase tracking-wider text-ingos-text-secondary sm:block">
          Школа страхования для молодёжи
        </span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2.5 rounded-btn text-left outline-none ring-[#0066CC] focus-visible:ring-2 sm:gap-3 ${className}`}
        aria-label="На главную"
      >
        {inner}
      </motion.button>
    );
  }

  return <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>{inner}</div>;
}
