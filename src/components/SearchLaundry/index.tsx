import React from 'react';
import { AutoComplete } from 'antd';
import { ILaundry } from 'types';
import api from 'services/api';

interface IProps {
  laundry_id?: string;
  onSelect: (laundry: ILaundry) => void;
  defaultName: string;
}

interface IState {
  searching: boolean;
  laundries: ILaundry[];
}

class SearchLaundry extends React.Component<IProps, IState> {
  state: IState = {
    searching: false,
    laundries: [],
  };
  handleSearch = (value: string) => {
    if (this.state.searching) {
      return;
    }

    this.setState({ searching: true });
    api
      .searchLaundry({ limit: 20, keyword: value })
      .then((result) => {
        this.setState({ searching: false, laundries: result.data.records });
      })
      .catch((error) => {
        this.setState({ searching: false, laundries: [] });
      });
  };

  handleSelect = (value: any) => {
    const { laundries } = this.state;
    const { onSelect } = this.props;
    if (typeof onSelect === 'function') {
      const item = laundries.find((item) => item.id === value);
      onSelect(item);
    }
  };

  getLaundryFormatName = (laundry: ILaundry) => {
    return `${laundry.name}`;
  };

  render() {
    const { laundries } = this.state;
    const { defaultName } = this.props;
    return (
      <AutoComplete
        dataSource={laundries?.map((item) => (
          <AutoComplete.Option value={item.id}>
            {this.getLaundryFormatName(item)}
          </AutoComplete.Option>
        ))}
        style={{ width: '100%' }}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        placeholder="Search Laundry By Name"
        defaultValue={defaultName}
      />
    );
  }
}
export default SearchLaundry;
