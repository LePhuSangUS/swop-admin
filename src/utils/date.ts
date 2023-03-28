import moment from 'moment';
import momentTZ from 'moment-timezone';
import store from 'store';
import momentDurationFormatSetup from 'moment-duration-format';
import { IDelivery } from 'types';

momentDurationFormatSetup(moment);

export function formatDate(date: string | Date | number, format = "MMM DD' YY hh:mm A") {
  if (!date) {
    return '';
  }

  let d = moment(date);
  if (typeof date === 'number') {
    if (date < 1526400) {
      return '';
    }
    d = moment.unix(date);
  }

  if (d.isValid()) {
    return d.format(format);
  }

  return '';
}

export function formatHour(date: string | Date | number, format: 'ha') {
  let d = moment(date);
  if (typeof date === 'number') {
    if (date < 1526400) {
      return '';
    }
    d = moment.unix(date);
  }

  if (d.isValid()) {
    return d.format(format);
  }

  return '';
}
export function formatBirthday(birthday: string) {
  const d = moment(birthday, 'YYYY-MM-DD');

  if (d.isValid()) {
    return d.format('MMM, DD YYYY');
  }

  return '';
}

export function currentTimezone() {
  return momentTZ.tz.guess(true);
}

export function setDefaultTimezone() {
  const user = store.get('user', null);
  if (typeof user?.timezone === 'string' && user?.timezone !== '') {
    moment.tz.setDefault(user?.timezone);
  } else {
    moment.tz.setDefault('America/Chicago');
  }
}

export const secondsToMoment = (seconds: number) => moment.duration(seconds, 'seconds').format();

export const getMatchingDateTime = (numDays = 7, numPeriod = 3, durationInHour = 3) => {
  const current = moment().startOf('day');
  return new Array(numDays).fill(0).map((item, index) => {
    const date = moment(current).add(index + 1, 'days');
    const times = new Array(numPeriod).fill(0).map((item, index) => {
      const from = moment(date).add(9 + index * durationInHour, 'hours');
      const to = moment(from).add(durationInHour, 'hours');
      return {
        from,
        to,
        fromTimeSlot: from.format('hh:mm A'),
        toTimeSlot: to.format('hh:mm A'),
      };
    });
    return {
      date,
      times,
    };
  });
};

export function formatDateTimeSlot(from: number, to: number) {
  if (from && to) {
    const date = formatDate(from, "MMM DD' YY");
    const fromTimeSlot = moment.unix(from).format('hh:mm A');
    const toTimeSlot = moment.unix(to).format('hh:mm A');
    return `${date} between ${fromTimeSlot}-${toTimeSlot}`;
  }

  return '--/--';
}

export function getDeliveryDate(delivery: IDelivery) {
  if (delivery.scheduled_from_time) {
    return formatDate(delivery?.scheduled_from_time, "MMM DD' YY");
  }

  switch (delivery.status) {
    case 'pick_up_scheduled':
      return formatDate(delivery?.pick_up_from_time, "MMM DD' YY");
    case 'delivery_scheduled':
      return formatDate(delivery?.delivery_from_time, "MMM DD' YY");
    case 'return_pick_up_scheduled':
      return formatDate(delivery?.return_pick_up_from_time, "MMM DD' YY");
    case 'return_delivery_scheduled':
      return formatDate(delivery?.return_delivery_from_time, "MMM DD' YY");
  }

  return formatDate(delivery?.pick_up_from_time, "MMM DD' YY");
}

export function getDeliveryTimeSlot(delivery: IDelivery) {
  if (delivery.scheduled_from_time && delivery.scheduled_to_time) {
    return `${moment.unix(delivery.scheduled_from_time).format('hh:mm A')} - ${moment
      .unix(delivery.scheduled_to_time)
      .format('hh:mm A')}`;
  }

  switch (delivery.status) {
    case 'pick_up_scheduled':
      return `${moment.unix(delivery.pick_up_from_time).format('hh:mm A')} - ${moment
        .unix(delivery.pick_up_to_time)
        .format('hh:mm A')}`;
    case 'delivery_scheduled':
      return `${moment.unix(delivery.delivery_from_time).format('hh:mm A')} - ${moment
        .unix(delivery.delivery_to_time)
        .format('hh:mm A')}`;
    case 'return_pick_up_scheduled':
      return `${moment.unix(delivery.return_pick_up_from_time).format('hh:mm A')} - ${moment
        .unix(delivery.return_pick_up_to_time)
        .format('hh:mm A')}`;
    case 'return_delivery_scheduled':
      return `${moment.unix(delivery.return_delivery_from_time).format('hh:mm A')} - ${moment
        .unix(delivery.return_delivery_to_time)
        .format('hh:mm A')}`;
  }

  return `${moment.unix(delivery.pick_up_from_time).format('hh:mm A')} - ${moment
    .unix(delivery.pick_up_to_time)
    .format('hh:mm A')}`;
}

export const getTimeSlots = () => {
  return [
    {
      key: '1',
      description: '9am-12am',
      from: 9 * 60 * 60,
      to: 12 * 60 * 60,
      from_hour: 9,
      to_hour: 12,
    },
    {
      key: '2',
      description: '12am-3pm',
      from: 12 * 60 * 60,
      to: 15 * 60 * 60,
      from_hour: 12,
      to_hour: 15,
    },
    {
      key: '3',
      description: '3pm-6pm',
      from: 15 * 60 * 60,
      to: 18 * 60 * 60,
      from_hour: 15,
      to_hour: 18,
    },
  ];
};
export default moment;
