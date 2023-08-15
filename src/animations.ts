import {
  changeHue,
  interpolateChannels,
  interpolateColor,
  RgbColor,
} from "./utils/color-utils";

// manual import/export to make the transpiled JS version of functions have a neat Utils variable
// instead of a webpack name imported module
const Utils = { changeHue, interpolateChannels, interpolateColor };

const CHANNEL_COUNT = 30;

let gradientStart: RgbColor = [0, 115, 0];
let gradientStop: RgbColor = [0, 255, 0];

export const rainbow = () =>
  new Array(360).fill(0).map((_, frame) => {
    const base = [
      ...Utils.interpolateColor(gradientStart, gradientStop, 8),
      ...Utils.interpolateColor(gradientStop, gradientStart, 8).slice(1),
    ];

    // 15 rotation steps with 8 interpolation steps each
    const interpolationSteps = 8;
    const step = Math.floor(frame / interpolationSteps) % CHANNEL_COUNT;
    const nextStep = (step + 1) % CHANNEL_COUNT;

    const interpolated = Utils.interpolateChannels(
      [...base.slice(step), ...base.slice(0, step)],
      [...base.slice(nextStep), ...base.slice(0, nextStep)],
      interpolationSteps
    )[frame % interpolationSteps];

    return interpolated.map((c) => Utils.changeHue(c, frame % 360));
  });

export const knightRider = () => {
  const base: RgbColor[] = new Array(CHANNEL_COUNT)
    .fill([0, 0, 0])
    .map((c, i) => (i === 0 ? [255, 0, 0] : c));

  const fade = Utils.interpolateColor([255, 0, 0], [0, 0, 0], 12);

  const frames = Array(CHANNEL_COUNT)
    .fill(0)
    .map((_, step) =>
      base.map((c, i) => fade[Math.abs(i - step)] || [0, 0, 0])
    );

  const interpolated = frames.flatMap((_, i) =>
    i < frames.length - 1
      ? Utils.interpolateChannels(frames[i], frames[i + 1], 2)
      : [frames[i]]
  );

  return [...interpolated, ...interpolated.reverse()];
};

export const randomLights = () => {
  const randomColor = (): RgbColor => [
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  ];

  const randomizeFrame = () =>
    Array(CHANNEL_COUNT)
      .fill([0, 0, 0])
      .map((c) => (Math.random() > 0.9 ? randomColor() : c));

  const keyframes = Array(30)
    .fill(0)
    .map(() => randomizeFrame());

  const interpolated = keyframes
    // double each keyframe to make them stay lit up longer before changing to next keyframe
    .flatMap((k, i, values) => [values[i], values[i]])
    // interpolate values between keyframes
    .flatMap((k, i, values) =>
      i < values.length - 1
        ? Utils.interpolateChannels(values[i], values[i + 1], 30)
        : [values[i]]
    );

  // reverse the interpolated frames to make it loop smoothly from start to finish
  return [...interpolated, ...interpolated.reverse()];
};
