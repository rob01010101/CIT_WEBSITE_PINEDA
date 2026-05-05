import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { News } from '../types';

const COLLECTION_NAME = 'news';

export const newsService = {
  async getAll(): Promise<News[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
      createdAt: docItem.data().createdAt?.toDate() || new Date(),
      updatedAt: docItem.data().updatedAt?.toDate() || new Date(),
    })) as News[];
  },

  async create(news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...news,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, news: Partial<Omit<News, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...news,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
