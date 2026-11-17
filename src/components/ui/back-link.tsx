import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";

type BackLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: string;
};

export function BackLink({ children="", className = "", ...props }: BackLinkProps) {
  return (
    <Link
      {...props}
      className={` inline-flex w-fit items-center gap-2 px-3 text-sm font-medium text-slate-600 transition hover:text-[#002679] focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2 ${className}`}
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      {children}
    </Link>
  );
}
