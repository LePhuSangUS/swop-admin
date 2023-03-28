import React from 'react';
import { Card, Tooltip } from 'antd';
import { ISwop } from 'types';
import { Ellipsis } from 'ant-design-pro';
import { formatDate } from 'utils/date';
import { formatMoneyCurrency } from 'utils/money';
import styles from './SwopDetails.less';

interface IProps {
  swop: ISwop;
}

class SwopDetails extends React.PureComponent<IProps> {
  renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return null;
    }
    const type = typeof value;

    if (type === 'boolean') {
      return <span>{`${value}`}</span>;
    }

    if (type === 'string') {
      return (
        <Ellipsis tooltip lines={1}>
          {value}
        </Ellipsis>
      );
    }

    if (type === 'number') {
      var date = formatDate(value);
      if (date !== '') {
        return <Tooltip title={value}>{date}</Tooltip>;
      }
      return <span>{value}</span>;
    }

    if (type === 'object') {
      if (Array.isArray(value)) {
        return value.map((item, index) => {
          return <li key={index}>{this.renderValue(item)}</li>;
        });
      }

      return (
        <ul>
          {Object.keys(value).map((key, index) => {
            if (key !== 'deleted_at') {
              return (
                <li key={`${key}-${index}`}>
                  <div className={styles.row}>
                    <div style={{ flex: 0.4, marginRight: 10 }}>
                      {<Ellipsis lines={1}>{key}</Ellipsis>}
                    </div>
                    <div style={{ flex: 0.7, textAlign: 'left' }}>
                      {this.renderValue(value[key])}
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      );
    }

    return null;
  };

  renderAttribute(title: string, value: any, hasDivider = true) {
    let v = value;
    switch (title) {
      case 'price':
      case 'tax':
      case 'total_price':
      case 'insurance':
      case 'shipping_fee':
        v = formatMoneyCurrency(value, this.props.swop.currency);
    }
    return (
      <React.Fragment key={title}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{this.renderValue(v)}</div>
        {hasDivider && <div className={styles.divider} />}
      </React.Fragment>
    );
  }

  renderContent() {
    const { swop } = this.props;
    if (!swop) {
      return null;
    }
    return (
      <React.Fragment>
        {Object.keys(swop).map((key) => {
          if (
            key !== 'deleted_at' &&
            key !== 'items' &&
            key !== 'shipping_address' &&
            key !== 'billing_address' &&
            key !== 'label'
          ) {
            return this.renderAttribute(key, swop[key]);
          }
        })}
      </React.Fragment>
    );
  }
  render() {
    return <Card title="Attributes">{this.renderContent()}</Card>;
  }
}

export default SwopDetails;
