import { Phone } from "lucide-react";

export function CrisisBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl bg-secondary px-4 py-3 text-sm shadow-[var(--shadow-border)]">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Phone className="size-4 text-primary" />
        <span className="text-muted-foreground">
          {compact
            ? "If you are in crisis, call or text 988."
            : "If you are in immediate danger or thinking of suicide, call or text 988. You are not alone."}
        </span>
        <a
          href="tel:988"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Call 988
        </a>
      </p>
    </div>
  );
}
