export function getClerkPublishableKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  return key && /^pk_(test|live)_/.test(key) ? key : null;
}

export function isClerkPubliclyConfigured() {
  return Boolean(getClerkPublishableKey());
}
