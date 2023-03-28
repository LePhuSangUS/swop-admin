import React from 'react';
import { Card, Collapse, Icon } from 'antd';
import { IAddress } from 'types';
import { Location } from 'components';
import { getFormattedAddress } from 'utils/mapping';
import styles from './Address.less';

const { Panel } = Collapse;

interface IProps {
  address: IAddress;
  title: string;
}

class Address extends React.PureComponent<IProps> {
  renderAttribute(title: string, value: any, titleFlex = 0.2, hasDivider = true) {
    return (
      <div className={styles.row}>
        <div style={{ flex: titleFlex }} className={styles.title}>
          {title}
        </div>
        <div className={styles.value}>{value}</div>
        {hasDivider && <div className={styles.divider} />}
      </div>
    );
  }

  renderExtraButton = () => (
    <Icon
      type="setting"
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  renderHeader = () => {
    const { address } = this.props;
    return (
      <div style={{ marginLeft: !address ? -10 : -15 }} className={styles.row}>
        <div className={styles.title}>Address</div>
        {address != null && (
          <div className={styles.value}>
            <Location
              location={{
                address: getFormattedAddress(address?.coordinate),
                google_place_id: address?.coordinate?.google_place_id,
                lat: parseFloat(address?.coordinate?.lat),
                lng: parseFloat(address?.coordinate?.lng),
              }}
            />
          </div>
        )}
      </div>
    );
  };
  render() {
    const { title, address } = this.props;
    return (
      <Card title={title}>
        {this.renderAttribute('Name', address?.name)}
        {this.renderAttribute('Phone', address?.phone)}
        <Collapse
          style={{ backgroundColor: 'transparent' }}
          bordered={false}
          expandIconPosition="right"
        >
          <Panel header={this.renderHeader()} key="1" showArrow={address != null}>
            <div>
              {this.renderAttribute('ID', address?.coordinate?.id, 0.4)}
              {this.renderAttribute('Address 1', address?.coordinate?.address1, 0.4)}
              {this.renderAttribute('Address 2', address?.coordinate?.address2, 0.4)}
              {this.renderAttribute('Address 3', address?.coordinate?.address3, 0.4)}
              {this.renderAttribute('City', address?.coordinate?.city, 0.4)}
              {this.renderAttribute('Postal Code', address?.coordinate?.post_code, 0.4)}
              {this.renderAttribute('Number', address?.coordinate?.number, 0.4)}
              {this.renderAttribute('Street', address?.coordinate?.street, 0.4)}
              {this.renderAttribute('State', address?.coordinate?.state, 0.4)}
              {this.renderAttribute('District', address?.coordinate?.district, 0.4)}
              {this.renderAttribute('Neighborhood', address?.coordinate?.neighborhood, 0.4)}
              {this.renderAttribute('Country', address?.coordinate?.country, 0.4)}
              {this.renderAttribute('Latitude', address?.coordinate?.lat, 0.4)}
              {this.renderAttribute('Longitude', address?.coordinate?.lng, 0.4)}
            </div>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}

export default Address;
