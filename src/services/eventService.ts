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
import type { Event } from '../types';

const COLLECTION_NAME = 'events';

export const eventService = {
  // Get all events
  async getAll(): Promise<Event[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Event[];
  },

  // Create new event
  async create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...event,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update event
  async update(id: string, event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...event,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete event
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
