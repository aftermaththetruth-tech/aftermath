import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return <Skeleton className="h-11 w-24 rounded-md" />;
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? "You";

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/people/me"
        className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm hover:bg-accent"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-medium">
            {label.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden max-w-28 truncate sm:inline">{label}</span>
      </Link>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={signingOut}
        aria-label="Sign out"
        onClick={() => {
          setSigningOut(true);
          void signOut().catch(() => setSigningOut(false));
        }}
      >
        <LogOut />
      </Button>
    </div>
  );
}
