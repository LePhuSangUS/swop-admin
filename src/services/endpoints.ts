export default {
  // Auth
  login: 'POST /api/v1/admin/login',

  // Me
  logout: 'DELETE /api/v1/me/user/logout',
  getMe: 'GET /api/v1/me',

  // Stats
  statsRevenue: '/api/v1/admin/stats/revenue',
  statsCumulative: '/api/v1/admin/stats/cumulative',

  // Setting
  getListPriceSettings: '/api/v1/admin/setting/list_price_setting',
  updatePriceSetting: 'PUT /api/v1/admin/setting/update_price_setting',

  // User
  sendPushNotification: 'POST /api/v1/admin/user/push_notification',
  getListUser: '/api/v1/admin/user/list',
  countUser: '/api/v1/admin/user/count',
  searchUser: '/api/v1/admin/user/search',
  activateUser: 'PUT /api/v1/admin/user/:id/activate',
  deactivateUser: 'PUT /api/v1/admin/user/:id/deactivate',
  unArchiveUser: 'PUT /api/v1/admin/user/:id/un_archive',
  requestToken: 'POST /api/v1/admin/user/:id/request_token',
  removeUser: 'DELETE /api/v1/admin/user/:id/archive',
  deleteUser: 'DELETE /api/v1/admin/user/:id',
  updateUser: 'PUT /api/v1/admin/user/:id',
  createUser: 'POST /api/v1/admin/user',
  getUser: '/api/v1/admin/user/:id',
  getListDeviceOfUser: '/api/v1/admin/user/:id/list_device',
  addUserDevice: 'POST /api/v1/admin/user/:id/device',
  removeUserDevice: 'DELETE /api/v1/admin/user/:id/device/:device_token',
  getUserStats: '/api/v1/admin/user/stats',
  getUserOverdueBalance: '/api/v1/admin/user/:id/overdue_balance',
  getListOtherDress: '/api/v1/admin/user/:id/list_other_dresses',

  // Credit
  getListCredit: '/api/v1/admin/credit/list',
  updateCredit: 'PUT /api/v1/admin/credit/:id',
  addCredit: 'POST /api/v1/admin/credit',

  // Laundry
  searchLaundry: '/api/v1/admin/laundry/search',
  getListLaundry: '/api/v1/admin/laundry/list',
  getLaundryStats: '/api/v1/admin/laundry/stats',
  countLaundry: '/api/v1/admin/laundry/count',
  activateLaundry: 'POST /api/v1/admin/laundry/:id/activate',
  assignDelivery: 'POST /api/v1/admin/laundry/assign_delivery',
  removeLaundry: 'DELETE /api/v1/admin/laundry/:id',
  updateLaundry: 'PUT /api/v1/admin/laundry/:id',
  createLaundry: 'POST /api/v1/admin/laundry',
  getLaundry: '/api/v1/admin/laundry/:id',
  updateLaundryPrice: 'PUT /api/v1/admin/laundry/:id/update_price',
  getSwopAssignedToLaundry: '/api/v1/admin/laundry/:id/swops',

  // Delivery
  getListDelivery: '/api/v1/admin/delivery/list',
  getDeliveryStats: '/api/v1/admin/delivery/stats',
  updateDelivery: 'PUT /api/v1/admin/delivery/:id',
  getDelivery: '/api/v1/admin/delivery/:id',

  // Look Dress
  getListLookDress: '/api/v1/admin/look_dress/list',
  getLookDress: '/api/v1/admin/look_dress/:id',
  updateLookDress: 'PUT /api/v1/admin/look_dress/:id',
  deleteLookDress: 'DELETE /api/v1/admin/look_dress/:id',
  createLookDress: 'POST /api/v1/admin/look_dress',
  uploadLookDressPhotos: 'POST /api/v1/admin/look_dress/upload_photos',

  getPickSwopperStops: '/api/v1/admin/delivery/pick_swopper_stops',
  getPickLaundryStops: '/api/v1/admin/delivery/pick_laundry_stops',
  getDropSwopperStops: '/api/v1/admin/delivery/drop_swopper_stops',
  getDropLaundryStops: '/api/v1/admin/delivery/drop_laundry_stops',

  getPickStops: '/api/v1/admin/delivery/pick_stops',
  getDropStops: '/api/v1/admin/delivery/drop_stops',

  exportPickStops: 'POST /api/v1/admin/delivery/export_pick_stops',
  exportDropStops: 'POST /api/v1/admin/delivery/export_drop_stops',

  // Look
  getListLook: '/api/v1/admin/look/list',
  getLook: '/api/v1/admin/look/:id',
  updateLook: 'PUT /api/v1/admin/look/:id',
  deleteLook: 'DELETE /api/v1/admin/look/:id',
  createLook: 'POST /api/v1/admin/look',

  // Collection
  getListCollection: '/api/v1/admin/collection/list',
  getCollection: '/api/v1/admin/collection/:id',
  updateCollection: 'PUT /api/v1/admin/collection/:id',
  deleteCollection: 'DELETE /api/v1/admin/collection/:id',
  createCollection: 'POST /api/v1/admin/collection',
  uploadCollectionPhotos: 'POST /api/v1/admin/collection/{id}/upload_photos',

  // Swops
  getListSwop: '/api/v1/admin/swop/list',
  getSwopStats: '/api/v1/admin/swop/stats',
  getSwopStatusStats: '/api/v1/admin/swop/status_stats',
  getSwop: '/api/v1/admin/swop/:id',
  updateSwop: 'PUT /api/v1/admin/swop/:id',
  deleteSwop: 'DELETE /api/v1/admin/swop/:id',
  activateSwop: 'PUT /api/v1/admin/swop/:id/activate',
  countSwop: '/api/v1/admin/swop/count',
  getSwopTracking: '/api/v1/admin/swop/:id/trackings',
  getSwopTransactions: '/api/v1/admin/swop/:id/transactions',
  getListSwopDeliveryScheduled: '/api/v1/admin/swop/list_delivery_scheduled',
  getListSwopDeliveryScheduledForDifferent:
    '/api/v1/admin/swop/list_delivery_scheduled_for_different',
  getListSwopDropOff: '/api/v1/admin/swop/list_drop_off',
  getListSwopReady: '/api/v1/admin/swop/list_ready',
  getListSwopReturnReady: '/api/v1/admin/swop/list_return_ready',
  getListSwopReadyIfOtherDifferent: '/api/v1/admin/swop/list_ready_if_other_different',
  getListSwopReturnReadyIfOtherDifferent: '/api/v1/admin/swop/list_return_ready_if_other_different',
  getListSwopPickUpScheduledIfOtherDifferent:
    '/api/v1/admin/swop/list_pick_up_scheduled_if_other_different',
  getListSwopPickUp: '/api/v1/admin/swop/list_pick_up',
  getListSwopPicked: '/api/v1/admin/swop/list_picked',
  getListSwopDelivered: '/api/v1/admin/swop/list_delivered',
  getListSwopReturnDelivered: '/api/v1/admin/swop/list_return_delivered',
  getListSwopReturnDeliveryScheduledForDifferent:
    '/api/v1/admin/swop/list_return_delivery_scheduled_for_different',
  getListSwopReturnDropOff: '/api/v1/admin/swop/list_return_drop_off',
  getListSwopReturnPickUpScheduled: '/api/v1/admin/swop/list_return_pick_up_scheduled',
  getListSwopReturnPickUp: '/api/v1/admin/swop/list_return_pick_up',
  fixSameLaundry: 'PUT /api/v1/admin/swop/:id/fix_same_laundry',
  fixSameReturnLaundry: 'PUT /api/v1/admin/swop/:id/fix_same_return_laundry',
  markSwopStatus: 'PUT /api/v1/admin/swop/:swop_id/mark_as_:status',

  // Matching
  getMatchingStats: '/api/v1/admin/matching/stats',
  getMatchingStatusStats: '/api/v1/admin/matching/status_stats',
  getListMatching: '/api/v1/admin/matching/list',
  updateMatching: 'PUT /api/v1/admin/matching/:id',
  getMatching: '/api/v1/admin/matching/:id',
  getListMatchingCompleted: '/api/v1/admin/matching/list_completed',
  getListMatchingExpiry: '/api/v1/admin/matching/list_expiry',
  getListMatchingFinished: '/api/v1/admin/matching/list_finished',
  getListMatchingRetentionProposed: '/api/v1/admin/matching/list_retention_proposed',
  getListMatchingEarlyReturnProposed: '/api/v1/admin/matching/list_early_return_proposed',
  getListMatchingEarlyReturnConfirmed: '/api/v1/admin/matching/list_early_return_confirmed',
  getListMatchingReturnInitiated: '/api/v1/admin/matching/list_return_initiated',
  getListMatchingReturnInitiatedForChat: '/api/v1/admin/matching/list_return_initiated_for_chat',
  getListMatchingCompletedForChat: '/api/v1/admin/matching/list_completed_for_chat',
  getListMatchingExtensionProposed: '/api/v1/admin/matching/list_extension_proposed',
  getListMatchingExtensionConfirmed: '/api/v1/admin/matching/list_extension_confirmed',
  markAsEarlyReturnConfirmed: 'PUT /api/v1/admin/matching/:id/mark_as_early_return_confirmed',
  markAsRetentionConfirmed: 'PUT /api/v1/admin/matching/:id/mark_as_retention_confirmed',

  // Dress
  getListDressReported: '/api/v1/admin/dress/list_reports',
  getListDress: '/api/v1/admin/dress/list',
  getDressStats: '/api/v1/admin/dress/stats',
  updateDress: 'PUT /api/v1/admin/dress/:id',
  activateDress: 'PUT /api/v1/admin/dress/:id/activate',
  deactivateDress: 'DELETE /api/v1/admin/dress/:id/deactivate',
  archiveDress: 'DELETE /api/v1/admin/dress/:id/archive',
  unArchiveDress: 'PUT /api/v1/admin/dress/:id/un_archive',
  getDress: '/api/v1/admin/dress/:id',
  getActiveSwopsOfDress: '/api/v1/admin/dress/:id/list_active_swops',
  getAvailableSwopsDress: '/api/v1/admin/dress/:id/list_available_swops',
  countDress: '/api/v1/admin/dress/count',
  uploadDressPhotos: 'POST /api/v1/admin/dress/upload_photos',
  getListDressReportDetails: '/api/v1/admin/dress/:id/list_report',

  // Tracking
  deleteSwopTracking: 'DELETE /api/v1/admin/tracking/:id',
  updateSwopTracking: 'PUT /api/v1/admin/tracking/:id',
  createSwopTracking: 'POST /api/v1/admin/tracking',

  // Common
  getS3Signature: 'POST /api/v1/common/s3_signature',
  getAppConstants: '/api/v1/common/constants',
  dispatchTask: 'POST /api/v1/common/task/dispatch',

  // Reports
  listReportCount: '/api/v1/admin/report/list_count',

  // Transactions
  listTransaction: '/api/v1/admin/transaction/list',
  createTransaction: 'POST /api/v1/admin/transaction',

  // Admin Sendback
  adminSendBack: 'PUT /api/v1/admin/swop/:swop_id/:status',
  markAsCompleted: 'PUT api/v1/admin/matching/:id/mark_as_completed',

  getListBlog: 'api/v1/admin/blog/list',
  getBlog: 'api/v1/admin/blog/:id',
  createBlog: 'POST api/v1/admin/blog',
  draftBlog: 'PUT api/v1/admin/blog/:id/draft',
  publishBlog: 'PUT api/v1/admin/blog/:id/publish',
  updateBlog: 'PUT api/v1/admin/blog/:id',
};
