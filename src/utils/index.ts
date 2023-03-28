import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import {
  IConstants,
  IDress,
  IDressCategory,
  IDressInfo,
  ILookDress,
  IMenuItem,
  IPaginationParam,
  ISwop,
  ISwopTracking,
  ISwopTrackingStatus,
} from 'types';
import umiRouter from 'umi/router';
import { parse } from 'qs';
import { formatDate, formatDateTimeSlot } from './date';
import { formatMoneyCurrency } from './money';

// export const { defaultLanguage } = i18n
// export const languages = i18n.languages.map(item => item.key)
export const languages: any[] = [];
export const defaultLanguage = 'en';

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array: any[], key: string, value: string) {
  if (!Array.isArray(array)) {
    return;
  }
  return array.find((_) => _[key] === value);
}

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(array: any[], id = 'id', parentId = 'pid', children = 'children') {
  const result: any[] = [];
  const hash = {};
  const data = _.cloneDeep(array);

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item) => {
    const hashParent = hash[item[parentId]];
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = []);
      hashParent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * Adjust the router to automatically add the current language prefix before the pathname in push and replace.
 */
const myRouter = { ...umiRouter };

export const router = myRouter;

export function pathMatchRegexp(regexp: pathToRegexp.Path, pathname: string) {
  return pathToRegexp(regexp).exec(pathname);
}

export function queryPathKeys(array: string[], current: string, parentId: string, id = 'id') {
  const result = [current];
  const hashMap = new Map();
  array.forEach((item) => hashMap.set(item[id], item));

  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current)[parentId];
    if (currentParentId) {
      result.push(currentParentId);
      getPath(currentParentId);
    }
  };

  getPath(current);
  return result;
}

/**
 * In an array of objects, specify an object that traverses the objects whose parent ID matches.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryAncestors(
  array: IMenuItem[],
  current: IMenuItem,
  parentId: string,
  id = 'id',
) {
  const result = [current];
  const hashMap = new Map();
  array.forEach((item) => hashMap.set(item[id], item));

  const getPath = (current: IMenuItem) => {
    const currentParentId = hashMap.get(current[id])[parentId];
    if (currentParentId) {
      result.push(hashMap.get(currentParentId));
      getPath(hashMap.get(currentParentId));
    }
  };

  getPath(current);
  return result;
}

/**
 * Query which layout should be used for the current path based on the configuration.
 * @param   {layouts}     layouts   Layout configuration.
 * @param   {pathname}    pathname  Path name to be queried.
 * @return  {string}   Return frist object when query success.
 */
export function queryLayout(layouts: any, pathname: string) {
  let result = 'public';

  const isMatch = (regepx: RegExp) => {
    return regepx instanceof RegExp ? regepx.test(pathname) : pathMatchRegexp(regepx, pathname);
  };

  for (const item of layouts) {
    let include = false;
    let exclude = false;
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true;
          break;
        }
      }
    }

    if (include && item.exclude) {
      for (const regepx of item.exclude) {
        if (isMatch(regepx)) {
          exclude = true;
          break;
        }
      }
    }

    if (include && !exclude) {
      result = item.name;
      break;
    }
  }

  return result;
}

export const maskCurrency = (value: string, maxLength = 12, radix = ',') => {
  const currencyRegExp = new RegExp(`(\\d{1,${maxLength - 3}})(,)?(\\d{2})`, 'g');
  return value.replace(currencyRegExp, (match, p1, p2, p3) => [p1, p3].join(radix));
};

export const parseFromUrl = (url: string) => {
  if (url?.startsWith('?')) {
    const query = url?.substring(1);
    var value = parse(query);
    if (typeof value?.from === 'string') {
      return value;
    }
  }
  return null;
};

export const getLocationID = (id: string) => {
  if (id.startsWith('test')) {
    const segs = id.split('_');
    return segs[1];
  }

  return id;
};

export const getPagination = (data: any) => {
  const pagination: IPaginationParam = {
    current: Number(data?.current_page),
    pageSize: Number(data?.per_page),
    total: Number(data?.total_record),
  };
  return pagination;
};

export const downloadFile = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getDressCategory = (constant: IConstants, alias: string) => {
  return constant?.dress_categories?.find((item) => item.alias === alias);
};

export const getDressType = (constant: IConstants, category: IDressCategory, alias: string) => {
  return category?.types?.find((item) => item.alias === alias);
};

export const getDressInfoByKey = (
  constant: IConstants,
  category: IDressCategory,
  key: Exclude<keyof IDressCategory, 'alias' | 'title' | 'image_url'>,
  alias: string[],
) => {
  if (!category) return null;

  return category[key]?.filter((item) => alias?.includes(item.alias));
};

export const getDressInfo = (constant: IConstants, dress: IDress | ILookDress): IDressInfo => {
  const category = getDressCategory(constant, dress?.category);
  const type = getDressType(constant, category, dress?.type);
  const fabrics = getDressInfoByKey(constant, category, 'fabrics', dress?.fabrics);
  const colors = getDressInfoByKey(constant, category, 'colors', dress?.colors);
  const fits = getDressInfoByKey(constant, category, 'fits', dress?.fits);
  const legs = getDressInfoByKey(constant, category, 'legs', dress?.legs);
  const necklines = getDressInfoByKey(constant, category, 'necklines', dress?.necklines);
  const lengths = getDressInfoByKey(constant, category, 'lengths', dress?.lengths);
  const patterns = getDressInfoByKey(constant, category, 'patterns', dress?.patterns);
  const styles = getDressInfoByKey(constant, category, 'styles', dress?.styles);
  const sleeves = getDressInfoByKey(constant, category, 'sleeves', dress?.sleeves);
  const waist_rises = getDressInfoByKey(constant, category, 'waist_rises', dress?.waist_rises);

  return {
    category,
    type,
    fabrics,
    colors,
    fits,
    legs,
    necklines,
    lengths,
    patterns,
    sleeves,
    styles,
    waist_rises,
  };
};

export const getTrackingTitleSubStatus = (
  status: ISwopTrackingStatus,
  swop?: ISwop,
  otherSwop?: ISwop,
  tracking?: ISwopTracking,
) => {
  let title = status as string;
  let subTitle = '';
  switch (status) {
    case 'accepted':
      title = 'Swop Accepted';
      subTitle = 'Congratulations. Please be ready to hand over your clothes';
      break;

    case 'proposed':
      title = 'Swop Proposed';
      subTitle = 'A swop can be cancelled within 24 hours of being proposed';
      break;

    case 'waiting_accept':
      title = 'Swop Waiting Accept';
      subTitle = 'A swop can be cancelled within 24 hours of being proposed';
      break;

    case 'expired':
      title = 'Swop Expired';
      subTitle = 'A swop needs to be accepted within 24 hours';
      break;

    case 'pick_up_scheduled':
      title = 'Pickup Scheduled';
      switch (swop?.logistic_method) {
        case 'chat':
          subTitle = 'Please pick a convenient place and time over chat to swap clothes';
          break;
        case 'laundry':
          subTitle = `Please be ready to hand over your clothes on ${formatDateTimeSlot(
            swop?.pick_up_from_time,
            swop?.pick_up_to_time,
          )}`;
          break;
        case 'self':
          subTitle = `Please drop off clothes at ${
            swop?.laundry?.coordinate?.formatted_address
          } by ${formatDateTimeSlot(swop?.pick_up_from_time, swop?.pick_up_to_time)}`;
          break;
      }
      break;

    case 'pick_up_assigned':
      title = 'Pickup Confirmed';
      subTitle = `Please be available to hand over your clothes on ${formatDateTimeSlot(
        swop?.pick_up_from_time,
        swop?.pick_up_to_time,
      )}. Please pay ${formatMoneyCurrency(
        tracking.metadata?.delivery_fee_deduct,
        swop.currency,
      )} (dc=${formatMoneyCurrency(tracking.metadata?.delivery_fee_deduct, swop.currency)}) (SwC)`;
      break;

    case 'picked':
      title = 'Pickup Successful';
      subTitle = 'You handed over your clothes for the swop';
      break;
    case 'un_picked':
      title = 'Pickup Failed';
      subTitle = 'You did not hand over your clothes for the swop';
      break;

    case 'received':
      title = 'Cleaning Started';
      subTitle = 'Your clothes have gone for cleaning';
      break;

    case 'ready':
      title = 'Clothes Cleaned';
      subTitle = 'The swopped clothes are cleaned and ready for delivery';
      break;

    case 'delivery_scheduled':
      title = 'Delivery Scheduled';
      switch (swop?.logistic_method) {
        case 'chat':
          subTitle = 'Please pick a convenient place and time over chat to swap clothes';
          break;
        case 'laundry':
          subTitle = `Please be available to receive the swopped clothes on ${formatDateTimeSlot(
            otherSwop?.delivery_from_time,
            otherSwop?.delivery_to_time,
          )}`;
          break;
        case 'self':
          subTitle = `Please collect the swopped clothes at ${
            otherSwop?.laundry?.coordinate?.formatted_address
          } by ${formatDateTimeSlot(
            otherSwop?.delivery_from_time,
            otherSwop?.delivery_to_time,
          )}. Please pay ${formatMoneyCurrency(
            tracking?.metadata?.cleaning_fee_deduct || 0,
            swop?.currency,
          )} at the laundry (cc=${formatMoneyCurrency(
            tracking.metadata?.cleaning_fee_deduct || 0,
            swop.currency,
          )}) (CSwC)`;
          break;
      }
      break;

    case 'delivery_assigned':
      title = 'Delivery Confirmed';
      subTitle = `Please be ready to receive the swopped clothes on ${formatDateTimeSlot(
        otherSwop?.delivery_from_time,
        otherSwop?.delivery_to_time,
      )}. Please pay $${formatMoneyCurrency(
        parseInt(tracking?.metadata?.cleaning_fee_deduct || '0') +
          parseInt(tracking?.metadata?.delivery_fee_deduct || '0'),
        swop?.currency,
      )} to the shipper (cc=${formatMoneyCurrency(
        tracking.metadata?.cleaning_fee_deduct || 0,
        swop.currency,
      )}, dc=${formatMoneyCurrency(tracking?.metadata?.delivery_fee_deduct || 0)}) (CSwC)`;
      break;

    case 'shipped':
      title = 'Shipped';
      subTitle = 'Shipped';
      break;

    case 'delivered':
      title = 'Delivery Successful';
      subTitle = 'You have received the swopped clothes';
      break;

    case 'un_delivered':
      title = 'Delivery Failed';
      subTitle = `You can collect clothes at your convenience at ${otherSwop?.laundry?.coordinate?.formatted_address}`;
      break;

    case 'finished':
      title = 'Swop Finished';
      subTitle = 'Swop Finished';
      break;

    case 'pair_killed':
      title = 'Swop Denied';
      subTitle = "You're free to swop with other matches";
      break;

    case 'confirmed':
      title = 'Confirmed';
      subTitle = 'Confirmed';
      break;

    case 'early_return_proposed':
      title = 'Early Return Proposed';
      subTitle =
        "Not loving the swopped clothes too much? No worries. Anytime within the next one week, you can request for an early return. If both of you agree, we'll have your clothes returned earlier.";
      break;

    case 'retention_proposed':
      title = 'Swop Forever Proposed';
      subTitle =
        "Loving the swopped clothes too much? Anytime within the next one week, you can request to let you keep them for good. If both of you agree, we'll let you keep them forever.";
      break;

    case 'extension_proposed':
      title = 'Extend Swop Proposed';
      subTitle =
        "Want to keep the swopped clothes for a little longer? Anytime within the next one week, you can request to extend the swop by a month. If both of you agree, we'll delay the return of swopped clothes by a month";
      break;

    case 'early_return_requested':
      title = 'Early Return Requested';
      subTitle = 'Please wait while the other user decides';
      break;

    case 'retention_requested':
      title = 'Swop Forever Requested';
      subTitle = 'Please wait while the other user decides';
      break;

    case 'extension_requested':
      title = 'Extend Swop Requested';
      subTitle = 'Please wait while the other user decides';
      break;

    case 'early_return_confirmed':
      title = 'Early Return Confirmed';
      subTitle = 'Early Return Confirmed';
      break;

    case 'retention_confirmed':
      title = 'Swop Forever Confirmed';
      subTitle = 'You both can keep the swopped clothes forever';
      break;

    case 'extension_confirmed':
      title = 'Extend Swop Confirmed';
      subTitle = 'You both can keep the swopped clothes for another month';
      break;

    case 'early_return_denied':
      title = 'Early Return Denied';
      subTitle = 'Sorry, the other user would like to continue the swop for the entire month';
      break;

    case 'retention_denied':
      title = 'Swop Forever Denied';
      subTitle = 'Sorry, the other user would not like to keep the swopped clothes forever';
    case 'extension_denied':
      title = 'Extend Swop Denied';
      subTitle = 'Sorry, the other user would not like to extend the swop beyond the month';
      break;

    case 'return_pick_up_scheduled':
      title = 'Return Pickup Scheduled';
      switch (swop?.logistic_method) {
        case 'chat':
          subTitle = 'Please pick a convenient place and time over chat to return clothes';
          break;
        case 'laundry':
          subTitle = `Please be ready to hand over the swopped clothes on ${formatDateTimeSlot(
            swop?.return_pick_up_from_time,
            swop?.return_pick_up_to_time,
          )}`;
          break;
        case 'self':
          subTitle = `Please drop off the swopped clothes at ${
            otherSwop?.return_laundry?.coordinate?.formatted_address
          } by ${formatDateTimeSlot(swop?.return_pick_up_from_time, swop?.return_pick_up_to_time)}`;
          break;
      }
      break;
    case 'return_pick_up_assigned':
      title = 'Return Pickup Confirmed';
      subTitle = `Please be available to hand over the swopped clothes on ${formatDateTimeSlot(
        swop?.return_pick_up_from_time,
        swop?.return_pick_up_to_time,
      )}. Please pay ${formatMoneyCurrency(
        tracking?.metadata?.delivery_fee_deduct || 0,
        swop?.currency,
      )} to the shipper (SwC)`;
      break;

    case 'return_picked':
      title = 'Return Pickup Successful';
      subTitle = 'You handed over the swopped clothes for return';
      break;

    case 'return_un_picked':
      title = 'Return Pickup Failed';
      subTitle = `Your profile has been temporarily deactivated. To continue swopping clothes, please return clothes at the earliest at ${otherSwop?.return_laundry?.coordinate?.formatted_address}`;
      break;

    case 'return_received':
      title = 'Return Cleaning Started';
      subTitle = 'The returned clothes have gone for cleaning';
      break;

    case 'return_ready':
      title = 'Returning Clothes Cleaned';
      subTitle = 'Your clothes are cleaned and ready for delivery';
      break;

    case 'return_delivery_scheduled':
      title = 'Return Delivery Scheduled';
      switch (swop?.logistic_method) {
        case 'chat':
          subTitle = '';
          break;
        case 'laundry':
          subTitle = `Please be ready to receive your clothes on ${formatDateTimeSlot(
            swop?.return_delivery_from_time,
            swop?.return_delivery_to_time,
          )}`;
          break;
        case 'self':
          subTitle = `"Please collect your clothes at ${
            otherSwop?.return_laundry?.coordinate?.formatted_address
          } by ${formatDateTimeSlot(
            swop?.return_delivery_from_time,
            swop?.return_delivery_to_time,
          )}. Please pay ${formatMoneyCurrency(
            tracking?.metadata?.cleaning_fee_deduct || 0,
            swop?.currency,
          )} at the laundy (cc=${formatMoneyCurrency(
            tracking.metadata?.cleaning_fee_deduct || 0,
            swop.currency,
          )}) (SwC)`;
          break;
      }
      break;

    case 'return_delivery_assigned':
      title = 'Return Delivery Confirmed';
      subTitle = `Please be ready to receive your clothes on ${formatDateTimeSlot(
        swop?.return_delivery_from_time,
        swop?.return_delivery_to_time,
      )}. Please pay ${formatMoneyCurrency(
        parseInt(tracking?.metadata?.cleaning_fee_deduct || '0') +
          parseInt(tracking?.metadata?.delivery_fee_deduct || '0'),
        swop?.currency,
      )} to the shipper. (cc=${formatMoneyCurrency(
        parseInt(tracking.metadata?.cleaning_fee_deduct || '0'),
        swop.currency,
      )}, dc=${formatMoneyCurrency(tracking?.metadata?.delivery_fee_deduct || 0)}) (CSwC)`;
      break;

    case 'return_delivered':
      title = 'Return Delivery Successful';
      subTitle = 'You have received your clothes after the swop';
      break;

    case 'return_shipped':
      title = 'Return Shipped';
      subTitle = 'Return Shipped';
      break;

    case 'return_un_delivered':
      title = 'Return Delivery Failed';
      subTitle = `You can collect your clothes at your convenience at ${otherSwop?.return_laundry?.coordinate?.formatted_address}`;
      break;

    case 'defaulted':
      title = 'Swop Defaulted';
      subTitle = 'Swop Defaulted';
      break;
  }

  return { title, subTitle };
};

export const getTrackingSubTitleStatus = (status: ISwopTrackingStatus) => {
  return `swopStatusSubTitle:${status}`;
};

export function dataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

export const generateSwopCode = (referenceCode: string | undefined, phone: string | undefined) => {
  const swopCode = `${referenceCode || ''}${phone?.slice(-2) || ''}`;
  return swopCode;
};

export { default as Color } from './theme';
export { default as classnames } from 'classnames';
export { default as request } from './request';
export { default as config } from './config';
export { default as constants } from './constants';
