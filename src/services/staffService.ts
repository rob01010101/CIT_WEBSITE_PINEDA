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
import type { Staff } from '../types';

const COLLECTION_NAME = 'staff';

export const staffService = {
  // Get all staff members
  async getAll(): Promise<Staff[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Staff[];
  },

  // Get staff by role
  async getByRole(role: string): Promise<Staff[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('role', '==', role),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Staff[];
  },

  // Create new staff member
  async create(staff: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...staff,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update staff member
  async update(
    id: string,
    staff: Partial<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...staff,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete staff member
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Reorder staff members
  async reorderStaff(updates: Array<{ id: string; displayOrder: number }>): Promise<void> {
    const updatePromises = updates.map(({ id, displayOrder }) =>
      updateDoc(doc(db, COLLECTION_NAME, id), { displayOrder })
    );
    await Promise.all(updatePromises);
  },
};
