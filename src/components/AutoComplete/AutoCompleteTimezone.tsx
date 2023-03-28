import { AutoComplete, Input } from 'antd';
import debouce from 'lodash/debounce';
import momentTZ from 'moment-timezone';
import React, { PureComponent } from 'react';
const { Search } = Input;
const { Option } = AutoComplete;

interface IAutoCompleteTimezoneState {
  dataSource: any[];
  text: any;
}

interface IAutoCompleteTimezoneProps {
  placeholder?: string;
  onSelect: (item: any) => void;
  renderOption?: (item: any) => JSX.Element;
  initialValue?: string;
}

class AutoCompleteTimezone extends PureComponent<
  IAutoCompleteTimezoneProps,
  IAutoCompleteTimezoneState
> {
  state: IAutoCompleteTimezoneState = {
    dataSource: [],
    text: this.props.initialValue,
  };

  handleSearch = (value: string) => {
    if (value === '') {
      this.setState({ dataSource: [] });
      return;
    }
    const data = momentTZ.tz.names().filter((tz) => tz.toLowerCase().includes(value.toLowerCase()));
    this.setState({ dataSource: data, text: value });
  };

  handleSelect = (value: any) => {
    const { onSelect } = this.props;
    this.setState({ text: value });
    if (typeof onSelect === 'function') {
      onSelect(value);
    }
  };

  handleChange = (text: any) => {
    this.setState({ text });
  };

  render() {
    const { dataSource, text } = this.state;
    const { placeholder } = this.props;
    return (
      <AutoComplete
        id="timezone"
        className="global-search"
        style={{ width: '100%' }}
        dataSource={dataSource}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        placeholder={placeholder}
        value={text}
      >
        <Search value={text} />
      </AutoComplete>
    );
  }
}

export default AutoCompleteTimezone;
