import Axios from 'axios';

export async function uploadS3Image(url: string, formData: FormData) {
  return new Promise((resolve, reject) => {
    Axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        const key = formData.get('key');
        resolve({
          success: true,
          message: 'Upload success',
          statusCode: status,
          data: {
            imageURL: `${url}/${key}`,
          },
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
