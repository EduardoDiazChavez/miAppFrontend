import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function BrandLogo({ className = "", tone = "light" }: BrandLogoProps) {
  return (
    <div className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
        <Image
          src="/mrm-logo.png"
          alt="Logotipo de MRM"
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
          priority
        />
      </span>
      <span className="leading-tight">
        <span className={`block text-sm font-bold tracking-[0.12em] ${tone === "dark" ? "text-white" : "text-[#002679]"}`}>
          MRM
        </span>
        <span className={`mt-0.5 block text-[10px] ${tone === "dark" ? "text-white/70" : "text-slate-500"}`}>
          Plataforma MiApp
        </span>
      </span>
    </div>
  );
}
