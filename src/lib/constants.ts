export const APP_NAME = "Aftermath";
export const APP_SUBTITLE = "The Truth";
export const APP_TAGLINE = "We survived. Now we speak.";
export const APP_CREATOR = "Lyndsay Belcoure";
export const APP_CREATOR_ROLE = "Creator · CEO";

export const THEMES = [
  { id: "rock-bottom", label: "Rock bottom" },
  { id: "first-year", label: "First year" },
  { id: "family", label: "Family" },
  { id: "relapse-return", label: "Relapse & return" },
  { id: "purpose", label: "Finding purpose" },
  { id: "still-here", label: "Still here" },
] as const;

export const SUBSTANCES = [
  { id: "alcohol", label: "Alcohol" },
  { id: "opioids", label: "Opioids" },
  { id: "stimulants", label: "Stimulants" },
  { id: "cannabis", label: "Cannabis" },
  { id: "gambling", label: "Gambling" },
  { id: "nicotine", label: "Nicotine" },
  { id: "other", label: "Other" },
] as const;

export const RECOVERY_TIMES = [
  { id: "early", label: "Under 90 days" },
  { id: "first-year", label: "First year" },
  { id: "1-5", label: "1–5 years" },
  { id: "5-plus", label: "5+ years" },
] as const;

export const GROUNDING = [
  {
    id: "halt",
    label: "HALT",
    summary: "Hungry, Angry, Lonely, Tired — meet the need first.",
    steps: [
      "Have you eaten today?",
      "Are you angry at a person, or at the feeling?",
      "Who can you text right now, even if it's just 'hey'?",
      "Can you lie down for twenty minutes before you decide anything?",
    ],
  },
  {
    id: "senses",
    label: "5-4-3-2-1",
    summary: "Come back to the room you're actually in.",
    steps: [
      "Name 5 things you can see.",
      "Name 4 things you can feel (chair, shirt, air).",
      "Name 3 things you can hear.",
      "Name 2 things you can smell.",
      "Name 1 thing you can taste.",
    ],
  },
  {
    id: "box",
    label: "Box breathing",
    summary: "In 4, hold 4, out 4, hold 4. Repeat four times.",
    steps: ["Breathe in for 4", "Hold for 4", "Breathe out for 4", "Hold for 4"],
  },
  {
    id: "surf",
    label: "Urge surfing",
    summary: "The wave peaks. You don't have to ride it to shore.",
    steps: [
      "Notice where the urge sits in your body.",
      "Rate it 1–10 without arguing with it.",
      "Wait 10 minutes. Drink water. Do not decide yet.",
      "Rate it again. Most waves drop without a fight.",
    ],
  },
  {
    id: "call",
    label: "Call before you decide",
    summary: "Voice first. Decision second.",
    steps: [
      "Pick one person or a helpline.",
      "Say out loud: 'I am having an urge and I have not used.'",
      "Stay on the line for five minutes.",
    ],
  },
] as const;

export const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    detail: "Call or text 988 in the US and Canada. 24/7.",
    href: "tel:988",
    action: "Call 988",
  },
  {
    name: "Crisis Text Line",
    detail: "Text HOME to 741741 in the US.",
    href: "sms:741741?body=HOME",
    action: "Text HOME",
  },
  {
    name: "SAMHSA National Helpline",
    detail: "Treatment referral and information. 1-800-662-4357.",
    href: "tel:18006624357",
    action: "Call SAMHSA",
  },
  {
    name: "FindTreatment.gov",
    detail: "US locator for detox, treatment, and recovery services.",
    href: "https://findtreatment.gov",
    action: "Find treatment",
  },
  {
    name: "IASP",
    detail: "Local crisis resources outside the US.",
    href: "https://www.iasp.info/suicidalthoughts/",
    action: "International help",
  },
] as const;

export const MEETING_FINDERS = [
  { name: "Alcoholics Anonymous", href: "https://www.aa.org/find-aa" },
  { name: "Narcotics Anonymous", href: "https://www.na.org/meetingsearch/" },
  { name: "SMART Recovery", href: "https://smartrecovery.org/community" },
  { name: "Al-Anon Family Groups", href: "https://al-anon.org/al-anon-meetings/" },
  { name: "Gamblers Anonymous", href: "https://www.gamblersanonymous.org/ga/locator" },
] as const;

export function themeLabel(id: string) {
  return THEMES.find((t) => t.id === id)?.label ?? id;
}

export function substanceLabel(id: string) {
  return SUBSTANCES.find((s) => s.id === id)?.label ?? id;
}

export function recoveryLabel(id: string) {
  return RECOVERY_TIMES.find((t) => t.id === id)?.label ?? id;
}
