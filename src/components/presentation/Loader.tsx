import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

type LoaderProps = {
  size?: number;
};

const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;

const Loader = (props: LoaderProps) => {
  return (
    <Root>
      <CircularProgress
        size={props.size ? props.size : 25}
        color="primaryTheme"
      />
    </Root>
  );
};

export default Loader;
