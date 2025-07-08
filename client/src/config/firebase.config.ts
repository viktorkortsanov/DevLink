import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA8AWe0lZg-8QL_XJUcJJOSGPxBMY7K4Gg",
    authDomain: "devlink-84617.firebaseapp.com",
    projectId: "devlink-84617",
    storageBucket: "devlink-84617.firebasestorage.app",
    messagingSenderId: "993963560996",
    appId: "1:993963560996:web:16060749b7683a032b48b1",
    measurementId: "G-FCC1ZFZF2B"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export default app;