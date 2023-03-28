import { AutoComplete, Input } from "antd";
import debounce from "lodash/debounce";
import React, { PureComponent } from "react";

const { Search } = Input;
const { Option } = AutoComplete;

interface IAutoCompleteNameState {
  dataSource: any[];
  text: any;
}

interface IAutoCompleteNameProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  onSelect: (item: any) => void;
  loading: boolean;
  renderOption?: (item: any) => JSX.Element;
  dataSource: any[];
  initialValue?: string;
}

class AutoCompleteName extends PureComponent<IAutoCompleteNameProps, IAutoCompleteNameState> {
  static getDerivedStateFromProps(props: IAutoCompleteNameProps, state: IAutoCompleteNameState) {
    if (props.dataSource) {
      return { dataSource: props.dataSource };
    }

    return null;
  }
  state: IAutoCompleteNameState = {
    dataSource: [],
    text: this.props.initialValue,
  };
  handleSearchDebounce: any;

  constructor(props: any) {
    super(props);
    this.handleSearchDebounce = debounce(this.handleSearch, 1000);
  }

  handleSearch = (value: any) => {
    const { onSearch } = this.props;
    onSearch(value);
  }

  handleSelect = (value: any) => {
    const { dataSource } = this.state;
    const { onSelect } = this.props;
    const item = dataSource.find((item) => item.id === value);
    this.setState({ text: item?.name });
    if (typeof onSelect === "function") {
      onSelect(item);
    }
  }

  renderOption = (item: any) => {
    const { renderOption } = this.props;
    if (typeof renderOption === "function") {
      return renderOption(item);
    }
    return (
      <Option key={item.id}>
        <div className="global-search-item">
          <span className="global-search-item-count">{item.name}</span>
        </div>
      </Option>
    );
  }

  handleChange = (text: any) => {
    this.setState({ text });
  }

  render() {
    const { dataSource, text } = this.state;
    const { loading, placeholder } = this.props;

    return (
      <AutoComplete
        className="global-search"
        style={{ width: "100%" }}
        dataSource={dataSource.map(this.renderOption)}
        onSelect={this.handleSelect}
        onSearch={this.handleSearchDebounce}
        onChange={this.handleChange}
        placeholder={placeholder}
        optionLabelProp="text"
        value={text}
      >
        <Search loading={loading} />
      </AutoComplete>
    );
  }
}

export default AutoCompleteName;
