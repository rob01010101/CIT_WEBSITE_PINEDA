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
import type { CapstoneProject } from '../types';

const COLLECTION_NAME = 'capstone_projects';

export const capstoneService = {
  // Get all capstone projects
  async getAll(): Promise<CapstoneProject[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CapstoneProject[];

      // Sort in JavaScript instead of using compound Firestore query
      return projects.sort((a, b) => {
        // Sort by year descending, then by displayOrder ascending
        const yearDiff = parseInt(b.year) - parseInt(a.year);
        if (yearDiff !== 0) return yearDiff;
        return a.displayOrder - b.displayOrder;
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return []; // Return empty array if collection doesn't exist yet
    }
  },

  // Get projects by year
  async getByYear(year: string): Promise<CapstoneProject[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('year', '==', year),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as CapstoneProject[];
  },

  // Create new capstone project
  async create(
    project: Omit<CapstoneProject, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...project,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // Update capstone project
  async update(
    id: string,
    project: Partial<Omit<CapstoneProject, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...project,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete capstone project
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Reorder projects
  async reorderProjects(
    updates: Array<{ id: string; displayOrder: number }>
  ): Promise<void> {
    const updatePromises = updates.map(({ id, displayOrder }) =>
      updateDoc(doc(db, COLLECTION_NAME, id), { displayOrder })
    );
    await Promise.all(updatePromises);
  },
};
