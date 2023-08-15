export type RgbColor = [r: number, g: number, b: number];

export const interpolateChannels = (
  oldChannels: RgbColor[],
  newChannels: RgbColor[],
  steps: number
): RgbColor[][] => {
  const interpolated = oldChannels.map((oldColor, i) =>
    interpolateColor(oldColor, newChannels[i], steps)
  );

  return new Array(steps)
    .fill(0)
    .map((_, i) =>
      new Array(oldChannels.length).fill(0).map((_, j) => interpolated[j][i])
    );
};

export const interpolateColor = (
  [origR, origG, origB]: RgbColor,
  [newR, newG, newB]: RgbColor,
  steps: number
): RgbColor[] => {
  return new Array(steps)
    .fill(0)
    .map((_, i) => [
      origR + ((i + 1) * (newR - origR)) / steps,
      origG + ((i + 1) * (newG - origG)) / steps,
      origB + ((i + 1) * (newB - origB)) / steps,
    ]);
};

export function changeHue(rgb: RgbColor, degree: number) {
  var hsl = rgbToHSL(rgb);
  hsl.h += degree;
  if (hsl.h > 360) {
    hsl.h -= 360;
  } else if (hsl.h < 0) {
    hsl.h += 360;
  }
  return hslToRGB(hsl);
}

function rgbToHSL([r, g, b]: RgbColor) {
  var _r = r / 255,
    _g = g / 255,
    _b = b / 255;
  var cMax = Math.max(_r, _g, _b),
    cMin = Math.min(_r, _g, _b),
    delta = cMax - cMin,
    l = (cMax + cMin) / 2,
    h = 0,
    s = 0;
  if (delta == 0) {
    h = 0;
  } else if (cMax == _r) {
    h = 60 * (((_g - _b) / delta) % 6);
  } else if (cMax == _g) {
    h = 60 * ((_b - _r) / delta + 2);
  } else {
    h = 60 * ((_r - _g) / delta + 4);
  }

  if (delta == 0) {
    s = 0;
  } else {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  return {
    h: h,
    s: s,
    l: l,
  };
}
function hslToRGB(hsl: { h: number; s: number; l: number }): RgbColor {
  var h = hsl.h,
    s = hsl.s,
    l = hsl.l,
    c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r,
    g,
    b;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = normalize_rgb_value(r, m);
  g = normalize_rgb_value(g, m);
  b = normalize_rgb_value(b, m);

  return [r, g, b];
}

function normalize_rgb_value(color: number, m: number) {
  color = Math.floor((color + m) * 255);
  if (color < 0) {
    color = 0;
  }
  return color;
}
