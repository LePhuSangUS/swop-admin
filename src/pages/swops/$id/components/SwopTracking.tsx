import React from 'react';
import { Card, Timeline, Spin, Button, Tag, Tooltip, Row, Col } from 'antd';
import { ISwop, ISwopTracking } from 'types';
import { formatDate } from 'utils/date';
import theme, { getSwopStatusColor } from 'utils/theme';
import { getSwopStatusDisplay } from 'utils/mapping';
import styles from './SwopTracking.less';

interface IProps {
  loading: boolean;
  swop: ISwop;
  swopTrackings: ISwopTracking[];
  onRefreshData: (swopID: string) => void;
}

class SwopTracking extends React.PureComponent<IProps> {
  handleRefreshData = () => {
    const { onRefreshData, swop } = this.props;
    onRefreshData(swop.id);
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
    const dateTime = formatDate(item.created_at);
    return (
      <Timeline.Item key={`${index}-${item.id}`} color={theme.colors.pink} pending={false}>
        <p>{`${dateTime}`}</p>
        <Tooltip title={getSwopStatusDisplay(item.status)}>
          <Tag color={getSwopStatusColor(item.status)}>{getSwopStatusDisplay(item.status)}</Tag>
        </Tooltip>
      </Timeline.Item>
    );
  };

  renderTimeline = () => {
    const { swopTrackings, swop } = this.props;
    const finished = swop?.status === 'completed' || swop?.status === 'canceled';
    return (
      <Timeline reverse pending={!finished && 'Processing...'}>
        {swopTrackings?.map((item, index) => this.renderTimelineItem(item, index))}
      </Timeline>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <Spin spinning={loading}>
        <Card
          title="Track Package Information"
          extra={
            <Button onClick={this.handleRefreshData} icon="reload">
              Refresh Data
            </Button>
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
