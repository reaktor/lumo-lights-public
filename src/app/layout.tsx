"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <body>{children}</body>
      </ThemeProvider>
    </html>
  );
}
