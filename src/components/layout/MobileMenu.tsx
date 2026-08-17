"use client";

import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  navItems: NavItem[];
  becomeMemberLabel: string;
  openLabel: string;
  closeLabel: string;
};

export function MobileMenu({
  navItems,
  becomeMemberLabel,
  openLabel,
  closeLabel,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? closeLabel : openLabel}
        className="flex h-10 w-10 items-center justify-center rounded-md text-ivory transition-colors hover:text-gold"
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 cursor-default bg-navy/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        inert={!isOpen}
        className={`absolute inset-x-0 top-full z-50 overflow-hidden border-b border-gold/30 bg-navy shadow-lg transition-[max-height,opacity] duration-300 ease-in-out ${
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 pt-2 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-3 text-ivory/90 transition-colors hover:bg-ivory/10 hover:text-gold"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-6 mt-2 flex items-center justify-center border-t border-ivory/10 pt-4">
          <LanguageSwitcher />
        </div>
        <div className="px-6 pt-4 pb-6">
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold/90"
          >
            {becomeMemberLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
