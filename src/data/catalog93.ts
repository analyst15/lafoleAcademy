import { Course } from '../types';
import { INITIAL_COURSES } from './courses';

export interface SubjectConfig {
  name: string;
  count: number;
}

export const CATALOG_SUBJECTS: SubjectConfig[] = [
  { name: 'Beginner English', count: 1 },
  { name: 'Intermediate English', count: 1 },
  { name: 'English Primary One', count: 1 },
  { name: 'Vocabulary', count: 1 },
  { name: 'Grammar', count: 1 },
  { name: 'Speaking & Pronunciation', count: 2 },
  { name: 'Conversational English', count: 2 },
  { name: 'Business English', count: 0 },
];

// Returns the active catalog of English courses
export function getAll93Courses(): Course[] {
  return INITIAL_COURSES;
}

export const getAllCourses = getAll93Courses;
