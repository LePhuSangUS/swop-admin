import { MenuDataItem } from '@ant-design/pro-layout';
import { FormComponentProps } from 'antd/lib/form/Form';
import { PaginationConfig } from 'antd/lib/pagination';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Effect } from 'dva';
import { Effect, Subscription } from 'dva';
import { IAppModelState } from 'models/app';
import { IDashboardModelState } from 'pages/dashboard/model';
import { ICronModelState } from 'pages/cron/model';
import { ILoginModelType } from 'pages/login/model';
import { ISwopModelState } from 'pages/swops/model';
import { IUserDetailsModelState } from 'pages/users/$id/model';
import { IUserModelState } from 'pages/users/model';
import { Reducer } from 'react';
import { RouterTypes } from 'umi';
import { ModalProps } from 'antd/lib/modal';
import { ILaundryModelState } from 'pages/laundries/model';
import { ILaundryDetailsModelState } from 'pages/laundries/$id/model';
import { IMatchingModelState } from 'pages/matchings/model';
import { IMatchingDetailsModelState } from 'pages/matchings/$id/model';
import { IDressModelState } from 'pages/dresses/model';
import { IDressDetailsModelState } from 'pages/dresses/$id/model';
import { ISwopDetailModelState } from 'pages/swops/$id/model';
import { IDressReportedModelState } from 'pages/reports/model';
import { IReportDetailsModelState } from 'pages/reports/$id/model';
import { IDeliveryModelState } from 'pages/deliveries/model';
import { IDeliveryDetailsModelState } from 'pages/deliveries/$id/model';
import { ILockModelState, ILookModelState } from 'pages/looks/model';
import { ILockDetailsModelState, ILookDetailsModelState } from 'pages/looks/$id/model';
import { ICollectionModelState } from 'pages/collections/model';
import { ICollectionDetailsModelState } from 'pages/collections/$id/model';
import { ISettingModelState } from 'pages/settings/model';
import { ILogisticsModelState } from 'pages/logistics/model';
import { IBlogDetailsModelState } from 'pages/blogs/$id/model';
import { IBlogsModelState } from 'pages/blogs/model';

export type ITheme = 'dark' | 'light';
export type IEffect = Effect;
export type IReducer<T> = Reducer<T, any>;
export type ISubscription = Subscription;
export type IGlobalModelState = GlobalModelState;
export type IPaginationConfig = PaginationConfig;
export type ICheckboxValueType = CheckboxValueType;
export type IColumnProps<T> = ColumnProps<T>;
export type ITableProps<T> = TableProps<T>;
export type IModalProps = ModalProps;
export type INotificationQueueKey = '';
export interface IModel<T> {
  namespace?: string;
  state?: T;
  effects?: { [key: string]: Effect };
  reducers?: { [key: string]: Reducer<T> };
  subscriptions?: { [key: string]: Subscription };
}

export interface ILoadingState {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface IConnectState extends IConnectProps {
  app: IAppModelState;
  dashboard: IDashboardModelState;
  cron: ICronModelState;
  loading: ILoadingState;
  users: IUserModelState;
  login: ILoginModelType;
  userDetails: IUserDetailsModelState;
  swops: ISwopModelState;
  swopDetails: ISwopDetailModelState;
  laundries: ILaundryModelState;
  laundryDetails: ILaundryDetailsModelState;
  matchings: IMatchingModelState;
  matchingDetails: IMatchingDetailsModelState;
  dresses: IDressModelState;
  dressDetails: IDressDetailsModelState;
  reports: IDressReportedModelState;
  reportDetails: IReportDetailsModelState;
  deliveries: IDeliveryModelState;
  deliveryDetails: IDeliveryDetailsModelState;
  looks: ILookModelState;
  lookDetails: ILookDetailsModelState;
  collections: ICollectionModelState;
  collectionDetails: ICollectionDetailsModelState;
  settings: ISettingModelState;
  logistics: ILogisticsModelState;
  blogDetails: IBlogDetailsModelState;
  blogs: IBlogsModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

export interface IUpdateModelBase<T extends any> extends IModel<T> {
  reducers: { updateState: Reducer<T> };
}

export interface IPagingModelBase<T extends any> extends IModel<T> {
  state: {
    list: T[];
    pagination?: {
      showSizeChanger: boolean;
      showQuickJumper: boolean;
      current: number;
      total: number;
      pageSize: number;
    };
  };
  reducers: { updateState?: Reducer<IUserModelState> };
}

export interface IConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?<K = any>(action: AnyAction): K;

  location?: Location & {
    query: any;
  };
}

export interface IPaginationParam extends IPaginationTable {
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

export interface IPaginationTable {
  current: number;
  pageSize: number;
  total: number;
}

export interface IFormProps extends FormComponentProps {}

export interface IMenuItem {
  id: string;
  icon?: string;
  name?: string;
  route: string;
  breadcrumbParentId?: string;
  menuParentId?: string;
}

export type IMenus = IMenuItem[];

export interface INotificationItem {}

export * from './app';
