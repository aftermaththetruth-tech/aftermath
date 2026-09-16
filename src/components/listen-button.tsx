import { useEffect, useState } from "react";
import { Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ListenButton({ text, label = "Listen" }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function toggle() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (on) {
      window.speechSynthesis.cancel();
      setOn(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = () => setOn(false);
    u.onerror = () => setOn(false);
    window.speechSynthesis.speak(u);
    setOn(true);
  }

  return (
    <Button type="button" variant="outline" onClick={toggle}>
      {on ? <Pause /> : <Volume2 />}
      {on ? "Stop" : label}
    </Button>
  );
}
