import { RgbColor } from "./color-utils";

export const transformImageToFrames = (
  dataUrl: string
): Promise<RgbColor[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
    const canvas = document.createElement("canvas");
    canvas.height = 1000;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject();
    } else {
      img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0);

        img.style.display = "none";
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        if (img.width != 30 || img.height < 2) {
          reject();
          return;
        }

        const frames = imageData.data
          .reduce((acc, curr, i) => {
            if (i % 4 !== 3) {
              acc.push(curr);
            }
            return acc;
          }, [] as number[])
          .reduce((acc, curr, i, arr) => {
            if (i % 3 === 0) {
              acc.push([arr[i], arr[i + 1], arr[i + 2]]);
            }

            return acc;
          }, [] as RgbColor[])
          .reduce((acc, curr, i, arr) => {
            if (i % 30 === 0) {
              acc.push(arr.slice(i, i + 30));
            }

            return acc;
          }, [] as RgbColor[][]);

        return resolve(frames);
      });
    }
  });
};
