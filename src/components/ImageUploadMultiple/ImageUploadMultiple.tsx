import React from 'react';
import Resizer from 'react-image-file-resizer';

import { Icon, message, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';

const { Dragger } = Upload;

export interface IFile {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: any;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: any;
  preview?: string;
}

function beforeUpload(file: RcFile) {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  // if (!isJpgOrPng) {
  //   message.error('You can only upload JPG/PNG file!');
  // }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isJpgOrPng && isLt2M;
}

function getBase64(img: Blob, callback: (imgURL: string | ArrayBuffer | null) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const resizeFile = (file: File | Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      640,
      (16 * 640) / 9,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64',
    );
  });

interface IImageUploadProps {
  defaultListImageURL: string[];
  showUploadList?: boolean;
  onImageAdded: (files: IFile[]) => void;
  onImageRemoved: (file: IFile) => void;
  renderItemUploaded?: (files: IFile[], onDelete: (file: IFile) => void) => JSX.Element;
}

interface IImageUploadState {
  defaultFileList: any[];
}

class ImageUploadMultiple extends React.Component<IImageUploadProps, IImageUploadState> {
  constructor(props: IImageUploadProps) {
    super(props);
    const { defaultListImageURL = [] } = this.props;
    const defaultFileList: any[] = [];
    defaultListImageURL?.forEach((item, index) => {
      if (item.startsWith('http')) {
        defaultFileList.push({ uid: index, url: item, name: item.split('/').pop() });
      }
    });

    this.state = {
      defaultFileList,
    };
  }

  // @ts-ignore
  dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  handleChange = async (info: UploadChangeParam) => {
    const { defaultFileList } = this.state;
    const { onImageAdded, onImageRemoved } = this.props;
    if (info.file.status === 'uploading') {
      if (info?.fileList?.length !== defaultFileList?.length) {
        this.setState({ defaultFileList: info.fileList });
      }
      return;
    }

    if (info.file.status === 'removed') {
      if (info?.fileList?.length !== defaultFileList?.length) {
        this.setState({ defaultFileList: info.fileList });
      }
      onImageRemoved(info.fileList as any);
      return;
    }

    if (info.file.status === 'done') {
      const fileResized = await resizeFile(info.file.originFileObj);

      const index = info.fileList.findIndex((item) => item.uid === info.file.uid);
      const item = {
        ...info.file,
        preview: fileResized as string,
      };
      if (index !== -1) {
        info.fileList[index] = item;
      } else {
        info.fileList.push(item);
      }
      this.setState({ defaultFileList: info.fileList }, () => onImageAdded(info.fileList));
    }
  };

  handleRemoteItem = (file: IFile) => {
    const { defaultFileList } = this.state;
    const { onImageRemoved } = this.props;
    const fileList = defaultFileList.filter((item) => item.uid !== file.uid);

    this.setState({ defaultFileList: fileList }, () => onImageRemoved(file));
  };
  render() {
    const { defaultFileList } = this.state;
    const { showUploadList, renderItemUploaded } = this.props;
    return (
      <>
        <Dragger
          style={{ height: 120 }}
          fileList={defaultFileList}
          listType="picture"
          name="files"
          multiple={true}
          accept="image/png, image/jpeg, image/jpg"
          showUploadList={showUploadList}
          onChange={this.handleChange}
          customRequest={this.dummyRequest}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
        {renderItemUploaded && renderItemUploaded(defaultFileList, this.handleRemoteItem)}
      </>
    );
  }
}

export default ImageUploadMultiple;
