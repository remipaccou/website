// A stamp that changes at every build. Each page carries it and compares it
// with /version.txt, so a browser holding an old copy reloads the new one.
export const buildId = Date.now().toString(36);
