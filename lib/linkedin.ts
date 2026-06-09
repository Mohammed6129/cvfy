const LINKEDIN_PROFILE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?$/i;

export function isValidLinkedInUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  return LINKEDIN_PROFILE_REGEX.test(trimmed);
}

export function normalizeLinkedInUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const match = trimmed.match(LINKEDIN_PROFILE_REGEX);
  if (!match?.[1]) return trimmed;

  const username = match[1].toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `linkedin.com/in/${username}`;
}
