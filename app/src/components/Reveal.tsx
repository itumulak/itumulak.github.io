import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export interface RevealProps {
  children: ReactNode;
  /** default 0 */
  delay?: number;
  /** default 24, px */
  y?: number;
  /** default true */
  once?: boolean;
  /** default 0.2, viewport fraction */
  amount?: number;
}

/**
 * Shared scroll-reveal primitive. At most one Reveal wraps a given subtree;
 * a component needing staggered children sequences them with `delay` on
 * siblings, never by nesting one Reveal inside another.
 */
export function Reveal({ children, delay = 0, y = 24, once = true, amount = 0.2 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once, amount });

  if (reduceMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
