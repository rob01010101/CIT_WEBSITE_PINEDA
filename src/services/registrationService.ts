import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EventRegistration } from '../types';

const COLLECTION_NAME = 'event_registrations';

export const registrationService = {
  // Get all registrations
  async getAll(): Promise<EventRegistration[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as EventRegistration[];
  },

  // Get registrations for specific event
  async getByEvent(eventId: string): Promise<EventRegistration[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as EventRegistration[];
  },

  // Create new registration
  async create(registration: Omit<EventRegistration, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...registration,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Delete registration
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
