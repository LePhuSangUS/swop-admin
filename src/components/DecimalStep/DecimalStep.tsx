import { Col, InputNumber, Row, Slider } from "antd";
import React from "react";

interface IProps {
  onChange: (value: number) => void;
  initialValue: number;
}
class DecimalStep extends React.Component<IProps> {
  state = {
    inputValue: this.props.initialValue,
  };

  onChange = (value: any) => {
    if (isNaN(value)) {
      return;
    }
    this.setState(
      {
        inputValue: value,
      },
      () => {
        const { onChange } = this.props;
        if (typeof onChange === "function") {
          onChange(value);
        }
      },
    );
  }

  render() {
    const { inputValue } = this.state;
    return (
      <Row>
        <Col span={16}>
          <Slider
            min={0}
            max={1}
            onChange={this.onChange}
            value={typeof inputValue === "number" ? inputValue : 0}
            step={0.01}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            min={0}
            max={1}
            style={{ marginLeft: 16 }}
            step={0.01}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    );
  }
}

export default DecimalStep;
