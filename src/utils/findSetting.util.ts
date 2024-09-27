import { ISettingType } from "types/settingType";
interface ISettingProps {
  action: string;
  settings: ISettingType[];
}
export const FindSettingKey = ({ action, settings }: ISettingProps) => {
  const foundItem = settings?.find(
    (item: ISettingType) => item.productKey === action,
  );
  return foundItem;
};
