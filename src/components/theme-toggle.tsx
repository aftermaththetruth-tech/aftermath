import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "aftermath-theme";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next = stored === "light";
    setLight(next);
    document.documentElement.classList.toggle("light", next);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem(KEY, next ? "light" : "dark");
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}
