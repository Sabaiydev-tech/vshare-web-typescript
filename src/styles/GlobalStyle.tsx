import { Global, GlobalProps, css } from "@emotion/react";

const GlobalStyle = (props: Omit<GlobalProps, "styles">) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #root {
        height: 100%;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }

      a {
        text-decoration: none !important;
      }

      body > iframe {
        pointer-events: none;
      }
    `}
  />
);

export default GlobalStyle;
