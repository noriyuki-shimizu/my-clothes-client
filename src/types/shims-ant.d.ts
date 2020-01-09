import 'ant-design-vue/types/upload';
import 'ant-design-vue/types/form/form';

declare module 'ant-design-vue/types/upload' {
    interface ExUploadFile extends UploadFile {
        status: 'done' | 'error' | 'removed' | 'uploading';
        url: string;
        thumbUrl: string;
        originFileObj: File;
    }
    interface UploadingFileInfo {
        event: Event;
        file: ExUploadFile;
        fileList: ExUploadFile[];
    }
    interface DoneUploadFileInfo {
        file: ExUploadFile;
        fileList: ExUploadFile[];
    }
}

declare module 'ant-design-vue/types/form/form' {
    type FieldDecorator = {
        [k: string]: [string, FieldDecoratorOptions];
    };
}

declare module 'ant-design-vue/types/message' {
    type AppMessage = {
        isShow: boolean;
        text: string;
        description: string;
        type: 'warning' | 'error' | null;
    };
}
