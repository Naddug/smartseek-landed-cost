/** Team roster ids — copy lives in locales under `teamPage.members.*` */
export const TEAM_MEMBER_IDS = ["harun", "muhsin"] as const;

export type TeamMemberId = (typeof TEAM_MEMBER_IDS)[number];

export type TeamMemberMeta = {
  id: TeamMemberId;
  /** Optional override; otherwise `teamPage.members.{id}.linkedinUrl` */
  linkedinPath?: string;
};

export const TEAM_MEMBERS: TeamMemberMeta[] = [
  { id: "harun", linkedinPath: "https://www.linkedin.com/in/harunkaya1985/" },
  { id: "muhsin" },
];
