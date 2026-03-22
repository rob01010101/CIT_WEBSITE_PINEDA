// Shared types for the application

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string[];
  contentHtml?: string;
  type: 'important' | 'achievement' | 'event' | 'facility';
  image?: {
    url: string;
    cloudinaryId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  cloudinaryId?: string;
  category: 'home-gallery' | 'about-featured' | 'awards-recognitions' | 'announcements';
  previewIcon?: string;
  displayOrder: number;
  uploadedAt: Date;
}

export interface Staff {
  id: string;
  name: string;
  role: string; // e.g., 'Dean', 'Faculty', 'SSITE Officer'
  position: string; // e.g., 'Computer Science', 'Web Development'
  fullTime: boolean;
  department?: string;
  image?: {
    url: string;
    cloudinaryId?: string;
  };
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees?: number;
  type: 'upcoming' | 'ongoing' | 'past';
  category: 'seminar' | 'workshop' | 'competition' | 'conference';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}
