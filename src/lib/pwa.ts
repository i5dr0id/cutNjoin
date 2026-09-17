const splashScreens = [
  { width: 1320, height: 2868, ratio: 3 },
  { width: 1206, height: 2622, ratio: 3 },
  { width: 1290, height: 2796, ratio: 3 },
  { width: 1179, height: 2556, ratio: 3 },
  { width: 1284, height: 2778, ratio: 3 },
  { width: 1170, height: 2532, ratio: 3 },
  { width: 1125, height: 2436, ratio: 3 },
  { width: 1242, height: 2688, ratio: 3 },
  { width: 828, height: 1792, ratio: 2 },
  { width: 750, height: 1334, ratio: 2 },
  { width: 2048, height: 2732, ratio: 2 },
  { width: 1668, height: 2388, ratio: 2 },
  { width: 1640, height: 2360, ratio: 2 },
  { width: 1536, height: 2048, ratio: 2 },
];

export const appleStartupImages = splashScreens.map(({ width, height, ratio }) => ({
  url: `/pwa/splash-${width}x${height}.png`,
  media: `(device-width: ${width / ratio}px) and (device-height: ${height / ratio}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
}));
