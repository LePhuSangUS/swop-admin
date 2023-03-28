import { IModel } from 'types';


export const updateModel: IModel<any> = {
  reducers: {
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
