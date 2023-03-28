import React from 'react';
import { Icon, message, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';

function getBase64(img: Blob, callback: (imgURL: string | ArrayBuffer | null) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error('Image must smaller than 20MB!');
  }
  return isJpgOrPng && isLt2M;
}

interface IImageUploadProps {
  defaultImageURL: string;
  onImageLoaded: (file: File) => void;
}

interface IImageUploadState {
  loading: boolean;
  imageURL: string;
}

class ImageUpload extends React.Component<IImageUploadProps, IImageUploadState> {
  didUpdate = false;
  constructor(props: IImageUploadProps) {
    super(props);
    const { defaultImageURL } = this.props;
    this.state = {
      imageURL: defaultImageURL || '',
      loading: false,
    };
  }

  static getDerivedStateFromProps(props: IImageUploadProps, state: IImageUploadState) {
    if (
      props.defaultImageURL !== state.imageURL &&
      (state.imageURL === '' || state.imageURL === undefined)
    ) {
      //Change in props
      return {
        imageURL: props.defaultImageURL,
      };
    }
    return null; // No change to state
  }

  // @ts-ignore
  dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  handleChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageURL) =>
        this.setState({
          imageURL: imageURL as string,
          loading: false,
        }),
      );

      const { onImageLoaded } = this.props;
      onImageLoaded(info.file.originFileObj as File);
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageURL } = this.state;
    const validImage = typeof imageURL === 'string' && imageURL !== '';
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        accept="image/png, image/jpeg, image/jpg"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={this.dummyRequest}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {validImage ? <img src={imageURL} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default ImageUpload;
