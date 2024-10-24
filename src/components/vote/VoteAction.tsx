import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Box, Divider, IconButton } from "@mui/material";
import MenuDropdownItem from "components/presentation/MenuDropdonItem";
import React from "react";
import { useDispatch } from "react-redux";
import { setIsOpen } from "stores/features/autoCloseSlice";
import { VoteMenuItems } from "./VoteItem";
import VoteMenuDropdown from "./voteMenuDropdown";

export default function VoteAction(props: any) {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <VoteMenuDropdown
        anchor={props.anchor}
        customButton={{
          shadows: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          element: (
            <IconButton>
              {props?.icon ? (
                props.icon
              ) : (
                <MoreVertRoundedIcon sx={{ color: props.color ?? "" }} />
              )}
            </IconButton>
          ),
        }}
      >
        {VoteMenuItems.map((menuItem, index) => {
          return (
            <Box key={index}
              sx={{
                width: "200px",
              }}
            >
              <MenuDropdownItem 
                title={menuItem.title}
                icon={menuItem?.icon ?? ""}
                onClick={() => {
                  dispatch(setIsOpen(false));
                  props.onEvent(menuItem.action);
                }}
              />
              {menuItem.divider && <Divider />}
            </Box>
          );
        })}
      </VoteMenuDropdown>
    </React.Fragment>
  );
}
