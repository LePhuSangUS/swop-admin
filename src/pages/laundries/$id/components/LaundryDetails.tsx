import React from 'react';
import { Card, Tooltip } from 'antd';
import { ILaundry } from 'types';
import { Ellipsis } from 'ant-design-pro';
import { formatDate } from 'utils/date';
import styles from './LaundryDetails.less';

interface IProps {
  laundry: ILaundry;
}

class LaundryDetails extends React.PureComponent<IProps> {
  renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return null;
    }
    const type = typeof value;

    if (type === 'boolean') {
      return <span>{`${value}`}</span>;
    }

    if (type === 'string') {
      if (value.length < 100) {
        return <span>{value}</span>;
      }
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
      if (Array.isArray(value) && value.length > 0) {
        if (typeof value[0] === 'string') {
          return <span>{value.join(', ')}</span>;
        }
        return value.map((item, index) => {
          return <li key={index}>{this.renderValue(item)}</li>;
        });
      }

      return (
        <ul>
          {Object.keys(value).map((key) => {
            return (
              <li key={key}>
                <div className={styles.row}>
                  <div style={{ flex: 0.5, marginRight: 10 }}>
                    {<Ellipsis lines={1}>{key}</Ellipsis>}
                  </div>
                  <div style={{ flex: 0.5 }}>{this.renderValue(value[key])}</div>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }

    return null;
  };

  renderAttribute(title: string, value: any, hasDivider = true) {
    return (
      <React.Fragment>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{this.renderValue(value)}</div>
        {hasDivider && <div className={styles.divider} />}
      </React.Fragment>
    );
  }

  renderContent() {
    const { laundry } = this.props;
    if (!laundry) {
      return null;
    }

    return (
      <React.Fragment>
        {Object.keys(laundry).map((key) => {
          const visible =
            key !== 'prices' &&
            key !== 'coordinate' &&
            key !== 'manager' &&
            key !== 'relationship_manager';
          if (visible) {
            return this.renderAttribute(key, laundry[key]);
          }
        })}
      </React.Fragment>
    );
  }
  render() {
    return <Card title="Attributes">{this.renderContent()}</Card>;
  }
}

export default LaundryDetails;
