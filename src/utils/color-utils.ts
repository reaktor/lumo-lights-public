export type RgbColor = [r: number, g: number, b: number];

export type EasingFn = (n: number) => number;
export const Easing = {
  Linear: (n) => n,
  EaseInSine: (n) => 1 - Math.cos((n * Math.PI) / 2),
  EaseOutSine: (n) => Math.sin((n * Math.PI) / 2),
  EaseInOutSine: (n) => -(Math.cos(Math.PI * n) - 1) / 2,
} satisfies Record<string, EasingFn>;

export const interpolateChannels = (
  oldChannels: RgbColor[],
  newChannels: RgbColor[],
  steps: number,
  easingFunction = Easing.Linear,
  interpolateColorFn = interpolateHSV
): RgbColor[][] => {
  const interpolated = oldChannels.map((oldColor, i) =>
    interpolateColorFn(oldColor, newChannels[i], steps, easingFunction)
  );

  return new Array(steps)
    .fill(0)
    .map((_, i) =>
      new Array(oldChannels.length).fill(0).map((_, j) => interpolated[j][i])
    );
};

export const interpolateRGB = (
  [origR, origG, origB]: RgbColor,
  [newR, newG, newB]: RgbColor,
  steps: number,
  easingFunction = Easing.Linear
): RgbColor[] =>
  new Array(steps)
    .fill(0)
    .map((_, i) => [
      origR + (easingFunction(i / steps) * ((i + 1) * (newR - origR))) / steps,
      origG + (easingFunction(i / steps) * ((i + 1) * (newG - origG))) / steps,
      origB + (easingFunction(i / steps) * ((i + 1) * (newB - origB))) / steps,
    ]);

export const interpolateHSV = (
  from: RgbColor,
  to: RgbColor,
  steps: number,
  easingFunction = Easing.Linear
): RgbColor[] => {
  const fromHsv = rgbToHsv(from);
  const toHsv = rgbToHsv(to);
  return new Array(steps)
    .fill(0)
    .map((_, i) =>
      hsvToRgb([
        fromHsv[0] +
          (easingFunction(i / steps) * ((i + 1) * (toHsv[0] - fromHsv[0]))) /
            steps,
        fromHsv[1] +
          (easingFunction(i / steps) * ((i + 1) * (toHsv[1] - fromHsv[1]))) /
            steps,
        fromHsv[2] +
          (easingFunction(i / steps) * ((i + 1) * (toHsv[2] - fromHsv[2]))) /
            steps,
      ])
    );
};

const hsvToRgb = ([h, s, v]: [h: number, s: number, v: number]): RgbColor => {
  let f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
};

const rgbToHsv = ([r, g, b]: RgbColor): [h: number, s: number, v: number] => {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  let v = Math.max(rr, gg, bb),
    c = v - Math.min(rr, gg, bb);
  let h =
    c &&
    (v == rr ? (gg - bb) / c : v == gg ? 2 + (bb - rr) / c : 4 + (rr - gg) / c);
  return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
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

export function rgbToHSL([r, g, b]: RgbColor) {
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
export function hslToRGB(hsl: { h: number; s: number; l: number }): RgbColor {
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
