import { useEffect } from "react";

export function useThemeBoot() {
  useEffect(() => {
    const stored = localStorage.getItem("aftermath-theme");
    document.documentElement.classList.toggle("light", stored === "light");
  }, []);
}
