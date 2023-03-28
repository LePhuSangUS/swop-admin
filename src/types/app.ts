export type IAccountStatus = 'Active' | 'Inactive';
export type IUserCreditStatus = 'inactive' | 'active' | 'used';
export type IUserCreditSource =
  | 'referral'
  | 'admin_added'
  | 'payment_consumable'
  | 'payment_subscription'
  | 'new_user';
export type ISubscribeStatus = '';
export type IBlogStatus = 'draft' | 'published';
export type IMatchingStatus =
  | 'proposed'
  | 'canceled'
  | 'expired'
  | 'denied'
  | 'accepted'
  | 'pair_killed'
  | 'finished'
  | 'un_finished'
  | 'early_return_proposed'
  | 'early_return_confirmed'
  | 'retention_proposed'
  | 'retention_confirmed'
  | 'extension_proposed'
  | 'extension_confirmed'
  | 'return_initiated'
  | 'defaulted'
  | 'completed'
  | 'confirmed';

export type ILogisticMethod = 'laundry' | 'self' | 'chat';

export type IReSwopStatus = 'requires_action' | 'accepted' | 'denied';

export type IDeliveryType = 'pick_up' | 'delivery' | 'return_pick_up' | 'return_delivery';

export type ISwopTrackingStatus =
  | 'proposed'
  | 'accepted'
  | 'waiting_accept'
  | 'pair_killed'
  | 'expired'
  | 'pick_up_scheduled'
  | 'pick_up_attempts'
  | 'pick_up_assigned'
  | 'picked_up'
  | 'un_picked'
  | 'different'
  | 'canceled'
  | 'received'
  | 'ready'
  | 'picked'
  | 'delivery_scheduled'
  | 'delivery_attempts'
  | 'delivery_assigned'
  | 'shipped'
  | 'delivered'
  | 'un_delivered'
  | 'finished'
  | 'return_pick_up_scheduled'
  | 'return_pick_up_assigned'
  | 'return_un_picked'
  | 'return_picked'
  | 'return_received'
  | 'return_ready'
  | 'return_delivery_scheduled'
  | 'return_delivery_assigned'
  | 'return_delivered'
  | 'return_shipped'
  | 'return_un_delivered'
  | 'return_different'
  | 'early_return_proposed'
  | 'early_return_requested'
  | 'retention_requested'
  | 'extension_requested'
  | 'retention_proposed'
  | 'retention_confirmed'
  | 'extension_proposed'
  | 'extension_confirmed'
  | 'send_back'
  | 'completed'
  | 'defaulted'
  | 'return_pick_up_scheduling'
  | 'early_return_confirmed'
  | 'early_return_denied'
  | 'confirmed'
  | 'extension_denied'
  | 'retention_denied'
  | 'return_initiated'
  | 'early_return_deny'
  | 'extension_deny'
  | 'retention_deny';

export type IRole = 'admin' | 'laundry' | 'user';
export type ILang = 'vi' | 'en' | undefined;

export type IPermission =
  | 'admin_moderate_content'
  | 'admin_moderate_accounts'
  | 'admin_add_laundry'
  | 'admin_swop_journeys'
  | 'admin_deliveries'
  | 'admin_dashboard'
  | 'laundry_operation'
  | 'laundry_setting'
  | 'laundry_account';

export interface IRecords<T> {
  records: Array<T>;
}

export type IPagination<T> = {
  has_next: boolean;
  has_prev: boolean;
  per_page: number;
  next_page: number;
  current_page: number;
  prev_page: number;
  offset: number;
  records: T[];
  total_record: number;
  total_page: number;
  metadata?: any;
};

export interface IUserDevice {
  user_id: number;
  last_used: number;
  token: string;
  platform: 'ios' | 'android';
}

export interface INotificationPayloadType {}

export interface ILaundryPrice {
  cloth_category: string;
  laundry_id: string;
  unit_price: string;
  unit_price_decimal: number;
  currency: string;
}
export interface ILaundry {
  id: string;
  updated_at?: number;
  created_at?: number;
  deleted_at?: number;

  name: string;
  phone: string;

  prices?: ILaundryPrice[];
  currency: string;

  manager?: IUser;

  relationship_manager?: IUser;

  coordinate?: ICoordinate;

  members?: IUser[];

  is_admin_stop_ordering: boolean;
  is_laundry_stop_ordering: boolean;
}

export interface ISearchResponse {
  lat: number;
  lng: number;
  address: string;
  google_place_id: string;
  number?: string;
  district?: string;
  city?: string;
  country?: string;
  country_code?: string;
  street?: string;
}

export interface ICoordinate {
  id: string;
  created_at?: number;
  updated_at?: number;
  google_place_id?: string;
  lat?: number;
  lng?: number;
  formatted_address: string;
  city?: string;
  country?: string;
  country_code?: string;
  postal_code?: string;
  county?: string;
  district?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  state?: string;
  types?: string;
}

export interface ILaundryCoordinate {
  country: string;
  country_code: string;
  cities: string[];
}

export interface IReportDressCount {
  dress_id: string;
  dress_owner_id: string;
  report_text_count: number;
  report_photo_count: number;
  is_inactive: boolean;
  has_active_swop: boolean;
  has_available_swop: boolean;
}
export interface IDress {
  id: string;
  updated_at?: number;
  created_at?: number;
  type?: string;
  category?: string;
  title?: string;
  size?: string;

  distance: number;

  user_id?: string;
  user?: IUser;

  fits?: string[];
  fabrics?: string[];
  patterns?: string[];
  colors?: string[];
  styles?: string[];
  necklines?: string[];
  sleeves?: string[];
  waist_rises?: string[];
  lengths?: string[];
  legs?: string[];
  photos?: string[];
  thumbnails?: string[];
  note?: string;

  is_delist?: boolean;
  is_featured?: boolean;
  is_in_swop?: boolean;
  is_ignored?: boolean;
  total_swopable?: number;

  has_active_swop?: boolean;
  has_available_swop?: boolean;
  total_active_swop?: number;
  total_available_swop?: number;
  report_count: number;
  total_swipes: number;
  total_likes: number;

  proof_photos?: string[];
  proof_thumbnails?: string[];

  matched_fits_count: number;
  matched_fabrics_count: number;
  matched_patterns_count: number;
  matched_sleeves_count: number;
  matched_necklines_count: number;
  matched_lengths_count: number;
  matched_styles_count: number;
  matched_legs_count: number;
  matched_waist_rises_count: number;
  matched_colors_count: number;

  matched_attributes_count: number;
}

export interface IUser {
  id: string;
  token?: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  first_name: string;
  last_name: string;
  name: string;
  birthday: string;
  phone: string;
  remaining_credits: number;
  email: string;
  avatar: string;
  timezone: string;
  role: IRole;
  is_first_login: boolean;
  is_manager: boolean;
  last_login: number;
  coordinate_id: string;
  coordinate?: ICoordinate;
  measurement_id: string;
  measurement?: IMeasurement;
  dress_size: string;
  language: ILang;
  distance_setting: number;
  is_delist_dresses: boolean;
  permissions?: IPermission[];
  currency?: string;
  country_code?: string;
  overdue_balance?: string;
  laundry_id?: string;
  expo_version?: string;
  app_version?: string;
  is_defaulting?: boolean;
  is_inactive: boolean;

  total_dresses: number;
  total_swipes: number;
  total_likes: number;
  total_active_swops: number;
  total_dress_page: number;
}

interface IMeasurement {
  chest: string;
  country: string;
  hips: string;
  pattern_size: string;
  size: string;
  waist: string;
  weight: number;
  height: number;
  is_one_size_fit_all?: boolean;
}

export interface IDress {
  id: string;
  updated_at?: number;
  created_at?: number;
  deleted_at?: number;
  is_publish?: boolean;
  is_inactive?: boolean;
  has_active_swop?: boolean;
  has_available_swop?: boolean;
  type?: string;
  category?: string;
  title?: string;
  size?: string;

  user_id?: string;
  user?: IUser;

  fits?: string[];
  fabrics?: string[];
  patterns?: string[];
  colors?: string[];
  styles?: string[];
  necklines?: string[];
  sleeves?: string[];
  waist_rises?: string[];
  lengths?: string[];
  legs?: string[];
  photos?: string[];
  thumbnails?: string[];
  note?: string;

  is_delist?: boolean;
  is_hide?: boolean;
  is_ignored?: boolean;
  total_swopable?: number;

  is_different?: boolean;
  is_return_different?: boolean;
}

export interface ISwopTracking {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;

  swop_id: string;
  swop: ISwop;

  matching_id: string;

  pick_up_attempts: number;
  delivery_attempts: number;
  return_attempts: number;

  status: ISwopTrackingStatus;
  status_description: string;
  is_counter: boolean;

  metadata: {
    delivery_fee_deduct?: string;
    cleaning_fee_deduct?: string;
  };
}

export interface ISwop {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  dress_id: string;
  dress?: IDress;
  user_id: string;
  user: IUser;
  other_user_id: string;
  other_user: IUser;

  chat_disabled: boolean;
  status: ISwopTrackingStatus;
  logistic_method: ILogisticMethod;
  other_swop?: ISwop;
  other_swop_id?: string;
  matching_id?: string;
  reference_code?: string;
  trackings?: ISwopTracking[];
  is_counter?: boolean;
  laundry_id?: string;
  laundry?: ILaundry;

  coordinate_id?: string;
  coordinate?: ICoordinate;
  return_laundry_id?: string;
  return_laundry?: ILaundry;

  delivery_type?: IDeliveryType;
  deduct?: string;
  overdue_balance?: number;
  currency?: string;
  swop_fee?: number;
  cleaning_fee?: number;
  delivery_fee?: number;
  cleaning_fee_deduct?: number;
  delivery_fee_deduct?: number;
  loading?: boolean;

  completed_at: number;
  proposed_at: number;
  confirmed_at: number;
  accepted_at: number;
  finished_at: number;
  is_send_back: boolean;

  scheduled_from_time: number;
  scheduled_to_time: number;

  pick_up_attempts: number;
  return_pick_up_attempts: number;
  delivery_attempts: number;
  return_delivery_attempts: number;

  laundry_received_at: number;
  laundry_return_received_at: number;

  pick_up_scheduled_at: number;
  pick_up_assgined_at: number;
  picked_at: number;

  delivery_scheduled_at: number;
  delivery_assgined_at: number;
  delivered_at: number;

  return_pick_up_scheduled_at: number;
  return_pick_up_assgined_at: number;
  return_picked_at: number;

  return_delivery_scheduled_at: number;
  return_delivery_assgined_at: number;
  return_delivered_at: number;

  return_un_delivered_at: number;

  laundry_proof_photos: string[];
  laundry_proof_thumbnails: string[];
  user_proof_photos: string[];
  user_proof_thumbnails: string[];
  admin_proof_photos: string[];
  admin_proof_thumbnails: string[];

  re_swop_status: IReSwopStatus;

  send_back_action: string;
  send_back_reason: string;

  re_return_dress_id: string;
  re_return_dress_category: string;
  re_return_dress_type: string;
  is_re_return: boolean;

  pick_up_from_time: number;
  pick_up_to_time: number;

  return_pick_up_from_time: number;
  return_pick_up_to_time: number;

  delivery_from_time: number;
  delivery_to_time: number;

  return_delivery_from_time: number;
  return_delivery_to_time: number;

  is_early_return_requested: boolean;
  is_extension_requested: boolean;
  is_retention_requested: boolean;

  is_early_return_denied: boolean;
  is_extension_denied: boolean;
  is_retention_denied: boolean;
}

export interface IMatching {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  reference_code: string;
  status: IMatchingStatus;

  swop_id: string;
  swop: ISwop;

  counter_swop_id: string;
  counter_swop: ISwop;

  user_id: string;
  user: IUser;

  counter_id: string;
  counter: IUser;
}

export interface IUserCredit {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  expired_at: number;
  source: IUserCreditSource;
  status: IUserCreditStatus;
  user_id: string;
  swop_id: string;
  swop_code: string;
  apple_transaction_id: string;
  google_transaction_id: string;

  // Referrals
  referrer_user_id: string;
  device_uuid: string;
  device_platform: string;
}
export interface ILocationCity {
  alias: string;
  title: string;
}

export interface ICreateSource {
  alias: string;
  title: string;
}
export interface ICreateSourceStatus {
  alias: string;
  title: string;
}
export interface IConstants {
  admin_member_permissions: IPermissionConstant[];
  laundry_member_permissions: IPermissionConstant[];
  clothes: ICloth[];
  dress_sizes: IDressSizes;
  dress_categories: IDressCategory[];
  languages: string[];
  distance_settings: IDistanceSettings;
  matching_status: IMatchingStatus[];
  swop_status: ISwopTrackingStatus[];
  location_cities: ILocationCity[];
  credit_sources: ICreateSource[];
  credit_source_statues: ICreateSourceStatus[];
}

export interface IPermissionConstant {
  alias: IPermission;
  title: string;
}

export interface ICloth {
  alias: string;
  title: string;
}

export interface IDistanceSettings {
  min: number;
  max: number;
}
export interface IDressObjectValue {
  alias: string;
  title: string;
  hex_value?: string;
  image_url?: string;
}
export interface IDressCategory {
  alias: string;
  title: string;
  image_url?: string;
  types: IDressObjectValue[];
  sleeves: IDressObjectValue[];
  fits: IDressObjectValue[];
  fabrics: IDressObjectValue[];
  patterns: IDressObjectValue[];
  colors: IDressObjectValue[];
  legs: IDressObjectValue[];
  styles: IDressObjectValue[];
  lengths: IDressObjectValue[];
  necklines: IDressObjectValue[];
  waist_rises: IDressObjectValue[];
}
export interface IPatternSizes {
  alias: string;
  title: string;
  sizes: string[];
}

export interface IDressSizes {
  sizes: IDressObjectValue[];
  pattern_sizes: IPatternSizes[];
  chest_sizes: string[];
  waist_sizes: string[];
  hip_sizes: string[];
}

export type IDressInfo = Omit<IDressCategory, 'alias' | 'title' | 'types'> & {
  category: IDressObjectValue;
  type: IDressObjectValue;
};

export interface IFile {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: any;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: any;
  preview?: string;
}

export interface IDressUploadForm {
  images: Array<{ base64: string; is_blur: boolean }>;
  user_id: string;
}

export interface ISwopStats {
  total: number;
  status: ISwopTrackingStatus;
}

export interface IMatchingStats {
  total: number;
  status: IMatchingStatus;
}

export interface ISwopDeliveryScheduled extends ISwop {
  time_elapsed: number;
}

export interface ISwopPickUpScheduled extends ISwop {
  time_elapsed: number;
}

export interface ISwopDropOff extends ISwop {
  time_elapsed: number;
}
export interface ISwopPickUp extends ISwop {
  time_elapsed: number;
}

export interface ISwopPicked extends ISwop {
  time_elapsed: number;
}
export interface ISwopCompleted extends ISwop {
  time_elapsed: number;
}

export interface ISwopReturnDelivered extends ISwop {
  time_elapsed: number;
}

export interface ISwopDelivered extends ISwop {
  time_elapsed: number;
}
export interface ISwopReturnDeliveryScheduled extends ISwop {
  time_elapsed: number;
}

export interface ISwopReturnDropOff extends ISwop {
  time_elapsed: number;
}

export interface ISwopReturnPickUpScheduled extends ISwop {
  time_elapsed: number;
}

export interface ISwopReady extends ISwop {
  time_elapsed: number;
}

export interface ISwopReturnReady extends ISwop {
  time_elapsed: number;
}

export interface ISwopReturnPickUp extends ISwop {
  time_elapsed: number;
}

export interface ISwopMissingLaundry extends ISwop {
  time_elapsed: number;
}

export interface IMatchingCompleted extends IMatching {
  time_elapsed: number;
}
export interface IMatchingExpiry extends IMatching {
  time_elapsed: number;
}
export interface IMatchingFinished extends IMatching {
  time_elapsed: number;
}

export interface IMatchingReturnInitiated extends IMatching {
  time_elapsed: number;
}

export interface IMatchingEarlyReturnProposed extends IMatching {
  time_elapsed: number;
}

export interface IMatchingEarlyReturnConfirmed extends IMatching {
  time_elapsed: number;
}

export interface IMatchingCompleted extends IMatching {
  time_elapsed: number;
}

export interface IMatchingExtensionProposed extends IMatching {
  time_elapsed: number;
}

export interface IMatchingExtensionConfirmed extends IMatching {
  time_elapsed: number;
}

export interface IMatchingRetentionProposed extends IMatching {
  time_elapsed: number;
}

export interface IDispatchTaskForm {
  name: string;
  data?: object;
  delay_in_seconds?: number;
}

export interface IStatsRevenue {
  date: string;
  currency: string;
  total_laundry_earnings: string;
  total_swop_fee: string;
  total_delivery_charges: string;
}

export type IStatsCumulativeKey = keyof IStatsCumulative;
export interface IStatsCumulative {
  total_user: number;
  total_organic_user: number;
  total_referred_user: number;
  total_swop_proposed: number;
  total_swop_accepted: number;
  total_swop_accepted_meet_in_person: number;
  total_swop_accepted_pick_and_drop: number;
  total_swop_accepted_home_delivery: number;
  total_swop_defaulted: number;
  total_swop_early_returned: number;
  total_swop_retained: number;
  total_swop_extended: number;
  total_swipes: number;
  total_left_swipes: number;
  total_right_swipes: number;
  total_dress_pages: number;
  total_laundries: number;
  total_laundry_earnings: string;
  total_deliveries: number;
  total_delivery_charges: string;
  total_swop_fee: string;
  currency: string;
}

type IReportDressType = 'photo' | 'text';
export interface IReportDress {
  created_at: number;
  updated_at: number;
  reported_by_user_id: string;
  reported_by_user: IUser;
  dress_id: string;
  dress_owner_id: IUser;
  reason: string;
  type: IReportDressType;
}

export interface IDelivery extends ISwop {}

export interface IAssignDeliveryForm {
  swop_id: string;
  other_swop_id: string;
  cleaning_fee: string;
  delivery_fee: string;
  deduct: string;
  currency: string;
  re_assign_laundry_id: string;
  type: IDeliveryType;
}

export type INextStatus =
  | ISwopTrackingStatus
  | 'showQuestion'
  | 'changeDateTime'
  | 'changeAddress'
  | 'return_delivery_scheduled_for_receive'
  | 'mark_as_early_return_confirmed'
  | 'send_back_different_picked'
  | 're_return'
  | 'not_re_swop'
  | 'send_back_different_delivered'
  | 'send_back_different_return_ready'
  | 'send_back_different_return_picked';

export interface IButtonChangeStatus {
  tx: string;
  nextStatus?: INextStatus;
  disabled?: boolean;
  isSendBack?: boolean;
  onAction?: () => void;
}

export type IWebsocketEvent = 'pick_delivery_stops_exported' | 'drop_delivery_stops_exported';

export interface IWebsocketMessage {
  event_type: IWebsocketEvent;

  message_id: string;
  matching_id: string;

  from_user: {
    id: string;
    name: string;
    avatar: string;
  };
  to_user: {
    id: string;
    name: string;
    avatar: string;
  };

  name: string;
  type: IWebsocketEvent;

  content: string;

  attachment: any;

  created_at: string;

  swop_id: string;
  other_swop_id: string;

  metadata: { [key: string]: any };
  data: { [key: string]: any };
}

export interface ILookDress {
  id: string;
  updated_at?: number;
  created_at?: number;
  type?: string;
  category?: string;
  title?: string;
  size?: string;

  look_id: string;

  fits?: string[];
  fabrics?: string[];
  patterns?: string[];
  colors?: string[];
  styles?: string[];
  necklines?: string[];
  sleeves?: string[];
  waist_rises?: string[];
  lengths?: string[];
  legs?: string[];
  photos?: string[];
  thumbnails?: string[];
}
export interface ILook {
  id: string;
  updated_at?: number;
  created_at?: number;

  photo: string;
  instagram_url: string;
  dresses: ILookDress[];
}

export interface ILookDress {
  id: string;
  look_id: string;
  updated_at?: number;
  created_at?: number;
  type?: string;
  category?: string;
  size?: string;

  fits?: string[];
  fabrics?: string[];
  patterns?: string[];
  colors?: string[];
  styles?: string[];
  necklines?: string[];
  sleeves?: string[];
  waist_rises?: string[];
  lengths?: string[];
  legs?: string[];
  photos?: string[];
  thumbnails?: string[];
  tags?: string[];
}

export interface ICollection {
  id: string;
  updated_at?: number;
  created_at?: number;

  name: string;
  photo: string;
  instagram_url: string;
  total_looks: number;
}

export interface IUserStats {
  total_new_user_yesterday: number;
  total_daily_active_user_yesterday: number;
  total_user: number;
}

export interface ISwopStats {
  total_swop_accepted_yesterday: number;
  total_swop_defaulted_yesterday: number;
  total_swop_completed_yesterday: number;
}

export interface IDressStats {
  total_dresses_added_yesterday: number;
  total_swipes_yesterday: number;
  total_swops_proposed_yesterday: number;
}

export interface ILaundryStats {
  total_laundry_added_yesterday: number;
  total_received_dress_yesterday: number;
  total_revenue_yesterday: number;
}

export interface IMatchingStats {
  total_matching_accepted_yesterday: number;
  total_matching_defaulted_yesterday: number;
  total_matching_completed_yesterday: number;
}

export interface IDeliveryStats {
  total_delivery_today: number;
  total_delivery_due_tomorrow: number;
  total_tomorrow_delivery_unassigned: number;
}

export interface IPriceSetting {
  country_code: string;
  country: string;
  currency: string;
  swop_fee: number;
  delivery_per_km: number;
  swop_fee_discount_percentage: string;
}

export interface ITransaction {
  id: string;
  updated_at?: number;
  created_at?: number;
  type: string;
  amount: string;
  balance: string;
  swop_id: string;
  other_swop_id: string;
  matching_id: string;
  currency: string;
  metadata: any;
  title: string;
  description: string;
}

export interface IRemovalAIResponse {
  status: number;
  preview_demo: string;
  url: string;
  low_resolution: string;
  original_width: number;
  original_height: number;
  preview_width: number;
  preview_height: number;
  base64: string;
}

export interface IOverdueBalance {
  price: string;
  currency: string;
}

export interface IDeliveryExprotCSV {
  unit: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  date: string;
  earliest_time: string;
  latest_time: string;
  time_at_stop: string;
  notes: string;
  size: string;
  recipient_name: string;
  recipient_email_address: string;
  recipient_phone_number: string;
  id: string;
  package_count: string;
  products: string;
  seller_website: string;
  seller_name: string;
  driver: string;
}

export interface IBlog {
  id: string;
  updated_at?: number;
  created_at?: number;
  status: IBlogStatus;
  title: string;
  content: string;
  cover_photo_url: string;
  cover_photo_file: any;
  sections: IBlogSection[];
}
export interface IBlogSection {
  id?: string;
  updated_at?: number;
  created_at?: number;
  blog_id?: string;
  title?: string;
  content?: string;
  cover_photo_url?: string;
  cover_photo_file: any;
}
