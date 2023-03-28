import React from 'react';
import { Card, Collapse } from 'antd';
import { ICoordinate } from 'types';
import { Location } from 'components';
import { getFormattedAddress } from 'utils/mapping';
import styles from './Coordinate.less';

const { Panel } = Collapse;

interface IProps {
  coordinate: ICoordinate;
  title: string;
  activeKeys?: string[];
}

class Coordinate extends React.PureComponent<IProps> {
  renderAttribute(title: string, value: any, titleFlex = 0.3, hasDivider = true) {
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

  renderHeader = () => {
    const { coordinate } = this.props;
    return (
      <div style={{ marginLeft: !coordinate ? -10 : -15 }} className={styles.row}>
        <div className={styles.title}>Address</div>
        <div className={styles.value}>
          {!coordinate ? (
            <span>This was not set</span>
          ) : (
            <Location
              location={{
                address: getFormattedAddress(coordinate),
                google_place_id: coordinate?.google_place_id,
                lat: coordinate?.lat,
                lng: coordinate?.lng,
              }}
            />
          )}
        </div>
      </div>
    );
  };

  render() {
    const { title, coordinate, activeKeys } = this.props;
    return (
      <Card title={title}>
        <Collapse
          defaultActiveKey={activeKeys}
          style={{ backgroundColor: 'transparent' }}
          bordered={false}
          expandIconPosition="right"
        >
          <Panel header={this.renderHeader()} key="1" showArrow={coordinate !== null}>
            <div>
              {this.renderAttribute('ID', coordinate?.id, 0.4)}
              {this.renderAttribute('City', coordinate?.city, 0.4)}
              {this.renderAttribute('Postal Code', coordinate?.postal_code, 0.4)}
              {this.renderAttribute('Number', coordinate?.number, 0.4)}
              {this.renderAttribute('Street', coordinate?.street, 0.4)}
              {this.renderAttribute('State', coordinate?.state, 0.4)}
              {this.renderAttribute('District', coordinate?.district, 0.4)}
              {this.renderAttribute('Neighborhood', coordinate?.neighborhood, 0.4)}
              {this.renderAttribute('Country', coordinate?.country, 0.4)}
              {this.renderAttribute('Latitude', coordinate?.lat, 0.4)}
              {this.renderAttribute('Longitude', coordinate?.lng, 0.4)}
            </div>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}

export default Coordinate;
