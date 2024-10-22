import React, { useCallback, useEffect, useRef, useState } from "react";

//mui component and style
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMediaQuery } from "@mui/material";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import "styles/menuDropdown.style.css";
import { setIsOpen } from "stores/features/autoCloseSlice";

const MenuDropdownStyled = styled("div")({
  position: "relative",
});

export const MenuDropdownButton = styled("button")({
  borderRadius: "50%",
  border: 0,
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  width: "25px",
  cursor: "pointer",
});

const MenuListContainer = styled("div")({
  ".MuiMenu-list": {
    padding: 0,
    ".menu-item": {
      columnGap: "10px",
      fontSize: "14px",
      svg: {
        fontSize: "16px",
      },
      ":hover": {
        color: "#17766B",
        backgroundColor: "rgba(22,118,107,0.04)",
      },
    },
  },
});

const VoteMenuDropdown = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const open = Boolean(anchorEl);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: any) => state.autoCloseMenuDropdown.isOpen,
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    dispatch(setIsOpen(true));
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(setIsOpen(false));
  };

  useEffect(() => {
    if (!isOpen) {
      setAnchorEl(null);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    props.onOpenChange?.(open);
  }, [open]);

  return (
    <MenuDropdownStyled className="menu-dropdown">
      {props.customButton ? (
        <>
          {React.cloneElement(props.customButton.element, {
            id: "dropdown-button",
            "aria-controls": open ? "dropdown-menu" : undefined,
            "aria-haspopup": "true",
            "aria-expanded": open ? "true" : undefined,
            ...props.customButton.props,
            onClick: (e: any) => {
              handleClick(e);
              props.customButton.props?.onClick?.(e);
            },
          })}
        </>
      ) : (
        <MenuDropdownButton
          ref={toggleRef}
          id="dropdown-button"
          aria-controls={open ? "dropdown-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon style={{ color: "#4B465C" }} />
        </MenuDropdownButton>
      )}

      <MenuListContainer>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={open}
          sx={{
            cursor: "default",
          }}
          slotProps={{
            paper: {
              style: {
                position: "relative",
                width: isMobile ? "180px" : "max-content",
                boxShadow: props?.customButton?.shadows
                  ? props?.customButton?.shadows
                  : "0px 0px 5px rgba(0, 0, 0, 0.05)",
              },
            },
          }}
          style={{
            marginTop: "5px",
            padding: "0 !important",
          }}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "dropdown-button",
          }}
          disablePortal={props.customButton?.element ? false : true}
          disableScrollLock
        >
          {props.children}
        </Menu>
      </MenuListContainer>
    </MenuDropdownStyled>
  );
};

export default VoteMenuDropdown;
