import React from 'react';
import { Form, Modal, Select, Input, InputNumber, Tabs } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IConstants, ISwop } from 'types';
import { getSwopStatusDisplay } from 'utils/mapping';
import { formatCurrencyInput } from 'utils/money';
import DateTimeSelect from 'components/DateTimeSelect';
import LaundrySearch from 'components/LaundrySearch';
import { AutoCompletePlace } from 'components';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const formItemLayout2 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  item: ISwop;
  constants: IConstants;
  onAccept: (data: ISwop) => void;
}

interface IModelState {}
class ModalUpdateSwop extends React.PureComponent<IModalProps, IModelState> {
  state = {
    from: this.props.item?.from_time,
    to: this.props.item?.to_time,
    laundry_id: this.props.item?.laundry_id,
    laundry: this.props.item?.laundry,
    return_laundry_id: this.props.item?.return_laundry_id,
    return_laundry: this.props.item?.return_laundry,
  };
  componentDidMount() {
    const { item } = this.props;
    if (item) {
      this.setState({
        from: item?.from_time,
        to: item?.to_time,
      });
    }
  }
  handleOk = () => {
    const { from, to, laundry, laundry_id, return_laundry, return_laundry_id } = this.state;
    const { onAccept, form, item } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        id: item?.id,
        from_time: from,
        to_time: to,
        laundry,
        laundry_id,
        return_laundry,
        return_laundry_id,
      };

      onAccept(data);
    });
  };

  renderFirstTab = () => {
    const { constants, item, form } = this.props;
    const { getFieldDecorator } = form;
    const { formatter, parser, minValue, step } = formatCurrencyInput(item?.currency);
    return (
      <>
        <FormItem label="Status" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item?.status,
          })(
            <Select style={{ width: '100%' }}>
              {constants?.swop_status.map((item) => (
                <Select.Option key={item}>{getSwopStatusDisplay(item)}</Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="Currency" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('currency', {
            initialValue: item?.currency,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="Cleaning Fee (CC)" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('cleaning_fee', {
            initialValue: item?.cleaning_fee,
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              formatter={formatter}
              parser={parser}
            />,
          )}
        </FormItem>
        <FormItem label="Cleaning Fee Deduct (cc)" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('cleaning_fee_deduct', {
            initialValue: item?.cleaning_fee_deduct,
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              formatter={formatter}
              parser={parser}
            />,
          )}
        </FormItem>
        <FormItem label="Delivery Fee (DC)" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('delivery_fee', {
            initialValue: item?.delivery_fee,
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              formatter={formatter}
              parser={parser}
            />,
          )}
        </FormItem>
        <FormItem label="Delivery Fee Deduct (dc)" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('delivery_fee_deduct', {
            initialValue: item?.delivery_fee_deduct,
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              formatter={formatter}
              parser={parser}
            />,
          )}
        </FormItem>
        <FormItem label="Deduct (od)" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('deduct', {
            initialValue: item?.deduct,
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              formatter={formatter}
              parser={parser}
            />,
          )}
        </FormItem>
      </>
    );
  };

  renderSecondTab = () => {
    const { item } = this.props;
    return (
      <FormItem>
        <DateTimeSelect
          from={item?.from_time}
          to={item?.to_time}
          onSelected={(from, to) => this.setState({ from, to })}
        />
      </FormItem>
    );
  };

  renderThirdTab = () => {
    const { item, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <FormItem label="Laundry" hasFeedback={true} {...formItemLayout2}>
          {getFieldDecorator('laundry_id', {
            initialValue: item?.laundry,
          })(
            <LaundrySearch
              initialValue={item?.laundry}
              onItemSelect={(item) => {
                this.setState({
                  laundry: item,
                  laundry_id: item?.id,
                });
              }}
            />,
          )}
        </FormItem>

        <FormItem label="Return Laundry" hasFeedback={true} {...formItemLayout2}>
          {getFieldDecorator('return_laundry_id', {
            initialValue: item?.return_laundry,
          })(
            <LaundrySearch
              initialValue={item?.return_laundry}
              onItemSelect={(item) => {
                this.setState({
                  return_laundry: item,
                  return_laundry_id: item?.id,
                });
              }}
            />,
          )}
        </FormItem>

        <FormItem label="Location" {...formItemLayout2}>
          {getFieldDecorator('coordinate', {
            initialValue: {
              lat: item?.coordinate?.lat,
              lng: item?.coordinate?.lng,
              address: item?.coordinate?.formatted_address,
              place_id: item?.coordinate?.google_place_id,
            },
            rules: [
              {
                required: false,
                message: 'Please select a location',
              },
            ],
          })(
            <AutoCompletePlace
              inputID="coordinate"
              initialValue={item?.coordinate?.formatted_address}
              placeholder="Search a location"
              onSelect={(value) => this.props.form.setFieldsValue({ coordinate: value })}
              form={form}
            />,
          )}
        </FormItem>
      </>
    );
  };
  render() {
    const { onOk, constants, item, form, ...modalProps } = this.props;
    return (
      <Modal
        title="Update Swop"
        destroyOnClose={true}
        centered={true}
        maskClosable={true}
        onOk={this.handleOk}
        {...modalProps}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane style={{ minHeight: 500 }} tab="Swop Basic Info" key="1">
            {this.renderFirstTab()}
          </Tabs.TabPane>
          <Tabs.TabPane style={{ minHeight: 500 }} tab="Date Time" key="2">
            {this.renderSecondTab()}
          </Tabs.TabPane>
          <Tabs.TabPane style={{ minHeight: 500 }} tab="Locations" key="3">
            {this.renderThirdTab()}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdateSwop);
