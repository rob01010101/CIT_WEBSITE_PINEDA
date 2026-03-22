import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { GalleryImage } from '../types';

const COLLECTION_NAME = 'gallery_images';

export const imageService = {
  // Get all gallery images
  async getAll(): Promise<GalleryImage[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('category'),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
    })) as GalleryImage[];
  },

  // Get images by category
  async getByCategory(category: GalleryImage['category']): Promise<GalleryImage[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
    })) as GalleryImage[];
  },

  // Create new gallery image
  async create(
    image: Omit<GalleryImage, 'id' | 'uploadedAt'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...image,
      uploadedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update gallery image
  async update(
    id: string,
    image: Partial<Omit<GalleryImage, 'id' | 'uploadedAt'>>
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, image);
  },

  // Delete gallery image
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Reorder images in category
  async reorderImages(
    updates: Array<{ id: string; displayOrder: number }>
  ): Promise<void> {
    const updatePromises = updates.map(({ id, displayOrder }) =>
      updateDoc(doc(db, COLLECTION_NAME, id), { displayOrder })
    );
    await Promise.all(updatePromises);
  },
};
