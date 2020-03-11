import * as firebase from 'firebase/app';
import 'firebase/storage';
import * as url from 'url';
import uuid from 'uuid/v4';

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

    return snapshot.ref.getDownloadURL();
};

const deleteImageByFullPath = async (fullPath: string): Promise<void> => {
    const decodeURL = decodeURIComponent(fullPath);
    const imageRef = firebase.storage().refFromURL(decodeURL);

    const parseURL = url.parse(decodeURL);
    const { pathname } = parseURL;
    if (!pathname) {
        throw new Error('Invalid argument ["fullPath"]');
    }
    const extension = pathname.split('.').pop();
    const imageRef200 = firebase
        .storage()
        .refFromURL(
            decodeURL.replace(`.${extension}`, `_200x200.${extension}`)
        );

    await Promise.all([imageRef.delete(), imageRef200.delete()]).catch(
        (error: any) => {
            throw error;
        }
    );
};

export default {
    upload,
    deleteImageByFullPath
};
