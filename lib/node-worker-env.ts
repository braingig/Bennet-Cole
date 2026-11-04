/**
 * Next.js/Vercel has no Cloudflare Worker bindings. Public pages run natively;
 * consultation intake and staff authentication stay on the existing Sites host.
 * Do not trust Sites identity headers on the Vercel deployment.
 */
export const env: Cloudflare.Env = {};
