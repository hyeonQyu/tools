export const generateRandomKey = (prefix?: string) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  const key = `${timestamp}-${randomStr}`;
  return prefix ? `${prefix}-${key}` : key;
};
