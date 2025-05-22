export class LocalStorageAdapter {
  private getKey(date: string): string {
    return `emotion_${date}`;
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage remove error:', error);
    }
  }

  getEmotionKey(date: string): string {
    return this.getKey(date);
  }
}
