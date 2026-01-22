export const sumRem = (rem1: string, rem2: string) => `${parseFloat(rem1) + parseFloat(rem2)}rem`;

const DEFAULT_BASE_FONT_SIZE = 16;

const getBaseFontSize = () => {
  const computedSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--base-font-size'));
  return computedSize || DEFAULT_BASE_FONT_SIZE;
};

const baseFontSize = getBaseFontSize();

export const pxToRem = (px: number) => {
  return `${px / baseFontSize}rem`;
};
