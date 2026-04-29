import type { TranslationKey } from "./i18n";

export type ThemeMode = "light" | "dark" | "system";
export type StyleMode = "harmony" | "forest" | "sunset";

export type HabitField =
  | "sleepSchedule"
  | "studyNoise"
  | "cleanliness"
  | "visitors"
  | "roomTemperature"
  | "sharingStyle"
  | "conflictStyle";

export type HabitSurvey = Record<HabitField, string> & {
  notes: string;
};

export type DormProfile = {
  displayName: string;
  bio: string;
  roommateGoal: string;
  mbti: string;
  hobbies: string;
  sleepTime: string;
  cleanliness: string;
  noiseTolerance: string;
  preferredTemp: string;
  avatarUrl: string;
};

export type CommunityQuestion = {
  id: string;
  prompt: string;
};

export type DormUserMetadata = Record<string, unknown> & {
  dormProfile: DormProfile;
  habitSurvey: HabitSurvey;
  customQuestions: CommunityQuestion[];
  joinedPool: boolean;
  lastJoinedAt?: string;
};

export type SerializedAppUser = {
  id: string;
  email: string;
  metadata: Record<string, unknown>;
};

export type SurveyQuestion = {
  id: HabitField;
  labelKey: TranslationKey;
  options: Array<{
    value: string;
    labelKey: TranslationKey;
  }>;
};

export type DemoMatchProfile = {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  tags: string[];
  habits: Record<HabitField, string>;
  publicProfile: {
    mbti: string;
    sleepTime: string;
    temperature: string;
    noise: string;
  };
  starterQuestions: string[];
};

export type MatchResult = {
  profile: DemoMatchProfile;
  score: number;
  matchedFields: HabitField[];
};

type StructuredCommunityPayload = {
  version: 1;
  body: string;
  imageUrl?: string;
  questions?: string[];
  authorName?: string;
  roommateGoal?: string;
  tags?: string[];
};

export type ParsedCommunityPayload = {
  body: string;
  imageUrl?: string;
  questions: string[];
  authorName?: string;
  roommateGoal?: string;
  tags: string[];
  isLegacy: boolean;
};

export const styleModes: StyleMode[] = ["harmony", "forest", "sunset"];

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "sleepSchedule",
    labelKey: "questionSleepSchedule",
    options: [
      { value: "early", labelKey: "optionEarlySleep" },
      { value: "mid", labelKey: "optionMidSleep" },
      { value: "late", labelKey: "optionLateSleep" },
    ],
  },
  {
    id: "studyNoise",
    labelKey: "questionStudyNoise",
    options: [
      { value: "quiet", labelKey: "optionQuiet" },
      { value: "balanced", labelKey: "optionBalanced" },
      { value: "lively", labelKey: "optionLively" },
    ],
  },
  {
    id: "cleanliness",
    labelKey: "questionCleanliness",
    options: [
      { value: "daily", labelKey: "optionDaily" },
      { value: "weekly", labelKey: "optionWeekly" },
      { value: "flexible", labelKey: "optionFlexible" },
    ],
  },
  {
    id: "visitors",
    labelKey: "questionVisitors",
    options: [
      { value: "rare", labelKey: "optionRareVisitors" },
      { value: "occasional", labelKey: "optionOccasionalVisitors" },
      { value: "open", labelKey: "optionOpenVisitors" },
    ],
  },
  {
    id: "roomTemperature",
    labelKey: "questionRoomTemperature",
    options: [
      { value: "cool", labelKey: "optionCool" },
      { value: "neutral", labelKey: "optionNeutral" },
      { value: "warm", labelKey: "optionWarm" },
    ],
  },
  {
    id: "sharingStyle",
    labelKey: "questionSharingStyle",
    options: [
      { value: "ask-first", labelKey: "optionAskFirst" },
      { value: "basics-shared", labelKey: "optionBasicsShared" },
      { value: "very-open", labelKey: "optionVeryOpen" },
    ],
  },
  {
    id: "conflictStyle",
    labelKey: "questionConflictStyle",
    options: [
      { value: "direct", labelKey: "optionDirect" },
      { value: "gentle", labelKey: "optionGentle" },
      { value: "text-first", labelKey: "optionTextFirst" },
    ],
  },
];

export const demoMatchProfiles: DemoMatchProfile[] = [
  {
    id: "hana",
    name: "Hana",
    tagline: "Quiet routine, warm communication",
    bio: "Keeps a clean desk, sleeps early, and likes setting expectations before conflict has a chance to grow.",
    tags: ["Quiet", "Warm", "Predictable"],
    habits: {
      sleepSchedule: "early",
      studyNoise: "quiet",
      cleanliness: "daily",
      visitors: "occasional",
      roomTemperature: "neutral",
      sharingStyle: "ask-first",
      conflictStyle: "gentle",
    },
    publicProfile: {
      mbti: "INFJ",
      sleepTime: "11:00 PM",
      temperature: "24 C",
      noise: "Low",
    },
    starterQuestions: [
      "How do you handle lights-out time before exams?",
      "Would you rather talk through a problem on the same day or wait until morning?",
    ],
  },
  {
    id: "marcus",
    name: "Marcus",
    tagline: "Clear rules, relaxed personality",
    bio: "Friendly and easygoing, but happiest when expectations about guests and shared items are stated up front.",
    tags: ["Direct", "Flexible", "Boundary-aware"],
    habits: {
      sleepSchedule: "mid",
      studyNoise: "balanced",
      cleanliness: "weekly",
      visitors: "occasional",
      roomTemperature: "warm",
      sharingStyle: "basics-shared",
      conflictStyle: "direct",
    },
    publicProfile: {
      mbti: "ENTP",
      sleepTime: "12:15 AM",
      temperature: "25 C",
      noise: "Medium",
    },
    starterQuestions: [
      "What counts as a quick visit versus a guest staying too long?",
      "Which shared items should always be replaced immediately?",
    ],
  },
  {
    id: "ray",
    name: "Ray",
    tagline: "Study-first and very steady",
    bio: "Prefers a quiet room, regular cleanup, and honest conversations when something feels off.",
    tags: ["Study-first", "Tidy", "Calm"],
    habits: {
      sleepSchedule: "mid",
      studyNoise: "quiet",
      cleanliness: "daily",
      visitors: "rare",
      roomTemperature: "cool",
      sharingStyle: "ask-first",
      conflictStyle: "direct",
    },
    publicProfile: {
      mbti: "INTJ",
      sleepTime: "12:00 AM",
      temperature: "22 C",
      noise: "Low",
    },
    starterQuestions: [
      "Do you need silence after a certain hour?",
      "How strict are you about cleaning up shared surfaces right away?",
    ],
  },
  {
    id: "yuna",
    name: "Yuna",
    tagline: "Balanced, social, and still considerate",
    bio: "Likes a warm room, occasional visitors, and solving misunderstandings before they become awkward.",
    tags: ["Social", "Gentle", "Open"],
    habits: {
      sleepSchedule: "late",
      studyNoise: "balanced",
      cleanliness: "weekly",
      visitors: "open",
      roomTemperature: "warm",
      sharingStyle: "very-open",
      conflictStyle: "gentle",
    },
    publicProfile: {
      mbti: "ENFP",
      sleepTime: "1:00 AM",
      temperature: "25 C",
      noise: "Medium",
    },
    starterQuestions: [
      "How much notice do you want before someone comes by?",
      "What kind of weekend noise feels reasonable to you?",
    ],
  },
];

const COMMUNITY_PREFIX = "__DORM_HARMONY_POST__::";

export function serializeAppUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): SerializedAppUser {
  return {
    id: user.id,
    email: user.email ?? "",
    metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
  };
}

export function buildDefaultProfile(email: string) {
  return {
    displayName: getEmailName(email),
    bio: "",
    roommateGoal: "",
    mbti: "",
    hobbies: "",
    sleepTime: "",
    cleanliness: "",
    noiseTolerance: "",
    preferredTemp: "",
    avatarUrl: "",
  } satisfies DormProfile;
}

export function buildDefaultSurvey() {
  return {
    sleepSchedule: "",
    studyNoise: "",
    cleanliness: "",
    visitors: "",
    roomTemperature: "",
    sharingStyle: "",
    conflictStyle: "",
    notes: "",
  } satisfies HabitSurvey;
}

export function buildDefaultQuestions() {
  return [
    { id: createId(), prompt: "" },
    { id: createId(), prompt: "" },
  ] satisfies CommunityQuestion[];
}

export function normalizeDormMetadata(
  raw: Record<string, unknown> | null | undefined,
  email: string
): DormUserMetadata {
  const base = raw && typeof raw === "object" ? raw : {};
  const profileSource =
    base.dormProfile && typeof base.dormProfile === "object"
      ? (base.dormProfile as Partial<DormProfile>)
      : {};
  const surveySource =
    base.habitSurvey && typeof base.habitSurvey === "object"
      ? (base.habitSurvey as Partial<HabitSurvey>)
      : {};

  const questionSource = Array.isArray(base.customQuestions)
    ? base.customQuestions
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const prompt = typeof item.prompt === "string" ? item.prompt : "";
          return {
            id:
              typeof item.id === "string" && item.id.trim().length > 0
                ? item.id
                : createId(),
            prompt,
          };
        })
        .filter((item): item is CommunityQuestion => item !== null)
    : [];

  return {
    ...base,
    dormProfile: {
      ...buildDefaultProfile(email),
      ...profileSource,
    },
    habitSurvey: {
      ...buildDefaultSurvey(),
      ...surveySource,
    },
    customQuestions:
      questionSource.length > 0 ? questionSource : buildDefaultQuestions(),
    joinedPool: Boolean(base.joinedPool),
    lastJoinedAt:
      typeof base.lastJoinedAt === "string" ? base.lastJoinedAt : undefined,
  };
}

export function calculateSurveyCompletion(survey: HabitSurvey) {
  const total = surveyQuestions.length;
  const answered = surveyQuestions.filter((question) => survey[question.id]).length;
  return Math.round((answered / total) * 100);
}

export function calculateProfileCompletion(profile: DormProfile) {
  const fields = [
    profile.displayName,
    profile.bio,
    profile.roommateGoal,
    profile.hobbies,
    profile.sleepTime,
    profile.cleanliness,
    profile.noiseTolerance,
    profile.preferredTemp,
  ];
  const filled = fields.filter((field) => field.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export function getMatchResults(survey: HabitSurvey): MatchResult[] {
  return demoMatchProfiles
    .map((profile) => {
      const matchedFields = surveyQuestions
        .map((question) => question.id)
        .filter((field) => survey[field] && survey[field] === profile.habits[field]);

      const answeredFields = surveyQuestions.filter(
        (question) => survey[question.id]
      ).length;
      const score =
        answeredFields === 0
          ? 0
          : Math.round((matchedFields.length / answeredFields) * 100);

      return {
        profile,
        score,
        matchedFields,
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getMatchTone(score: number) {
  if (score >= 72) return "strong";
  if (score >= 45) return "moderate";
  return "light";
}

export function getEmailName(email: string) {
  const source = email.split("@")[0]?.trim();
  return source ? source.slice(0, 18) : "";
}

export function createStructuredPostContent(payload: {
  body: string;
  imageUrl?: string;
  questions?: string[];
  authorName?: string;
  roommateGoal?: string;
  tags?: string[];
}) {
  const normalized: StructuredCommunityPayload = {
    version: 1,
    body: payload.body,
    imageUrl: payload.imageUrl || undefined,
    questions: (payload.questions ?? []).filter(Boolean),
    authorName: payload.authorName || undefined,
    roommateGoal: payload.roommateGoal || undefined,
    tags: (payload.tags ?? []).filter(Boolean),
  };

  return `${COMMUNITY_PREFIX}${JSON.stringify(normalized)}`;
}

export function parseStructuredPostContent(content: string): ParsedCommunityPayload {
  if (!content.startsWith(COMMUNITY_PREFIX)) {
    return {
      body: content,
      imageUrl: undefined,
      questions: [],
      authorName: undefined,
      roommateGoal: undefined,
      tags: [],
      isLegacy: true,
    };
  }

  try {
    const parsed = JSON.parse(
      content.slice(COMMUNITY_PREFIX.length)
    ) as StructuredCommunityPayload;

    return {
      body: typeof parsed.body === "string" ? parsed.body : "",
      imageUrl: typeof parsed.imageUrl === "string" ? parsed.imageUrl : undefined,
      questions: Array.isArray(parsed.questions)
        ? parsed.questions.filter(
            (question): question is string => typeof question === "string" && question.trim().length > 0
          )
        : [],
      authorName:
        typeof parsed.authorName === "string" ? parsed.authorName : undefined,
      roommateGoal:
        typeof parsed.roommateGoal === "string"
          ? parsed.roommateGoal
          : undefined,
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter(
            (tag): tag is string => typeof tag === "string" && tag.trim().length > 0
          )
        : [],
      isLegacy: false,
    };
  } catch {
    return {
      body: content,
      imageUrl: undefined,
      questions: [],
      authorName: undefined,
      roommateGoal: undefined,
      tags: [],
      isLegacy: true,
    };
  }
}

export function buildProfileTags(profile: DormProfile) {
  return [profile.mbti, profile.cleanliness, profile.noiseTolerance]
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function createId() {
  return Math.random().toString(36).slice(2, 10);
}
