import { message } from 'antd';
export const dva = {
  config: {
    // @ts-ignore
    onError(e, a) {
      console.error(e)
      e.preventDefault();
      if (e.message) {
        message.error(e.message);
      } else {
      }
    },
  },

  plugins: ENV === 'local' ? [require('dva-logger')()] : [],
};
