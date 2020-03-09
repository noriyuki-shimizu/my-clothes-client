import { FirebaseStorageError } from 'firebase/app';
import image from './image';

export const isFirebaseStorageError = (
    err: any
): err is FirebaseStorageError => {
    return 'name' in err && err.name.indexOf('storage/') === 0;
};

export default {
    image
};
