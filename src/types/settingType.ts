export interface ISettingType {
  _id: number;
  action: string;
  categoryKey: string | null;
  createdAt: Date;
  groupName: string;
  productKey: string;
  status: string;
  title: string;
  updatedAt: Date;
}
