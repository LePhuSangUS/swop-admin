import React from 'react';
import { Card, Timeline, Spin, Button, Tag } from 'antd';
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
        <Tag color={getSwopStatusColor(item.status)}>{getSwopStatusDisplay(item.status)}</Tag>
      </Timeline.Item>
    );
  };
  renderTimeline = () => {
    const { swopTrackings, swop } = this.props;
    const finished = swop?.status === 'finished' || swop?.status === 'canceled';
    return (
      <Timeline reverse pending={!finished && 'Processing...'}>
        {swopTrackings?.map((item, index) => this.renderTimelineItem(item, index))}
      </Timeline>
    );
  };

  handleRefreshData = () => {
    const { onRefreshData, swop } = this.props;
    onRefreshData(swop.id);
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
