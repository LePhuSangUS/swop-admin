import Axios from 'axios';
import { IRemovalAIResponse } from 'types/app';
import { config } from 'utils';

export async function removeImageBackground(formData: FormData) {
  return new Promise((resolve, reject) => {
    formData.append('get_base64', '1');
    Axios.post<IRemovalAIResponse>('https://api.removal.ai/3.0/remove', formData, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Rm-Token': config.removalAIApiToken,
      },
    })
      .then((resp) => {
        resolve({
          success: true,
          message: 'Upload success',
          statusCode: resp.status,
          data: resp.data,
        });
      })
      .catch((error) => {
        reject({
          success: false,
          statusCode: 400,
          message: error?.message,
        });
      });
  });
}
