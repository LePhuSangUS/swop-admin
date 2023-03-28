import React from 'react';
import { Checkbox } from 'antd';
import { ICheckboxValueType, IFormProps } from 'types';
interface IProps extends IFormProps {
  defaultCheckedList?: ICheckboxValueType[];
  checkedList: ICheckboxValueType[];
}
class CheckboxGroup extends React.Component<IProps> {
  state = {
    checkedList: this.props.defaultCheckedList || [],
    indeterminate: true,
    checkAll: false,
  };

  onChange = (checkedList: ICheckboxValueType[]) => {
    const { checkedList: list, form } = this.props;
    this.setState(
      {
        checkedList,
        indeterminate: !!checkedList.length && checkedList.length < list.length,
        checkAll: checkedList.length === list.length,
      },
      () => {
        form.setFieldsValue({
          cod: this.state.checkedList,
        });
      },
    );
  };

  onCheckAllChange = (e: any) => {
    const { checkedList: list, form } = this.props;
    this.setState(
      {
        checkedList: e.target.checked ? list : [],
        indeterminate: false,
        checkAll: e.target.checked,
      },
      () => {
        form.setFieldsValue({
          cod: this.state.checkedList,
        });
      },
    );
  };

  render() {
    const { checkedList: list } = this.props;
    const { checkedList, checkAll, indeterminate } = this.state;
    return (
      <React.Fragment>
        <Checkbox.Group
          key="cod"
          options={list as any}
          value={checkedList}
          onChange={this.onChange}
        />
        <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
      </React.Fragment>
    );
  }
}
export default CheckboxGroup;
