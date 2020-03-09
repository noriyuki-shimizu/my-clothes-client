import * as firebase from 'firebase/app';
import * as url from 'url';
import uuid from 'uuid/v4';

const getImageRef = (name: string, subFolder: string) => {
    const storageRef = firebase.storage().ref();

    const fileName = `${uuid()}_${name}`;

    return storageRef.child(
        `${process.env.VUE_APP_FIREBASE_STORAGE_DIR}${subFolder}${fileName}`
    );
};

const upload = async (
    file: File | undefined,
    subFolder: string = ''
): Promise<string> => {
    if (!file) {
        throw new Error('Necessary information is missing');
    }

    const imageRef = getImageRef(file.name, subFolder);

    const snapshot = await imageRef.put(file);

    return snapshot.ref.getDownloadURL();
};

const deleteImageByName = async (
    name: string,
    subFolder: string = ''
): Promise<void> => {
    const imageRef = getImageRef(name, subFolder);
    await imageRef.delete().catch((error: any) => {
        throw error;
    });
};

const deleteImageByFullPath = async (fullPath: string): Promise<void> => {
    const decodeURL = decodeURIComponent(fullPath);
    const imageRef = firebase.storage().refFromURL(decodeURL);

    const parseURL = url.parse(decodeURL);
    const { pathname } = parseURL as { pathname: string };
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
    deleteImageByName,
    deleteImageByFullPath
};
