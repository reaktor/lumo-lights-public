"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as _ from "lodash";
import { rainbow, knightRider, randomLights, evaluate } from "@/animations";
import type { RgbColor } from "@/utils/color-utils";
import { rgbToHSL } from "@/utils/color-utils";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  MenuItem,
  Select,
  Slider,
  Toolbar,
  Typography,
} from "@mui/material";

const Windows: React.FC<{ channels: RgbColor[] }> = ({ channels }) => (
  <div
    style={{
      display: "flex",
      border: "1px solid grey",
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
          boxShadow: `0px -20px 40px 20px rgba(${r}, ${g}, ${b}, ${
            rgbToHSL([r, g, b]).l
          })`,
          backgroundColor: `rgb(${r}, ${g}, ${b})`,
        }}
      ></div>
    ))}
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
  const [showEditor, setShowEditor] = React.useState(false);

  const template = (params.get("template") as Templates) ?? "rainbow";

  // Websocket connection to backend.
  // const ws = React.useRef<WebSocket>();

  // React.useEffect(() => {
  //   const socket = new WebSocket("ws://localhost:8080");

  //   socket.onopen = (event) => {
  //     ws.current = socket;
  //     ws.current.send(JSON.stringify(frames));
  //   };
  // }, []);

  // if (ws.current)
  //   ws.current.send(JSON.stringify(frames[currentFrame % frames.length]));

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
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box
          display="flex"
          gap={1.5}
          p={2}
          justifyItems={"center"}
          alignItems={"center"}
        >
          <Typography noWrap>Select animation:</Typography>
          <Select
            size="small"
            value={template}
            onChange={(e) => router.push(`?template=${e.target.value}`)}
          >
            <MenuItem value="rainbow">Sleepy Rainbow</MenuItem>
            <MenuItem value="knightRider">Knight Rider 2023</MenuItem>
            <MenuItem value="randomLights">Random</MenuItem>
          </Select>
          <Button
            size="small"
            variant="contained"
            onClick={() => setShowEditor(true)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="info"
            onClick={() => refresh(evaluate(editorValue))}
          >
            Restart
          </Button>
          {running ? (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setRunning(false)}
            >
              Pause
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => setRunning(true)}
            >
              Play
            </Button>
          )}
        </Box>
        <Dialog
          fullScreen
          open={showEditor}
          disableAutoFocus
          onClose={() => {
            refresh(evaluate(editorValue));
            return setShowEditor(false);
          }}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {template}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {
                  refresh(evaluate(editorValue));
                  return setShowEditor(false);
                }}
              >
                Close and Save
              </Button>
            </Toolbar>
          </AppBar>
          <Editor
            theme="vs-dark"
            height="100vh"
            width="100vw"
            defaultLanguage="javascript"
            value={editorValue}
            onChange={(value) => setEditorValue(value ?? "")}
          />
        </Dialog>
        {frames?.length > 0 && (
          <>
            <Box display="flex" position="relative" px={3}>
              <div
                style={{
                  top: "30px",
                  left: "15px",
                  position: "absolute",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >{`Frame: ${currentFrame}`}</div>
              <Slider
                // disable transition animation because the value changes from frames.length to 0 in the end
                // and with slow animation it looks broken
                componentsProps={{
                  track: { style: { transition: "none" } },
                  thumb: { style: { transition: "none" } },
                }}
                min={0}
                max={frames.length}
                value={currentFrame}
                onChange={(e, v) => {
                  setRunning(false);
                  setCurrentFrame(v as number);
                }}
              />
            </Box>

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
          </>
        )}
      </Box>
    </main>
  );
};

export default Home;
