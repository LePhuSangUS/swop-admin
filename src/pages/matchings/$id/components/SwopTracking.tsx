import React from 'react';
import { Card, Timeline, Spin, Button, Tag, Row, Modal, Tooltip, Col, Typography } from 'antd';
import {
  IButtonChangeStatus,
  IMatching,
  INextStatus,
  ISwop,
  ISwopTracking,
  ISwopTrackingStatus,
} from 'types';
import { formatDate } from 'utils/date';
import theme, { getSwopStatusColor } from 'utils/theme';
import { getSwopStatusDisplay } from 'utils/mapping';
import styles from './SwopTracking.less';
import { formatMoneyCurrency } from 'utils/money';
import { getTrackingTitleSubStatus } from 'utils';

interface IProps {
  loading: boolean;
  matching: IMatching;
  swop: ISwop;
  otherSwop: ISwop;
  swopTrackings: ISwopTracking[];
  otherSwopTrackings: ISwopTracking[];
  onRefreshData: (swopID: string) => void;
  onDeleteTracking: (trackingID: string) => void;
  onUpdateTracking: (tracking: ISwopTracking) => void;
  onAssignDelivery: (swop: ISwop) => void;
  onMarkStatus: (
    swopID: string,
    otherSwopID: string,
    status: INextStatus,
    isSendBack?: boolean,
  ) => void;
  onSimulateStatus: (matchingID: string, swopID: string, event: string) => void;
}

class SwopTracking extends React.PureComponent<IProps> {
  handleDelete = (record: ISwopTracking) => {
    const { onDeleteTracking } = this.props;
    Modal.confirm({
      title: 'Are you sure archive this record?',
      onOk() {
        onDeleteTracking(record.id);
      },
    });
  };

  handleMarkStatus = (status: INextStatus, isSendBack?: boolean) => {
    const { onMarkStatus, swop } = this.props;
    onMarkStatus(swop.id, swop.other_swop_id, status, isSendBack);
  };

  handleSimulateStatus = (eventType: string) => {
    const { onSimulateStatus, swop } = this.props;
    onSimulateStatus(swop.matching_id, swop.id, eventType);
  };

  renderButtonBottom = () => {
    const { matching, swop, otherSwop, onAssignDelivery } = this.props;
    let listButtons: IButtonChangeStatus[] = [];

    switch (swop?.status) {
      // case 'pick_up_scheduled':
      //   if (swop?.logistic_method === 'laundry') {
      //     listButtons = [{ tx: 'Assign Delivery', onAction: () => onAssignDelivery(swop) }];
      //   } else {
      //     listButtons = [
      //       { tx: 'Different', nextStatus: 'different' },
      //       { tx: 'Received', nextStatus: 'received' },
      //     ];
      //   }
      //   break;
      // case 'pick_up_assigned':
      //   listButtons = [
      //     {
      //       tx: 'Mark As Picked',
      //       nextStatus: 'picked',
      //       onAction: () => this.handleMarkStatus('picked'),
      //     },
      //     {
      //       tx: 'Simulate End Of Day',
      //       nextStatus: 'picked',
      //       onAction: () => this.handleSimulateStatus('swop_picked'),
      //     },
      //   ];
      //   break;
      // case 'different':
      // case 'un_picked':
      //   listButtons = [{ tx: 'Swop Cancel', disabled: true }];
      //   break;
      // case 'picked':
      //   if (otherSwop?.status !== 'un_picked' && otherSwop?.status !== 'different') {
      //     listButtons = [
      //       {
      //         tx: 'Mask As Received',
      //         nextStatus: 'received',
      //         onAction: () => this.handleMarkStatus('received'),
      //       },
      //     ];
      //   }
      //   break;
      // case 'received':
      //   listButtons = [
      //     {
      //       tx: 'Mark As Cleaned',
      //       nextStatus: 'ready',
      //       onAction: () => this.handleMarkStatus('ready'),
      //     },
      //   ];
      //   break;
      // case 'ready':
      //   listButtons = [{ tx: "Waiting Your Swopper's Cloth Delivery Scheduled", disabled: true }];
      //   break;
      // case 'delivery_scheduled':
      //   if (swop?.logistic_method === 'laundry') {
      //     listButtons = [{ tx: 'Assign Delivery', onAction: () => onAssignDelivery(swop) }];
      //   } else {
      //     listButtons = [
      //       {
      //         tx: 'Mark As Delivered',
      //         nextStatus: 'delivered',
      //         onAction: () => this.handleMarkStatus('delivered'),
      //       },
      //       // {
      //       //   // TODO
      //       //   tx: "Simulate doesn't pick up within 7 days",
      //       //   nextStatus: 'delivered',
      //       //   onAction: () => this.handleMarkStatus('delivered'),
      //       // },
      //     ];
      //   }
      //   break;
      // case 'delivery_assigned':
      // case 'un_delivered':
      //   listButtons = [
      //     {
      //       tx: 'Mark As Delivered',
      //       nextStatus: 'shipped',
      //       onAction: () => this.handleMarkStatus('shipped'),
      //     },
      //   ];
      //   break;
      // case 'return_un_delivered':
      //   listButtons = [{ tx: 'Return Un Delivered', disabled: true }];
      //   break;
      // case 'delivered':
      //   if (matching?.status === 'early_return_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Early Return Request',
      //         nextStatus: 'early_return_requested',
      //         onAction: () => this.handleMarkStatus('early_return_requested'),
      //       },
      //     ];
      //   }
      //   break;
      // case 'early_return_requested':
      //   if (matching?.status === 'retention_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Retention Request',
      //         nextStatus: 'retention_requested',
      //         onAction: () => this.handleMarkStatus('retention_requested'),
      //       },
      //     ];
      //   }
      //   break;
      // case 'retention_requested':
      //   if (matching?.status === 'extension_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Extension Request',
      //         nextStatus: 'extension_requested',
      //         onAction: () => this.handleMarkStatus('extension_requested'),
      //       },
      //     ];
      //   }
      //   break;
      // case 'shipped':
      //   listButtons = [
      //     {
      //       tx: 'No Show',
      //       nextStatus: 'un_delivered',
      //       onAction: () => {
      //         Modal.confirm({
      //           title: 'Failed To Delivery',
      //           content: (
      //             <span>
      //               If the shipper could not collect the order, please confirm here. Please return{' '}
      //               <strong>
      //                 {formatMoneyCurrency(
      //                   swop?.delivery_fee_deduct + swop?.cleaning_fee_deduct,
      //                   swop.currency,
      //                 )}
      //               </strong>{' '}
      //               to the shipper for the returned cloth.
      //             </span>
      //           ),
      //           maskClosable: true,
      //           onOk: () => this.handleMarkStatus('un_delivered'),
      //         });
      //       },
      //     },
      //     {
      //       tx: 'Simulate Delivered End Of Day',
      //       nextStatus: 'un_delivered',
      //       onAction: () => this.handleSimulateStatus('swop_delivered'),
      //     },
      //   ];
      //   break;

      // case 'finished':
      //   listButtons = [{ tx: 'Swop Finished', disabled: true }];
      //   if (matching?.status === 'finished') {
      //     listButtons = [
      //       {
      //         tx: 'Simulate Early Return Proposed',
      //         onAction: () => this.handleSimulateStatus('matching_early_return_proposed'),
      //       },
      //     ];
      //   }
      //   break;

      // case 'early_return_proposed':
      //   listButtons = [{ tx: 'Swop Early Return Proposed', disabled: true }];
      //   if (matching?.status === 'early_return_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Simulate Retention Proposed',
      //         onAction: () => this.handleSimulateStatus('matching_retention_proposed'),
      //       },
      //     ];
      //   }
      //   break;

      // case 'retention_proposed':
      //   listButtons = [{ tx: 'Swop Retention Proposed', disabled: true }];
      //   if (matching?.status === 'retention_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Simulate Extension Proposed',
      //         onAction: () => this.handleSimulateStatus('matching_extension_proposed'),
      //       },
      //     ];
      //   }
      //   break;

      // case 'extension_proposed':
      //   listButtons = [{ tx: 'Swop Extension Proposed', disabled: true }];
      //   if (matching?.status === 'extension_proposed') {
      //     listButtons = [
      //       {
      //         tx: 'Simulate Return Initiated',
      //         onAction: () => this.handleSimulateStatus('matching_return_initiated'),
      //       },
      //     ];
      //   }
      //   break;

      // //Return
      // case 'return_pick_up_scheduled':
      //   if (swop?.logistic_method === 'laundry') {
      //     listButtons = [{ tx: 'Assign Delivery', onAction: () => onAssignDelivery(swop) }];
      //   } else {
      //     listButtons = [
      //       {
      //         tx: 'Mark As Return Different',
      //         nextStatus: 'return_different',
      //         onAction: () => {
      //           Modal.confirm({
      //             title: 'Return Different',
      //             content: (
      //               <div>
      //                 Are you sure the cloth is not the same as shown in the photo? If so, this
      //                 cloth will have to be <strong>returned without cleaning</strong>.{' '}
      //                 <strong>Please do not proceed with cleaning it.</strong>
      //                 <br />
      //                 <ul>
      //                   <li>If someone has come to drop it, please return to them now. </li>
      //                   <li>
      //                     If a shipper has come to deliver, please collect the delivery. Another
      //                     shipper will come to collect it later.{' '}
      //                   </li>
      //                 </ul>
      //               </div>
      //             ),
      //             maskClosable: true,
      //             onOk: () => this.handleMarkStatus('return_different'),
      //           });
      //         },
      //       },
      //       {
      //         tx: 'Mark As Return Received',
      //         nextStatus: 'return_received',
      //         onAction: () => this.handleMarkStatus('return_received'),
      //       },
      //       {
      //         tx: 'Simulate 7 days',
      //         nextStatus: 'return_received',
      //         onAction: () => this.handleSimulateStatus('swop_return_drop_off'),
      //       },
      //     ];
      //   }
      //   break;
      // case 'return_pick_up_assigned':
      //   listButtons = [
      //     {
      //       tx: 'Mark As Return Picked',
      //       nextStatus: 'return_picked',
      //       onAction: () => this.handleMarkStatus('return_picked'),
      //     },
      //     {
      //       tx: 'Simulate End Of Day',
      //       nextStatus: 'return_picked',
      //       onAction: () => this.handleSimulateStatus('swop_return_picked'),
      //     },
      //   ];

      //   break;
      // case 'send_back':
      //   listButtons = [
      //     { tx: 'Mark As Send Back', onAction: () => this.handleMarkStatus('send_back') },
      //   ];

      //   break;
      // case 'return_picked':
      //   if (
      //     otherSwop?.status === 'return_picked' ||
      //     otherSwop?.status === 'return_received' ||
      //     otherSwop?.status === 'return_ready'
      //   ) {
      //     listButtons = [
      //       {
      //         tx: 'Received',
      //         nextStatus: 'return_received',
      //         onAction: () => this.handleMarkStatus('return_received'),
      //       },
      //     ];
      //   } else if (otherSwop?.status === 'return_pick_up_scheduled') {
      //   } else if (
      //     otherSwop?.status === 'return_different' ||
      //     otherSwop?.status === 'return_un_picked'
      //   ) {
      //   }

      //   // {
      //   //   tx: 'Mark As Return Different',
      //   //   nextStatus: 'return_different',
      //   //   onAction: () => {
      //   //     Modal.confirm({
      //   //       title: 'Return Different',
      //   //       content: (
      //   //         <div>
      //   //           Are you sure the cloth is not the same as shown in the photo? If so, this
      //   //           cloth will have to be <strong>returned without cleaning</strong>.{' '}
      //   //           <strong>Please do not proceed with cleaning it.</strong>
      //   //           <br />
      //   //           <ul>
      //   //             <li>If someone has come to drop it, please return to them now. </li>
      //   //             <li>
      //   //               If a shipper has come to deliver, please collect the delivery. Another
      //   //               shipper will come to collect it later.{' '}
      //   //             </li>
      //   //           </ul>
      //   //         </div>
      //   //       ),
      //   //       maskClosable: true,
      //   //       onOk: () => this.handleMarkStatus('return_different'),
      //   //     });
      //   //   },
      //   // },

      //   break;
      // case 'return_received':
      //   listButtons = [
      //     {
      //       tx: 'Mark As Cleaned',
      //       nextStatus: 'return_ready',
      //       onAction: () => this.handleMarkStatus('return_ready'),
      //     },
      //   ];
      //   break;
      // case 'return_ready':
      //   listButtons = [
      //     {
      //       tx: 'Mark AS Return Delivery Scheduled',
      //       onAction: () => this.handleMarkStatus('return_delivery_scheduled'),
      //     },
      //   ];
      //   break;
      // case 'return_delivery_scheduled': {
      //   if (swop?.logistic_method === 'laundry') {
      //     listButtons = [{ tx: 'Assign Delivery', onAction: () => onAssignDelivery(swop) }];
      //   } else {
      //     listButtons = [
      //       {
      //         tx: 'Mark As Return Delivered',
      //         nextStatus: 'return_delivered',
      //         onAction: () => this.handleMarkStatus('return_delivered'),
      //       },
      //       {
      //         tx: 'Simulate 7 days',
      //         nextStatus: 'return_delivered',
      //         onAction: () => this.handleSimulateStatus('swop_return_pick_up'),
      //       },
      //     ];
      //   }
      //   break;
      // }
      // case 'return_delivery_assigned': {
      //   listButtons = [
      //     {
      //       tx: 'Mark AS Return Delivery Shipped',
      //       nextStatus: 'return_shipped',
      //       onAction: () => this.handleMarkStatus('return_shipped'),
      //     },
      //   ];
      //   break;
      // }
      // case 'return_shipped': {
      //   listButtons = [
      //     {
      //       tx: 'No Show',
      //       nextStatus: 'return_un_delivered',
      //       onAction: () => this.handleMarkStatus('return_un_delivered'),
      //     },
      //     {
      //       tx: 'Simulate End Of Day',
      //       nextStatus: 'return_un_delivered',
      //       onAction: () => this.handleSimulateStatus('swop_return_delivered'),
      //     },
      //   ];
      //   break;
      // }
      // case 'return_delivered': {
      //   listButtons = [{ tx: 'Completed', disabled: true }];
      //   break;
      // }

      // default:
      //   listButtons = [];
      //   break;
      case 'proposed':
      case 'confirmed':
        listButtons = [
          {
            tx: 'common:cancel',
            nextStatus: 'pair_killed',
            onAction: () => this.handleMarkStatus('canceled'),
          },
        ];
        break;
      case 'pick_up_scheduled':
      case 'return_delivery_scheduled':
        if (swop?.logistic_method === 'laundry') {
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        }
        break;

      case 'different':
        if (
          swop?.status === 'different' &&
          swop?.send_back_reason === 'different_delivered' &&
          swop?.send_back_action === 'delivered_requires_action'
        ) {
          listButtons = [
            {
              tx: 'common:confirm',
              nextStatus: 'send_back_different_delivered',
              isSendBack: true,
              onAction: () => this.handleMarkStatus('send_back_different_delivered'),
            },
          ];
        }
        break;

      case 'picked':
        if (
          otherSwop?.status === 'picked' ||
          otherSwop?.status === 'received' ||
          otherSwop?.status === 'ready'
        ) {
          listButtons = [
            {
              tx: 'changeSwopStatus:received',
              nextStatus: 'received',
              onAction: () => this.handleMarkStatus('received'),
            },
          ];
        }
        break;
      case 'received':
        listButtons = [
          {
            tx: 'changeSwopStatus:cleaned',
            nextStatus: 'ready',
            onAction: () => this.handleMarkStatus('ready'),
          },
        ];
        break;
      case 'delivery_scheduled':
      case 'return_pick_up_scheduled':
        if (otherSwop?.logistic_method === 'laundry') {
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        } else if (
          otherSwop?.send_back_action === 'different_return_picked_approved' &&
          swop?.logistic_method === 'laundry'
        ) {
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:delivered',
              nextStatus: 'delivered',
              onAction: () => this.handleMarkStatus('delivered'),
            },
          ];
        }
        break;
      case 'delivery_assigned':
      case 'un_delivered':
      case 'return_un_delivered':
        listButtons = [
          {
            tx: 'changeSwopStatus:delivered',
            nextStatus: 'shipped',
            onAction: () => this.handleMarkStatus('shipped'),
          },
        ];
        break;
      case 'shipped':
        listButtons = [
          {
            tx: 'changeSwopStatus:noShow',
            nextStatus: 'un_delivered',
            onAction: () => this.handleMarkStatus('un_delivered'),
          },
        ];
        break;

      case 'early_return_proposed':
        if (
          otherSwop?.is_early_return_requested &&
          (swop?.is_early_return_denied || swop?.is_early_return_requested)
        ) {
          listButtons = [
            {
              tx: 'changeSwopStatus:acceptEarlyReturn',
              nextStatus: 'early_return_requested',
              onAction: () => this.handleMarkStatus('early_return_requested'),
            },
            {
              tx: 'changeSwopStatus:denyEarlyReturn',
              nextStatus: 'early_return_deny',
              onAction: () => this.handleMarkStatus('early_return_deny'),
            },
          ];
        } else if (!otherSwop?.is_early_return_requested && !swop?.is_early_return_requested) {
          listButtons = [
            {
              tx: 'changeSwopStatus:requestEarlyReturn',
              nextStatus: 'early_return_requested',
              onAction: () => this.handleMarkStatus('early_return_requested'),
            },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:acceptEarlyReturn',
              nextStatus: 'early_return_requested',
              onAction: () => this.handleMarkStatus('early_return_requested'),
            },
            {
              tx: 'changeSwopStatus:denyEarlyReturn',
              nextStatus: 'early_return_deny',
              onAction: () => this.handleMarkStatus('early_return_deny'),
            },
          ];
        }
        break;

      case 'retention_proposed':
        if (
          otherSwop?.is_retention_requested &&
          (swop?.is_retention_denied || swop?.is_retention_requested)
        ) {
          listButtons = [
            {
              tx: 'changeSwopStatus:acceptRetention',
              nextStatus: 'retention_requested',
              onAction: () => this.handleMarkStatus('retention_requested'),
            },
            {
              tx: 'changeSwopStatus:denyRetention',
              nextStatus: 'retention_deny',
              onAction: () => this.handleMarkStatus('retention_deny'),
            },
          ];
        } else if (otherSwop?.is_retention_requested && !swop?.is_retention_requested) {
          listButtons = [
            {
              tx: 'changeSwopStatus:requestRetention',
              nextStatus: 'retention_requested',
              onAction: () => this.handleMarkStatus('retention_requested'),
            },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:acceptRetention',
              nextStatus: 'retention_requested',
              onAction: () => this.handleMarkStatus('retention_requested'),
            },
            {
              tx: 'changeSwopStatus:denyRetention',
              nextStatus: 'retention_deny',
              onAction: () => this.handleMarkStatus('retention_deny'),
            },
          ];
        }
        break;

      case 'extension_proposed':
        if (
          otherSwop?.is_extension_requested &&
          (swop?.is_extension_denied || swop?.is_extension_requested)
        ) {
          listButtons = [];
        } else if (otherSwop?.is_extension_requested && !swop?.is_extension_requested) {
          listButtons = [
            {
              tx: 'changeSwopStatus:requestExtension',
              nextStatus: 'extension_requested',
              onAction: () => this.handleMarkStatus('extension_requested'),
            },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:acceptExtension',
              nextStatus: 'extension_requested',
              onAction: () => this.handleMarkStatus('extension_requested'),
            },
            {
              tx: 'changeSwopStatus:denyExtension',
              nextStatus: 'extension_deny',
              onAction: () => this.handleMarkStatus('extension_deny'),
            },
          ];
        }
        break;

      //Return
      case 'return_pick_up_scheduled':
        if (swop?.logistic_method === 'laundry') {
          // listButtons = [{tx: 'Waiting Admin Assign', disabled: true}];
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:different',
              nextStatus: 'return_different',
              onAction: () => this.handleMarkStatus('return_different'),
            },
            {
              tx: 'changeSwopStatus:received',
              nextStatus: 'return_received',
              onAction: () => this.handleMarkStatus('return_received'),
            },
          ];
        }
        break;
      case 'return_pick_up_assigned':
        if (otherSwop?.status !== 'different' && otherSwop?.status !== 'return_un_picked') {
          listButtons = [
            {
              tx: 'changeSwopStatus:different',
              nextStatus: 'return_different',
              onAction: () => this.handleMarkStatus('return_different'),
            },
            {
              tx: 'changeSwopStatus:received',
              nextStatus: 'return_received',
              onAction: () => this.handleMarkStatus('return_received'),
            },
          ];
        }

        break;

      case 'return_picked':
        if (
          matching?.status !== 'defaulted' &&
          (swop?.status === 'return_picked' ||
            swop?.status === 'return_received' ||
            swop?.status === 'return_ready')
        ) {
          listButtons = [{ tx: 'changeSwopStatus:received', nextStatus: 'return_received' }];
        } else if (matching?.status !== 'defaulted') {
          // listButtons = [{ tx: 'Waiting CSW Picked', disabled: true }];
          listButtons = [];
        } else if (
          otherSwop?.send_back_action === 'different_return_picked_requires_action' ||
          otherSwop?.status === 'return_un_picked'
        ) {
          listButtons = [
            {
              tx: 'changeSwopStatus:sendBack',
              nextStatus: 'send_back_different_return_picked',
              isSendBack: true,
              onAction: () => this.handleMarkStatus('send_back_different_return_picked'),
            },
          ];
        }

        break;

      case 'return_received':
        listButtons = [
          {
            tx: 'changeSwopStatus:cleaned',
            nextStatus: 'return_ready',
            onAction: () => this.handleMarkStatus('return_ready'),
          },
        ];
        break;
      case 'return_ready':
        if (
          otherSwop?.send_back_action === 'different_return_picked_requires_action' ||
          otherSwop?.status === 'return_un_picked'
        ) {
          listButtons = [
            {
              tx: 'changeSwopStatus:sendBack',
              nextStatus: 'send_back_different_return_ready',
              isSendBack: true,
              onAction: () => this.handleMarkStatus('send_back_different_return_ready'),
            },
          ];
        }
        break;

      case 'return_delivery_scheduled': {
        if (swop?.logistic_method === 'laundry') {
          // listButtons = [{tx: 'Waiting Admin Assign', disabled: true}];
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        } else {
          listButtons = [
            {
              tx: 'changeSwopStatus:delivered',
              nextStatus: 'return_delivered',
              onAction: () => this.handleMarkStatus('return_delivered'),
            },
          ];
        }
        break;
      }
      case 'return_delivery_assigned': {
        listButtons = [
          {
            tx: 'changeSwopStatus:delivered',
            nextStatus: 'return_shipped',
            onAction: () => this.handleMarkStatus('return_shipped'),
          },
        ];
        break;
      }
      case 'return_shipped': {
        listButtons = [
          {
            tx: 'changeSwopStatus:noShow',
            nextStatus: 'return_un_delivered',
            onAction: () => this.handleMarkStatus('return_un_delivered'),
          },
        ];
        break;
      }
      case 'return_pick_up_scheduled':
      case 'return_delivery_scheduled':
        if (swop?.logistic_method === 'laundry') {
          listButtons = [
            { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
            { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
          ];
        }
        break;

      case 'return_different': {
        if (
          otherSwop?.send_back_action === 'different_return_delivered_requires_action' ||
          swop?.send_back_action === 'different_return_delivered_requires_action'
        ) {
          listButtons = [
            {
              tx: 'common:reReturn',
              nextStatus: 're_return',
              isSendBack: true,
              onAction: () => this.handleMarkStatus('re_return'),
            },
            {
              tx: 'common:noReturn',
              nextStatus: 'not_re_swop',
              isSendBack: true,
              // onAction: () => this.handleMarkStatus('completed'),
            },
          ];
        }

        break;
      }

      default:
        break;
    }

    if (
      otherSwop?.status === 'return_picked' &&
      otherSwop?.send_back_action === 'different_return_picked_requires_action'
    ) {
      listButtons = [
        {
          tx: 'changeSwopStatus:sendBack',
          nextStatus: 'send_back_different_return_picked',
        },
      ];
    }

    if (
      otherSwop?.status === 'return_ready' &&
      swop?.send_back_reason === 'laundry_different_return_picked'
    ) {
      listButtons = [
        {
          tx: 'changeSwopStatus:sendBack',
          nextStatus: 'send_back_different_return_ready',
        },
      ];
    }

    if (
      otherSwop?.status === 'delivery_scheduled' &&
      swop?.send_back_action === 'different_return_picked_approved'
    ) {
      if (swop?.logistic_method === 'laundry') {
        listButtons = [
          { tx: 'common:changeDateTime', nextStatus: 'changeDateTime' },
          { tx: 'common:changeAddress', nextStatus: 'changeAddress' },
        ];
      } else {
        listButtons = [{ tx: 'changeSwopStatus:delivered', nextStatus: 'delivered' }];
      }
    }

    return (
      <Row type="flex" gutter={[12, 12]} style={{ marginTop: 16 }}>
        {listButtons.map((item, index) => {
          return (
            <Col>
              {item.disabled ? (
                <Typography.Text disabled>{item.tx}</Typography.Text>
              ) : (
                <Button
                  key={`${index}-${item.nextStatus}`}
                  disabled={item.disabled}
                  onClick={() => {
                    if (typeof item?.onAction === 'function') {
                      return item.onAction();
                    }
                  }}
                >
                  {item.tx}
                </Button>
              )}
            </Col>
          );
        })}
      </Row>
    );
  };

  renderAttribute(title: string, value: any, hasDivider = true) {
    return (
      <div className={styles.row}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
        {hasDivider && <div className={styles.divider} />}
      </div>
    );
  }

  renderTimelineItem = (item: ISwopTracking, index: number) => {
    const { swopTrackings, swop, otherSwop, matching } = this.props;
    const dateTime = formatDate(item.created_at);
    const lastItem = index === swopTrackings.length - 1;
    const { title, subTitle } = getTrackingTitleSubStatus(item?.status, swop, otherSwop, item);
    return (
      <Timeline.Item key={`${index}-${item.id}`} color={theme.colors.pink} pending={false}>
        <Tooltip title={item.id}>
          <span>{`${dateTime}`}</span>
        </Tooltip>
        <Row style={{ marginTop: 10 }}>
          <Tooltip title={item.status}>
            <Tag color={getSwopStatusColor(item.status)}>{getSwopStatusDisplay(item.status)}</Tag>
          </Tooltip>
        </Row>
        <br />
        <Typography.Paragraph disabled={!lastItem}>
          <strong>{title}</strong>
        </Typography.Paragraph>
        <Typography.Text disabled={!lastItem}>{subTitle}</Typography.Text>

        {lastItem &&
        swop?.logistic_method !== 'chat' &&
        matching?.status !== 'canceled' &&
        matching?.status !== 'expired' &&
        matching?.status !== 'pair_killed' &&
        matching?.status !== 'completed'
          ? this.renderButtonBottom()
          : null}
      </Timeline.Item>
    );
  };

  renderTimeline = () => {
    const { swopTrackings, matching, swop } = this.props;
    const processing =
      swop?.logistic_method !== 'chat' &&
      matching?.status !== 'canceled' &&
      matching?.status !== 'expired' &&
      matching?.status !== 'pair_killed' &&
      matching?.status !== 'completed';
    return (
      <Timeline pending={processing && 'Processing...'}>
        {swopTrackings?.map((item, index) => this.renderTimelineItem(item, index))}
      </Timeline>
    );
  };

  handleRefreshData = () => {
    const { onRefreshData, swop } = this.props;
    onRefreshData(swop.id);
  };

  render() {
    const { loading = false } = this.props;
    return (
      <Spin spinning={loading}>
        <Card
          title="Tracking"
          extra={
            <Row>
              <Button className={styles.buttonGroup} onClick={this.handleRefreshData} icon="reload">
                Refresh Data
              </Button>
            </Row>
          }
        >
          <div className={styles.divider} />
          <br />
          {this.renderTimeline()}
        </Card>
      </Spin>
    );
  }
}

export default SwopTracking;
