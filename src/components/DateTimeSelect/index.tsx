import React from 'react';
import { getMatchingDateTime } from 'utils/date';
import styles from './index.less';
import { classnames } from 'utils';
import { Row, Col, Card } from 'antd';
import moment, { Moment } from 'moment';

interface IProps {
  title?: string;
  from: number;
  to: number;
  onSelected: (from: number, to: number) => void;
}
interface IState {
  dateTime: {
    date: Moment;
    times: {
      from: Moment;
      to: Moment;
    }[];
  }[];
  selectedRow: number;
  selectedCol: number;
}

const setupDefaultDateTime = (from: number, to: number) => {
  const dateTime = getMatchingDateTime();
  const dateIndex = dateTime.findIndex((item) => {
    const equal =
      item.date.date() === moment.unix(from).date() &&
      item.date.month() === moment.unix(from).month();

    return equal;
  });

  let selectedRow = -1;
  let selectedCol = -1;

  if (dateIndex !== -1) {
    const timeIndex = dateTime[dateIndex].times.findIndex(
      (item) =>
        item.from.hours() === moment.unix(from).hours() &&
        item.to.hours() === moment.unix(to).hours(),
    );
    if (timeIndex !== -1) {
      selectedRow = dateIndex;
      selectedCol = timeIndex;
    }
  }
  return {
    dateTime,
    selectedRow,
    selectedCol,
  };
};

export default class DateTimeSelect extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const { from, to } = this.props;
    this.state = setupDefaultDateTime(from, to);
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.from && props.to && state.selectedRow === -1 && state.selectedCol === -1) {
      const newState = setupDefaultDateTime(props.from, props.to);
      return {
        ...state,
        ...newState,
      };
    }

    return state;
  }

  onClick = (i: number, j: number) => {
    const { onSelected } = this.props;
    const { dateTime } = this.state;
    this.setState({ selectedRow: i, selectedCol: j });
    const timeRange = dateTime[i].times[j];
    onSelected(timeRange.from.unix(), timeRange.to.unix());
  };

  render() {
    const { title } = this.props;
    const { dateTime, selectedRow, selectedCol } = this.state;
    return (
      <Card title={title}>
        {dateTime.map((row, i) => (
          <div className={styles.row} key={`${row.date}`}>
            <Row gutter={[0, 0]}>
              <div>{`${row.date.format('MMM, DD YYYY')}`}</div>
              <Row gutter={[24, 24]} type="flex" justify="space-between">
                {row.times.map((col, j) => {
                  const active = selectedRow === i && selectedCol === j;
                  return (
                    <Col
                      onClick={() => this.onClick(i, j)}
                      style={{ paddingTop: 10, paddingBottom: 20 }}
                    >
                      <span
                        key={`${col.from}-${col.to}`}
                        className={classnames({
                          [styles.btn]: true,
                          [styles.btnActive]: active,
                          [styles.btnInactive]: !active,
                        })}
                      >
                        {col.from.format('hh:mm')} - {col.to.format('hh:mm')}
                      </span>
                    </Col>
                  );
                })}
              </Row>
            </Row>
          </div>
        ))}
      </Card>
    );
  }
}
