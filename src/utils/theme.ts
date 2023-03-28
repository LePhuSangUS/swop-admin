import {
  ISubscribeStatus,
  ISwopTrackingStatus,
  IMatchingStatus,
  ILogisticMethod,
  IPermission,
  IUserCreditStatus,
  IUserCreditSource,
  IRole,
  IDeliveryType,
} from 'types';
import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  grey,
  lime,
  magenta,
  orange,
  purple,
  red,
  yellow,
} from '@ant-design/colors';

type SwopStatusColor = { [key in ISwopTrackingStatus]: string };

type CreditStatusColor = { [key in IUserCreditStatus]: string };

type CreditSourceColor = { [key in IUserCreditSource]: string };

type SubscribeColor = { [key in ISubscribeStatus]: string };

type MatchingStatusColor = { [key in IMatchingStatus]: string };

type ILogisticMethodColor = { [key in ILogisticMethod]: string };

type DeliveryTypeColor = { [key in IDeliveryType]: string };

const colors = {
  green: '#64ea91',
  blue: '#8fc9fb',
  purple: '#d897eb',
  red: '#f69899',
  yellow: '#f8c82e',
  peach: '#f797d6',
  borderBase: '#e5e5e5',
  borderSplit: '#f4f4f4',
  grass: '#d6fbb5',
  sky: '#c1e0fc',
  blue2: '#40a9ff',
  red2: '#ff4d4f',
  pink: '#e35d86',
  pink2: '#EC88AC',
  pink3: '#F59FB7',
  background: '#f0f0f0',
  black2: '#212434',
};

const subscribeColors: SubscribeColor = {
  Demi: '#108ee9',
  Standard: '#40a9ff',
  Magnum: '#ff7a45',
  Unsubscribed: '#9254de',
};

const logisticMethodColors: ILogisticMethodColor = {
  chat: colors.blue,
  self: colors.green,
  laundry: colors.pink,
};

const matchingStatusTagColors: MatchingStatusColor = {
  accepted: colors.pink2,
  canceled: red[4],
  denied: colors.red,
  expired: red[5],
  finished: colors.pink,
  pair_killed: red[7],
  proposed: blue[4],
  un_finished: red[6],
  defaulted: blue[5],
  early_return_confirmed: lime[4],
  early_return_proposed: lime[5],
  extension_confirmed: cyan[4],
  extension_proposed: cyan[4],
  retention_confirmed: purple[4],
  retention_proposed: purple[5],
  return_initiated: blue[6],
  completed: colors.black2,
  confirmed: orange[4],
};

const creditStatusTagColors: CreditStatusColor = {
  active: blue[4],
  inactive: red[4],
  used: colors.pink,
};

const creditSourceTagColors: CreditSourceColor = {
  admin_added: blue[4],
  payment_consumable: green[4],
  payment_subscription: cyan[4],
  referral: lime[4],
  new_user: grey[4],
};

const deliveryStatusTagColors: DeliveryTypeColor = {
  delivery: blue[4],
  pick_up: green[4],
  return_delivery: cyan[4],
  return_pick_up: grey[4],
};
const swopStatusTagColors: SwopStatusColor = {
  canceled: red[4],
  expired: red[5],
  different: red[6],
  pair_killed: red[7],

  accepted: colors.pink2,
  confirmed: colors.black2,
  early_return_confirmed: colors.peach,
  retention_confirmed: magenta[5],
  return_pick_up_scheduling: magenta[6],
  waiting_accept: blue[3],
  proposed: blue[4],
  delivered: blue[5],
  delivery_assigned: blue[6],
  delivery_attempts: blue[7],
  delivery_scheduled: blue[8],

  finished: colors.pink,

  picked: green[3],
  pick_up_assigned: green[4],
  picked_up: green[5],
  pick_up_attempts: green[6],
  pick_up_scheduled: green[7],

  early_return_proposed: cyan[7],
  early_return_requested: cyan[8],
  ready: grey[8],
  extension_requested: gold[5],

  received: cyan[7],
  retention_requested: gold[4],

  return_delivered: lime[4],
  return_delivery_assigned: lime[5],
  return_delivery_scheduled: lime[6],

  return_different: red[8],

  return_pick_up_assigned: cyan[4],
  return_pick_up_scheduled: cyan[5],
  return_picked: cyan[6],

  return_ready: yellow[5],
  return_received: yellow[6],
  return_shipped: yellow[7],
  return_un_delivered: red[3],
  return_un_picked: red[2],
  shipped: orange[4],
  un_delivered: red[8],
  un_picked: colors.red,
  send_back: colors.black2,

  retention_proposed: gold[4],
  extension_proposed: grey[4],
  completed: magenta[4],
  defaulted: geekblue[4],
  retention_denied: red[4],
  extension_denied: red[6],
  return_initiated: gold[5],

  extension_confirmed: grey[5],

  early_return_denied: red[5],
};

export function getSubscribeStatusColor(status: ISubscribeStatus) {
  return subscribeColors[status] || colors.pink;
}

export function getSwopStatusColor(status: ISwopTrackingStatus) {
  return swopStatusTagColors[status] || colors.pink;
}

export function getUserDressStatusColor(isDelist: boolean, isPublish: boolean) {
  return isPublish ? (isDelist ? colors.black2 : colors.pink) : grey[4];
}

export function getDeliveryTypeStatusColor(status: IDeliveryType) {
  return deliveryStatusTagColors[status] || colors.pink;
}

export function getSwopLogisticMethodColor(method: ILogisticMethod) {
  return logisticMethodColors[method] || colors.pink;
}
export function getAppleEnvironmentColor(status: string) {
  if (status === 'sandbox') {
    return '#9254de';
  } else if (status === 'production') {
    return '#40a9ff';
  }

  return '#ff7a45';
}

export function getAppleSubStatusColor(valid: boolean) {
  if (valid) {
    return '#64ea91';
  }

  return '#f69899';
}

export function getSubscriptionStateColor(state: number) {
  if (state === 0) {
    return '#40a9ff';
  }

  return '#ff4d4f';
}

export function getStatusColor(isInactive?: boolean) {
  return isInactive ? colors.red2 : colors.blue2;
}

export function getAccountStatusColor(deleted_at?: number) {
  return deleted_at ? colors.red2 : colors.blue2;
}

export function getUserStatusColor(isDefaulting: boolean, isActive: boolean) {
  return isDefaulting ? colors.red2 : isActive ? colors.blue2 : colors.red;
}

export function getAdminStatusColor(deleted_at: number, isActive: boolean) {
  return deleted_at ? colors.red2 : isActive ? colors.blue2 : colors.red;
}

export function getLaundryStatusColor(isAccepting: boolean) {
  return isAccepting ? colors.blue2 : colors.red;
}

export function getAdminLaundryStatusColor(deleted_at: number, isAccepting: boolean) {
  return deleted_at ? colors.red2 : isAccepting ? colors.blue2 : colors.red;
}

export function getMatchingStatusColor(status: IMatchingStatus) {
  return matchingStatusTagColors[status] || colors.pink;
}

export function getCreditStatusColor(deleted_at: number, status: IUserCreditStatus) {
  return deleted_at ? colors.red2 : creditStatusTagColors[status] || colors.pink;
}

export function getCreditSourceColor(status: IUserCreditSource) {
  return creditSourceTagColors[status] || colors.pink;
}

export function getShippingRateStatusColor(is_available?: boolean) {
  return is_available ? colors.blue2 : colors.red2;
}

export function getAccountRoleColor(role?: IRole) {
  switch (role) {
    case 'user':
      return colors.purple;
    case 'admin':
      return colors.blue2;
    case 'laundry':
      return colors.green;
  }
  return colors.blue;
}

export function getPermissionColor(permission?: IPermission) {
  switch (permission) {
    case 'admin_add_laundry':
      return blue[3];
    case 'admin_dashboard':
      return blue[4];
    case 'admin_deliveries':
      return blue[5];
    case 'admin_moderate_accounts':
      return blue[6];
    case 'admin_moderate_content':
      return blue[7];
    case 'admin_swop_journeys':
      return blue[8];

    case 'laundry_account':
      return cyan[3];
    case 'laundry_operation':
      return cyan[4];
    case 'laundry_setting':
      return cyan[5];
  }

  return colors.blue;
}

export default {
  colors,
  subscribeColors,
  swopStatusTagColors,
  matchingStatusTagColors,
  logisticMethodColors,
  deliveryStatusTagColors,
};
