import { config } from 'dotenv';
import { resolve } from 'node:path';
const root = resolve(__dirname, '../..');
// Pipeline/process variables take precedence; auth file takes precedence over .env.
config({ path: resolve(root, '.env.auth'), override: false, quiet: true });
config({ path: resolve(root, '.env'), override: false, quiet: true });

export function getWebAuth() {
  const required = (name: string): string => {
    const value = process.env[name];
    if (!value?.trim())
      throw new Error(`Missing ${name}. Set it in .env.auth or the pipeline environment.`);
    return value;
  };
  const baseURL = required('WEB_BASE_URL');
  const url = new URL(baseURL);
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('WEB_BASE_URL must use HTTP or HTTPS.');
  return {
    baseURL,
    username: required('WEB_USERNAME'),
    password: required('WEB_PASSWORD'),
    // SauceDemo does not request an email. Reserved for scenarios that need one.
    email: process.env.WEB_EMAIL || '',
  };
}
