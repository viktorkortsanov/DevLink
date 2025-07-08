import { Injectable } from '@angular/core';
import { storage } from '../../config/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {

    constructor() { }

    async uploadProfileImage(file: File): Promise<string> {
        const fileName = `profileImages/${Date.now()}_${file.name}`;
        const fileRef = ref(storage, fileName);

        try {
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    validateFile(file: File): { isValid: boolean; error?: string } {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'Allowed formats: JPEG, PNG, GIF, WebP' };
        }

        if (file.size > maxSize) {
            return { isValid: false, error: 'File size must be less than 5MB' };
        }

        return { isValid: true };
    }
}