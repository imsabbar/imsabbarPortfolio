import 'server-only';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY?.trim();
  const devBypass = process.env.NODE_ENV !== 'production' && process.env.TURNSTILE_DEV_BYPASS === '1';

  if (!secret || !siteKey) {
    if (devBypass) {
      console.warn('[turnstile] development bypass active; configure keys before production.');
      return true;
    }
    return false;
  }
  if (!token) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error('[turnstile] verification failed', error instanceof Error ? error.message : error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
