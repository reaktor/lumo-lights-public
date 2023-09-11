import * as React from "react";
import { Button, styled } from "@mui/material";

// https://mui.com/material-ui/react-button/#file-upload
const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const UploadButton: React.FC<{
  onUploaded: (dataUrl: string, filename: string) => void;
}> = ({ onUploaded }) => (
  <Button component="label" variant="contained">
    Upload an image
    <VisuallyHiddenInput
      type="file"
      accept=".png,.jpg"
      onChange={(e) => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) {
          return;
        }

        const file = e.currentTarget.files[0];
        const reader = new FileReader();

        reader.onload = () =>
          reader.result && onUploaded(reader.result.toString(), file.name);
        reader.readAsDataURL(file);
      }}
    />
  </Button>
);

export default UploadButton;
