"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as _ from "lodash";
import { rainbow, knightRider, randomLights } from "@/animations";
import type { RgbColor } from "@/utils/color-utils";
import { rgbToHSL } from "@/utils/color-utils";
import Editor from "@monaco-editor/react";
import Image from "next/image";

const Square = () => (
  <div style={{ border: "1px solid grey", height: "2vw", width: "2vw" }} />
);

const Windows: React.FC<{ channels: RgbColor[] }> = ({ channels }) => (
  <div
    style={{
      display: "flex",
      border: "1px solid grey",
      // background: "yellow",
      height: "1.25vw",
      alignItems: "end",
    }}
  >
    {channels.map(([r, g, b], i) => (
      <div
        key={i}
        style={{
          height: "0.2vw",
          width: "0.8vw",
          // todo: calculate color brightness and set it as opacity
          boxShadow: `0px -20px 40px 20px rgba(${r}, ${g}, ${b}, ${
            1 //rgbToHSL([r, g, b]).l
          })`,
          backgroundColor: `rgb(${r}, ${g}, ${b})`,
        }}
      >
        {/* {rgbToHSL([r, g, b]).l} */}
      </div>
    ))}
    {/* <div style={{ display: "flex", gap: "0.5vw" }}>
      <Square />
      <Square />
    </div>
    <div style={{ display: "flex", gap: "0.5vw" }}>
      <Square />
      <Square />
    </div>
    <div style={{ display: "flex", gap: "0.5vw" }}>
      <Square />
      <Square />
    </div> */}
  </div>
);

type Templates = "rainbow" | "knightRider" | "randomLights";

const WINDOW_POSITIONS = [
  33.925, 39.855, 45.75, 52.9, 59.19, 65.55, 71.7, 79, 84.8, 90.75,
];

const Home: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [running, setRunning] = React.useState(true);
  const [currentFrame, setCurrentFrame] = React.useState(0);
  const [frames, setFrames] = React.useState<RgbColor[][]>([]);
  const [editorValue, setEditorValue] = React.useState("");

  const template = (params.get("template") as Templates) ?? "rainbow";

  React.useEffect(() => {
    changeTemplate(template);
  }, [template]);

  React.useEffect(() => {
    const interval = setInterval(
      () =>
        running &&
        setCurrentFrame((frame) => (frame >= frames.length ? 0 : frame + 1)),
      40
    );
    return () => clearInterval(interval);
  }, [running, frames]);

  const refresh = React.useCallback(
    (animationFn: () => RgbColor[][]) => {
      setFrames(animationFn());
      setEditorValue(animationFn.toString());
      setCurrentFrame(0);
    },
    [setFrames, setEditorValue, setCurrentFrame]
  );

  const changeTemplate = React.useCallback(
    (template: Templates) => {
      switch (template) {
        case "rainbow":
          refresh(rainbow);
          break;
        case "knightRider":
          refresh(knightRider);
          break;
        case "randomLights":
          refresh(randomLights);
          break;
      }
    },
    [refresh]
  );

  return (
    <main>
      <div className="flex flex-col h-screen items-center gap-5 p-5">
        <select
          value={template}
          onChange={(e) => router.push(`?template=${e.currentTarget.value}`)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="rainbow">Sleepy Rainbow</option>
          <option value="knightRider">Knight Rider 2023</option>
          <option value="randomLights">Random</option>
        </select>
        <Editor
          theme="vs-dark"
          height="50vh"
          width="100%"
          defaultLanguage="javascript"
          value={editorValue}
          onChange={(value) => setEditorValue(value ?? "")}
        />
        {frames?.length > 0 && (
          <>
            <input
              type="range"
              value={currentFrame * (100 / frames.length)}
              onChange={(e) => {
                setRunning(false);
                setCurrentFrame(
                  Math.round(
                    parseFloat(e.currentTarget.value) / (100 / frames.length)
                  )
                );
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            ></input>
            <div>
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => refresh(eval(editorValue))}
              >
                Refresh
              </button>
              {running ? (
                <button
                  onClick={() => setRunning(false)}
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => setRunning(true)}
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Play
                </button>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div>{`Frame: ${currentFrame}`}</div>
              <div
                style={{
                  position: "relative",
                  height: "calc(100vw / 3.52)",
                  width: "100vw",
                }}
              >
                <Image src="/petrelius.png" alt="Petrelius" fill />
                {WINDOW_POSITIONS.map((pos, i) => (
                  <div
                    style={{
                      position: "absolute",
                      top: "16.9vw",
                      left: pos + "vw",
                    }}
                  >
                    <Windows
                      channels={frames[currentFrame % frames.length].slice(
                        i * 3,
                        (i + 1) * 3
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
