import {
  FiEdit,
  FiEye,
  FiLink,
  FiLock,
  FiShare2,
} from "react-icons/fi";
import { MdOutlineFavoriteBorder } from "react-icons/md";

export const menuItems = [
  { icon: <FiEye />, title: "Details", action: "detail" },
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  { icon: <FiLink />, title: "Get Link", action: "get link", disabled: true },
  { icon: <FiLock />, title: "Password", action: "password", disabled: true },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  { icon: <MdOutlineFavoriteBorder />, title: "Favourite", action: "favourite", },
];
