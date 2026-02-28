export function isDebug(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';
}

export function debugLog(...args: any[]) {
  if (isDebug()) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}
