export const TEST_USER_EMAIL = "test@cvfy.sa";

export function isTestUserEmail(email?: string | null): boolean {
  return email === TEST_USER_EMAIL;
}
