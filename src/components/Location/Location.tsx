import { Ellipsis } from 'ant-design-pro';
import React from 'react';
import { Tooltip } from 'antd';
import { ISearchResponse } from 'types';

interface IProps {
  location: ISearchResponse;
}

const Location: React.SFC<IProps> = (props) => {
  const { location } = props;
  if (!location || location.lat === null || location.lng === null) {
    return <span />;
  }

  const { lat, lng, address, google_place_id } = props.location;

  let url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (location.google_place_id) {
    url = `${url}&query_place_id=${google_place_id}`;
  }
  return (
    <Tooltip title={address}>
      <Ellipsis lines={1} tooltip={false}>
        <a target="__blank" href={url}>
          {address || ''}
        </a>
      </Ellipsis>
    </Tooltip>
  );
};

export default Location;
