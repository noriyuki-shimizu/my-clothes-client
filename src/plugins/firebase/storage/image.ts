import * as firebase from 'firebase/app';
import 'firebase/storage';
import * as url from 'url';
import uuid from 'uuid/v4';
import { sleep } from '@/util/thread';

const getImageRef = (name: string, uid: string, subFolder: string) => {
    const storageRef = firebase.storage().ref();

    const fileName = `${uuid()}_${name}`;

    return storageRef.child(
        `${process.env.VUE_APP_FIREBASE_STORAGE_DIR}/${uid}/${subFolder}/${fileName}`
    );
};

const upload = async (
    file: File | undefined,
    uid: string,
    subFolder: string = ''
): Promise<string> => {
    if (!file) {
        throw new Error('Necessary information is missing');
    }

    const imageRef = getImageRef(file.name, uid, subFolder);
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();

    // FIXME: firebase functions でリサイズを作成している間の sleep 処理
    sleep();

    const parseURL = url.parse(downloadURL);
    const { pathname } = parseURL;
    if (!pathname) {
        throw new Error('Oops... Check if the upload is successful.');
    }

    const extension = pathname.split('.').pop();

    return downloadURL.replace(`.${extension}`, `_200x200.${extension}`);
};

const deleteImageByFullPath = (fullPath: string): void => {
    const decodeURL = decodeURIComponent(fullPath);
    const imageRef = firebase.storage().refFromURL(decodeURL);

    imageRef.delete();
};

export default {
    upload,
    deleteImageByFullPath
};
