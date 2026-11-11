import { Button } from "@/src/components/ui/button";

type SocialButtonProps = {
  provider: "Google" | "Microsoft" | "Apple";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const providerStyles: Record<SocialButtonProps["provider"], string> = {
  Google: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
  Microsoft: "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100",
  Apple: "bg-slate-900 text-white border-slate-900 hover:bg-slate-800",
};

const providerIcons: Record<SocialButtonProps["provider"], string> = {
  Google: "G",
  Microsoft: "M",
  Apple: "",
};

export function SocialButton({
  provider,
  onClick,
  disabled = false,
  loading = false,
}: SocialButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={provider === "Apple" ? "default" : "outline"}
      className={`flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-6 text-sm font-medium ${providerStyles[provider]}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-base font-bold shadow-sm">
        {loading ? "..." : providerIcons[provider]}
      </span>
      {loading ? "Accediendo..." : `Continuar con ${provider}`}
    </Button>
  );
}
