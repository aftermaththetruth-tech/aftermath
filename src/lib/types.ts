export type Story = {
  id: string;
  userId: string;
  authorName: string;
  isAnonymous: boolean;
  title: string;
  body: string;
  medium: "text" | "voice";
  tags: string[];
  recoveryTime: string;
  theme: string;
  sparkVotes: number;
  createdAt: string;
};

export type Profile = {
  userId: string;
  displayName: string;
  isAnonymous: boolean;
  message: string;
  timeInRecovery: string;
  substances: string[];
  milestoneNote: string;
  createdAt: string;
  storyCount: number;
};

export type Spark = {
  id: string;
  body: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
};

export type Tribute = {
  id: string;
  userId: string;
  honoreeName: string;
  relationship: string;
  body: string;
  years: string;
  createdAt: string;
};

export type Circle = {
  id: string;
  name: string;
  stage: string;
  focus: string;
  description: string;
  memberCount: number;
  postCount: number;
};

export type CirclePost = {
  id: string;
  circleId: string;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Milestone = {
  id: string;
  label: string;
  occurredOn: string;
  note: string;
};

export type UrgeLog = {
  id: string;
  intensity: number;
  trigger: string;
  technique: string;
  note: string;
  createdAt: string;
};

export type RecoveryStart = {
  startedOn: string;
};
