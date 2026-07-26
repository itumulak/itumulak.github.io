import { motion, useReducedMotion } from 'framer-motion';
import { ICONS, type IconName } from './icons';

export interface SocialLink {
  name: string;
  url: string;
  icon: IconName;
}

export interface SocialsProps {
  data: SocialLink[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

export function Socials({ data }: SocialsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={reduceMotion ? undefined : containerVariants}
      className="flex items-center gap-x-4"
    >
      {data.map(({ name, url, icon }) => {
        const Icon = ICONS[icon];
        return (
          <motion.li key={name} variants={reduceMotion ? undefined : itemVariants}>
            <motion.a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              whileHover={reduceMotion ? undefined : { scale: 1.2 }}
              className="text-text hover:text-brand block text-xl transition-colors"
            >
              <Icon aria-hidden="true" />
            </motion.a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
