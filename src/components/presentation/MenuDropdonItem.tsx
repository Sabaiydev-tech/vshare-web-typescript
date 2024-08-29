//mui component and style
import MenuItem from "@mui/material/MenuItem";
import { FaLock } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
const MenuDropdownItem: React.FC<any> = ({
  icon,
  title,
  isFavorite,
  isPassword,
  ...props
}) => {
  let result;

  switch (true) {
    case title === "Favourite":
      if (isFavorite) {
        result = <MdFavorite fill="#17766B" />;
      } else {
        result = icon;
      }
      break;
    case title === "Password":
      if (isPassword) {
        result = <FaLock fill="#17766B" />;
      } else {
        result = icon;
      }
      break;

    default:
      result = icon;
  }

  return (
    <MenuItem className="menu-item" {...props}>
      {result}
      {title}
    </MenuItem>
  );
};

export default MenuDropdownItem;
