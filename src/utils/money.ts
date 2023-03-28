import currency from 'currency.js';
import moment from 'moment';
import numeral from 'numeral';
import currencyList from './currencyList';

// https://codesandbox.io/s/currency-wrapper-antd-input-3ynzo?file=/src/index.js:562-576
export const currencyOptions = currencyList.data.map((c) => ({
  label: c.CcyNm,
  value: `${c.CtryNm}::${c.Ccy}`,
}));

const currencyFormatter = (selectedCurrOpt: any) => (value: any) => {
  if (value === '') {
    return '';
  }
  return new Intl.NumberFormat(moment().locale(), {
    style: 'currency',
    currency: selectedCurrOpt.split('::')[1],
  }).format(value);
};

const currencyParser = (val: any) => {
  try {
    // for when the input gets clears
    if (typeof val === 'string' && !val.length) {
      val = '0.0';
    }

    // detecting and parsing between comma and dot
    var group = new Intl.NumberFormat(moment().locale()).format(1111).replace(/1/g, '');
    var decimal = new Intl.NumberFormat(moment().locale()).format(1.1).replace(/1/g, '');
    var reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, '');
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split('.')[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;

    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
  }
};

export function formatCents(cents: number | string) {
  return currency(currency(cents).divide(100), { symbol: '$', precision: 2 }).format();
}

export function formatMoney(v: number | string) {
  return currency(currency(v), { symbol: '$', precision: 2 }).format();
}

export function formatMoneyCurrency(v: number | string, cur?: string) {
  let curOption: currency.Options = { symbol: '$', precision: 2 };
  let numFormat = '0a';
  let symbol = '$';
  switch (cur) {
    case 'VND':
      symbol = 'VND';
      numFormat = '0,0';
      curOption = { symbol: 'VND ', precision: 3 };
      break;
    case 'INR':
      symbol = '₹';
      curOption = { symbol: '₹', precision: 2 };
      break;
    case 'SGD':
      symbol = 'S$';
      curOption = { symbol: 'S$', precision: 2 };
      break;
  }
  const value = numeral(v).format(numFormat);

  return `${symbol} ${value}`;
}

export const formatCurrencyInput = (cur: string) => {
  const option = currencyList.data.find((item) => item.Ccy === cur);
  const opt = `${option.CtryNm}::${option.Ccy}`;

  let minValue = 1;
  let step = 0.1;
  // let formatter = (v: number | string) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // let parser = (v: number | string) => `${v}`.replace(/\$\s?|(,*)/g, '');
  let formatter = currencyFormatter(opt);
  let parser = currencyParser;

  switch (cur) {
    case 'VND':
      minValue = 1000;
      step = 500;
      // formatter = (v: number | string) => `₫ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // parser = (v: number | string) => `${v}`.replace(/\₫\s?|(,*)/g, '');
      formatter = currencyFormatter(opt);
      parser = currencyParser;
      break;
    case 'INR':
      // formatter = (v: number | string) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // parser = (v: number | string) => `${v}`.replace(/\₹\s?|(,*)/g, '');
      formatter = currencyFormatter(opt);
      parser = currencyParser;
      break;
    case 'SGD':
      // formatter = (v: number | string) => `S$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // parser = (v: number | string) => `${v}`.replace(/S\$\s?|(,*)/g, '');
      formatter = currencyFormatter(opt);
      parser = currencyParser;
      break;
  }
  return { formatter, parser, minValue, step };
};
export default currency;

export const getCurrencySymbol = (cur: string) => {
  let symbol = '$';
  switch (cur) {
    case 'VND':
      symbol = 'VND';
      break;
    case 'INR':
      symbol = '₹';
      break;
    case 'SGD':
      symbol = 'S$';
      break;
  }

  return symbol;
};
