"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export type UserMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
};

interface UserMenuProps {
  displayName: string;
  initials: string;
  items: UserMenuItem[];
  align?: "left" | "right";
  triggerClassName?: string;
}

export function UserMenu({
  displayName,
  initials,
  items,
  align = "right",
  triggerClassName,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-stone-100",
          triggerClassName
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-medium text-white">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate font-medium text-stone-800 sm:inline">
          {displayName}
        </span>
        <ChevronDown className="h-4 w-4 text-stone-500" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-1 min-w-[180px] rounded-lg border border-stone-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => {
            const className = cn(
              "block w-full px-3 py-2 text-left text-sm transition-colors",
              item.variant === "danger"
                ? "text-red-600 hover:bg-red-50"
                : "text-stone-700 hover:bg-stone-50"
            );

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={className}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function signOutUser() {
  signOut({ callbackUrl: "/" });
}
