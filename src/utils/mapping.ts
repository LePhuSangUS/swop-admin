import {
  ICoordinate,
  ISwopTrackingStatus,
  IMatchingStatus,
  IRole,
  ILogisticMethod,
  IUserCreditSource,
  IUserCreditStatus,
  IStatsCumulativeKey,
  IDeliveryType,
  ISwop,
} from 'types';

export function getMatchingStatusDisplay(orderStatus: IMatchingStatus) {
  let status = 'Unknown';
  switch (orderStatus) {
    case 'accepted':
      status = 'Accepted';
      break;
    case 'proposed':
      status = 'Proposed';
      break;
    case 'canceled':
      status = 'Canceled';
      break;
    case 'expired':
      status = 'Expired';
      break;
    case 'finished':
      status = 'Finished';
      break;
    case 'un_finished':
      status = 'Un Finished';
      break;
    case 'early_return_proposed':
      status = 'Early Return Proposed';
      break;
    case 'early_return_confirmed':
      status = 'Early Return Confirmed';
      break;
    case 'retention_confirmed':
      status = 'Retention Confirmed';
      break;
    case 'retention_confirmed':
      status = 'Retention Confirmed';
      break;
    case 'extension_confirmed':
      status = 'Extension Confirmed';
      break;
    case 'extension_confirmed':
      status = 'Extension Confirmed';
      break;
    case 'return_initiated':
      status = 'Return Initiated';
      break;
    case 'defaulted':
      status = 'Defaulted';
      break;
    case 'retention_proposed':
      status = 'Retention Proposed';
      break;
    case 'extension_proposed':
      status = 'Extension Proposed';
      break;
    case 'completed':
      status = 'Completed';
      break;
    case 'pair_killed':
      status = 'Pair Killed';
      break;
    case 'confirmed':
      status = 'Confirmed';
      break;
    default:
      status = orderStatus;
      break;
  }
  return status;
}
export function getDeliveryTypeStatusDisplay(type: IDeliveryType) {
  let status: any = type;
  switch (type) {
    case 'delivery':
      status = 'Delivery';
      break;
    case 'pick_up':
      status = 'Pick Up';
      break;
    case 'return_delivery':
      status = 'Return Delivery';
      break;
    case 'return_pick_up':
      status = 'Return Pick Up';
      break;
  }

  return status;
}

export function getUserStatusDisplay(isDefaulting: boolean, isActive: boolean) {
  return isDefaulting ? 'Defaulting' : isActive ? 'Active' : 'Inactive';
}

export function getAdminStatusDisplay(deleted_at: number, isActive: boolean) {
  return deleted_at ? 'Banned' : isActive ? 'Active' : 'Deactivated';
}

export function getUserDressStatusDisplay(isDelist: boolean, isPublish: boolean) {
  const delist = isDelist ? 'Delisted' : 'Listed';
  const publish = isPublish ? 'Published' : 'Unpublished';
  return `${delist} • ${publish}`;
}

export function getLaundryStatusDisplay(isAccepting: boolean) {
  return isAccepting ? 'Accepting' : 'Not Accepting';
}

export function getAdminLaundryStatusDisplay(deleted_at: number, isAccepting: boolean) {
  return deleted_at ? 'Banned' : isAccepting ? 'Accepting' : 'Not Accepting';
}

export function getSwopStatusDisplay(orderStatus: ISwopTrackingStatus) {
  let status = 'Unknown';
  switch (orderStatus) {
    case 'accepted':
      status = 'Accepted';
      break;
    case 'proposed':
      status = 'Proposed';
      break;
    case 'canceled':
      status = 'Canceled';
      break;
    case 'received':
      status = 'Received';
      break;
    case 'un_delivered':
      status = 'Un Delivered';
      break;
    case 'delivered':
      status = 'Delivered';
      break;
    case 'shipped':
      status = 'Shipped';
      break;
    case 'ready':
      status = 'Ready';
      break;
    case 'picked_up':
      status = 'Picked Up';
      break;
    case 'return_picked':
      status = 'Return Picked';
      break;
    case 'pair_killed':
      status = 'Pair Killed';
      break;
    case 'expired':
      status = 'Expired';
      break;
    case 'waiting_accept':
      status = 'Waiting Accept';
      break;
    case 'pick_up_assigned':
      status = 'Pick Up Assigned';
      break;
    case 'pick_up_scheduled':
      status = 'Pick Up Scheduled';
      break;
    case 'pick_up_attempts':
      status = 'Pick Up Attempts';
      break;
    case 'picked':
      status = 'Picked';
      break;
    case 'un_picked':
      status = 'Un Picked';
      break;
    case 'delivery_assigned':
      status = 'Delivery Assigned';
      break;
    case 'return_delivery_scheduled':
      status = 'Return Delivery Scheduled';
      break;
    case 'return_delivered':
      status = 'Return Delivered';
      break;
    case 'return_un_delivered':
      status = 'Return Un Delivered';
      break;
    case 'return_different':
      status = 'Return Different';
      break;
    case 'return_delivery_assigned':
      status = 'Return Delivery Assigned';
      break;
    case 'return_ready':
      status = 'Return Ready';
      break;
    case 'return_pick_up_scheduled':
      status = 'Return Pick Up Scheduled';
      break;
    case 'return_received':
      status = 'Return Received';
      break;
    case 'return_un_picked':
      status = 'Return Un Picked';
      break;
    case 'different':
      status = 'Different';
      break;
    case 'early_return_requested':
      status = 'Early Return Requested';
      break;
    case 'extension_requested':
      status = 'Extension Requested';
      break;
    case 'extension_confirmed':
      status = 'Extension Confirmed';
      break;
    case 'retention_requested':
      status = 'Retention Requested';
      break;
    case 'delivery_scheduled':
      status = 'Delivery Scheduled';
      break;
    case 'retention_confirmed':
      status = 'Retention Confirmed';
      break;
    case 'extension_denied':
      status = 'Extension Denied';
      break;
    case 'retention_denied':
      status = 'Retention Denied';
      break;
    case 'send_back':
      status = 'Send Back';
      break;
    case 'finished':
      status = 'Finished';
      break;
    case 'early_return_proposed':
      status = 'Early Return Proposed';
      break;
    case 'early_return_requested':
      status = 'Early Return Requested';
      break;
    case 'retention_proposed':
      status = 'Retention Proposed';
      break;
    case 'return_initiated':
      status = 'Return Initialed';
      break;

    case 'extension_proposed':
      status = 'Extension Proposed';
      break;
    case 'return_shipped':
      status = 'Return Shipped';
      break;
    case 'return_pick_up_assigned':
      status = 'Return Pick Up Assigned';
      break;
    case 'return_pick_up_scheduling':
      status = 'Return Pick Up Scheduling';
      break;
    case 'early_return_confirmed':
      status = 'Early Return Confirmed';
      break;
    case 'defaulted':
      status = 'Defaulted';
      break;
    case 'completed':
      status = 'Completed';
      break;
    case 'confirmed':
      status = 'Confirmed';
      break;
    default:
      status = orderStatus;
      break;
  }
  return status;
}

export function getAccountRoleDisplay(role?: IRole) {
  switch (role) {
    case 'user':
      return 'User';
    case 'laundry':
      return 'Laundry';
    case 'admin':
      return 'Admin';
  }

  return role;
}

export function getSwopLogisticMethodDisplay(method: ILogisticMethod) {
  let status = '';
  switch (method) {
    case 'chat':
      status = 'Meet In Person';
      break;
    case 'self':
      status = 'Pick & Drop';
      break;
    case 'laundry':
      status = 'Home Delivery';
      break;
  }

  return status;
}

export function getUserCreditStatusDisplay(deletedAt: number, st: IUserCreditStatus) {
  if (deletedAt) {
    return 'Deleted';
  }

  let status = st as string;
  switch (st) {
    case 'active':
      status = 'Active';
      break;
    case 'inactive':
      status = 'Inactive';
      break;
    case 'used':
      status = 'Used';
      break;
  }

  return status;
}

export function getUserCreditSourceDisplay(method: IUserCreditSource) {
  let status = '';
  switch (method) {
    case 'new_user':
      status = 'New User';
      break;
    case 'admin_added':
      status = 'Admin Added';
      break;
    case 'payment_consumable':
      status = 'Consumable Payment';
      break;
    case 'payment_subscription':
      status = 'Subscription';
      break;
    case 'referral':
      status = 'Referral';
      break;
  }

  return status;
}

export function getFormattedAddress(address: ICoordinate) {
  if (!address) {
    return '';
  }

  if (address?.formatted_address !== '') {
    return address.formatted_address;
  }

  return `${address?.number} ${address?.street}, ${address?.country} ${address?.postal_code}`;
}

export function getCumulativeKeyDisplay(key: IStatsCumulativeKey) {
  let v = '';
  switch (key) {
    case 'total_user':
      v = 'Total Users';
      break;
    case 'total_organic_user':
      v = 'Total Organic Users';
      break;
    case 'total_referred_user':
      v = 'Total Referred Users';
      break;
    case 'total_swipes':
      v = 'Total Swipes';
      break;
    case 'total_left_swipes':
      v = 'Total Left Swipes';
      break;
    case 'total_right_swipes':
      v = 'Total Right Swipes';
      break;
    case 'total_dress_pages':
      v = 'Total Dress Pages';
      break;
    case 'total_deliveries':
      v = 'Total Deliveries';
      break;
    case 'total_delivery_charges':
      v = 'Total Delivery Charges';
      break;
    case 'total_laundries':
      v = 'Total Laundries';
      break;
    case 'total_swop_accepted':
      v = 'Total Swop Accepted';
      break;
    case 'total_swop_defaulted':
      v = 'Total Swop Defaulted';
      break;
    case 'total_swop_early_returned':
      v = 'Total Swop Early Returned';
      break;
    case 'total_swop_retained':
      v = 'Total Swop Retained';
      break;
    case 'total_swop_extended':
      v = 'Total Swop Extended';
      break;
    case 'total_laundry_earnings':
      v = 'Total Laundry Earnings';
      break;
    case 'total_swop_proposed':
      v = 'Total Swop Proposed';
      break;
    case 'total_swop_accepted_meet_in_person':
      v = 'Total Swop Accepted (Meet In-Person)';
      break;
    case 'total_swop_accepted_home_delivery':
      v = 'Total Swop Accepted (Home Delivery)';
      break;
    case 'total_swop_accepted_pick_and_drop':
      v = 'Total Swop Accepted (Pick & Drop)';
      break;
    case 'total_swop_fee':
      v = 'Total Swop Fee';
      break;
    default:
      v = key;
      break;
  }
  return v;
}

export const getSwopForDelivery = (item: ISwop) => {
  let newItem = { ...item };

  if (
    item?.status === 'return_pick_up_scheduled' ||
    item?.status === 'delivery_scheduled' ||
    // Case: Re Return
    ((item?.re_swop_status === 'requires_action' || item?.re_swop_status === 'accepted') &&
      item?.status === 'return_delivery_scheduled')
  ) {
    newItem = {
      ...item,
      user: item?.other_user,
      other_user: item?.user,

      coordinate: item?.other_swop?.coordinate,
      other_swop: item,

      cleaning_fee_deduct: item?.other_swop?.cleaning_fee_deduct,
    };
  }

  return newItem;
};

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
