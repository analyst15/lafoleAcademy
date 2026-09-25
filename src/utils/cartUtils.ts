import { CartItem, Course } from '../types';

export const DEFAULT_CART_ITEMS: CartItem[] = [
  {
    courseId: 'course-illustrator-cc',
    title: 'Adobe Illustrator CC: Vector Art & Graphic Design',
    price: 20.0,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    category: 'Design',
    instructorName: 'Lafole Design Academy'
  },
  {
    courseId: 'course-ceh-301',
    title: 'CEH: System Hacking & Ethical Penetration Testing',
    price: 30.0,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80',
    category: 'Cybersecurity',
    instructorName: 'Dr. Michael Chen'
  },
  {
    courseId: 'course-ai-skills-01',
    title: 'AI Skills: From Beginner to Advanced Generative AI',
    price: 40.0,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&auto=format&fit=crop&q=80',
    category: 'Artificial Intelligence',
    instructorName: 'Amina Warsame'
  }
];

const CART_STORAGE_KEY = 'lafole_cart_items';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // If student is signed out (email not verified), ensure legacy pre-populated template courses are cleared
      const isVerified = localStorage.getItem('lafole_email_verified') === 'true';
      if (!isVerified) {
        const isLegacyDefault = parsed.length === 3 && 
          parsed.some(item => item.courseId === 'course-illustrator-cc') &&
          parsed.some(item => item.courseId === 'course-ceh-301');
        if (isLegacyDefault) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
          return [];
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading cart from storage:', e);
  }
  return [];
}

export function clearCart(): CartItem[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('lafole_cart_updated', { detail: [] }));
    } catch (e) {
      console.error('Error clearing cart from storage:', e);
    }
  }
  return [];
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('lafole_cart_updated', { detail: items }));
  } catch (e) {
    console.error('Error saving cart to storage:', e);
  }
}

export function addCourseToCart(
  courseOrItem: Course | CartItem | { courseId?: string; id?: string; title: string; price?: number; thumbnail?: string }
): CartItem[] {
  const currentItems = getStoredCart();
  const id = 'courseId' in courseOrItem && courseOrItem.courseId 
    ? courseOrItem.courseId 
    : 'id' in courseOrItem && courseOrItem.id 
      ? courseOrItem.id 
      : `course-${Date.now()}`;

  const exists = currentItems.some(i => i.courseId === id);
  if (exists) {
    return currentItems;
  }

  const newItem: CartItem = {
    courseId: id,
    title: courseOrItem.title || 'Enrolled Course Track',
    price: typeof courseOrItem.price === 'number' && courseOrItem.price > 0 ? courseOrItem.price : 20.0,
    thumbnail: courseOrItem.thumbnail || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80',
    category: 'category' in courseOrItem ? courseOrItem.category : 'Certification'
  };

  const updated = [newItem, ...currentItems];
  saveCart(updated);
  return updated;
}

export function removeCourseFromCart(courseId: string): CartItem[] {
  const currentItems = getStoredCart();
  const updated = currentItems.filter(item => item.courseId !== courseId);
  saveCart(updated);
  return updated;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
}
