import type { IconType } from 'react-icons';
import { FiGithub, FiLinkedin, FiMail, FiGlobe, FiCode, FiBriefcase } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

/**
 * Astro islands can't receive a component reference as a prop (functions
 * aren't JSON-serializable across the server -> client hydration boundary).
 * Islands that take an icon per data item (Socials, Timeline) reference one
 * by name through this registry instead of importing react-icons directly.
 */
export const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  mail: FiMail,
  globe: FiGlobe,
  code: FiCode,
  briefcase: FiBriefcase,
  x: FaXTwitter,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof ICONS;
