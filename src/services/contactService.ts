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
import type { ContactMessage } from '../types';

const COLLECTION_NAME = 'contact_messages';

export const contactService = {
  // Get all contact messages
  async getAll(): Promise<ContactMessage[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as ContactMessage[];
  },

  // Create new contact message
  async create(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...message,
      status: 'new',
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update message status
  async updateStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  },

  // Delete message
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
