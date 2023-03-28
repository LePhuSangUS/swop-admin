import React from 'react';
import { AutoComplete } from 'antd';
import { debounce } from 'lodash';
import api from 'services/api';
import { ILaundry, IPagination } from 'types/app';

interface IProps {
  initialValue?: ILaundry;
  onItemSelect: (item: ILaundry) => void;
}

interface IState {
  searchResponse: IPagination<ILaundry>;
  searching: boolean;
  prevSearch: any;
}

export default class LaundrySearch extends React.Component<IProps, IState> {
  state: IState = {
    searchResponse: null,
    searching: false,
    prevSearch: null,
  };

  searchDelay = debounce((searchText: string) => {
    const { searching } = this.state;
    if (searching) return;
    const params = {
      limit: 20,
      name: searchText,
    };
    this.setState({ searching: true });
    api
      .searchLaundry(params)
      .then((data) => {
        this.setState({ searching: false, searchResponse: data.data });
      })
      .catch(() => {
        this.setState({ searching: false });
      });
  }, 200);

  onSelect = (value: any, option: Object) => {
    const { onItemSelect } = this.props;
    const { searchResponse } = this.state;
    const item = searchResponse?.records?.find((item) => item.id === value);
    onItemSelect(item);
  };
  onChange = (data: string) => {};

  renderOptions = () => {
    const { searchResponse } = this.state;
    return searchResponse?.records?.map((item) => (
      <AutoComplete.Option key={item?.id}>{item?.name}</AutoComplete.Option>
    ));
  };

  render() {
    const { initialValue } = this.props;
    const { searching } = this.state;
    return (
      <AutoComplete
        defaultValue={initialValue?.name}
        dataSource={this.renderOptions()}
        style={{ width: '100%' }}
        onSelect={this.onSelect}
        onSearch={this.searchDelay}
        placeholder="Search Laundry By Name"
        showSearch
      />
    );
  }
}
