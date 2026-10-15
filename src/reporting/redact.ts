export function redact(value: string): string {
  let text = value.replace(/\u001b\[[0-9;]*m/g, '');
  const secrets = Object.entries(process.env)
    .filter(
      ([name, secret]) =>
        secret && /PASSWORD|TOKEN|SECRET|WEB_USERNAME|WEB_EMAIL|ACCESS_KEY/i.test(name),
    )
    .map(([, secret]) => secret!)
    .sort((a, b) => b.length - a.length);
  for (const secret of secrets) text = text.split(secret).join('[REDACTED]');
  return text.replace(/https?:\/\/[^\s<>"']+/g, (raw) => {
    try {
      const url = new URL(raw);
      url.username = '';
      url.password = '';
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      return '[URL]';
    }
  });
}
