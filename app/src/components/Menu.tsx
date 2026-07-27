import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
  emphasized?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
}

const PANEL_ID = 'mobile-menu-panel';

function useFocusTrap(panelRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [panelRef, active]);
}

export function Menu({ items }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <nav aria-label="Primary">
      <ul className="hidden items-center gap-x-8 md:flex">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className={
                item.emphasized
                  ? 'text-brand border-brand hover:bg-brand hover:text-bg rounded border-2 px-4 py-2 transition-colors'
                  : 'text-text hover:text-brand transition-colors'
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((open) => !open)}
        className="text-text relative z-30 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          className={`bg-text block h-0.5 w-6 transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}
        />
        <span
          className={`bg-text block h-0.5 w-6 transition-opacity ${isOpen ? 'opacity-0' : ''}`}
        />
        <span
          className={`bg-text block h-0.5 w-6 transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={PANEL_ID}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduceMotion ? { opacity: 0 } : { x: 400, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-light-dark fixed top-0 right-0 z-20 flex h-dvh w-3/4 max-w-xs flex-col gap-y-6 p-8 pt-20 md:hidden"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={closeMenu}
                className={
                  item.emphasized
                    ? 'text-brand border-brand mt-4 self-start rounded border-2 px-4 py-2 text-lg transition-colors'
                    : 'text-text hover:text-brand text-lg transition-colors'
                }
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
