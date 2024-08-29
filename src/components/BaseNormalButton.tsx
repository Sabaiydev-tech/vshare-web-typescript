import React from "react";
import NormalButton from "./NormalButton";

type Props = {
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;

  handleClick?: () => void;
};

function BaseNormalButton(props: Props) {
  return (
    <NormalButton
      onClick={() => {
        props.handleClick?.();
      }}
      disabled={props.disabled}
      sx={{
        padding: (theme) => `${theme.spacing(1.6)} ${theme.spacing(5)}`,
        borderRadius: (theme) => theme.spacing(2),
        color: "#828282 !important",
        fontWeight: "bold",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        width: "inherit",
        outline: "none",
        verticalAlign: "middle",

        ":disabled": {
          cursor: "context-menu",
          backgroundColor: "#D6D6D6",
          color: "#ddd",
        },
      }}
    >
      {props.title}
      {props?.children}
    </NormalButton>
  );
}

export default BaseNormalButton;
