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

  // 새로운 구조: 하나의 emotion 키 아래에 날짜별 데이터 저장
  private static readonly EMOTION_STORAGE_KEY = 'emotion';
  private static readonly LETTER_STORAGE_KEY = 'letters';

  getEmotionData(): Record<string, unknown> {
    return this.get<Record<string, unknown>>(LocalStorageAdapter.EMOTION_STORAGE_KEY) || {};
  }

  setEmotionData(data: Record<string, unknown>): void {
    this.set(LocalStorageAdapter.EMOTION_STORAGE_KEY, data);
  }

  getEmotionByDate<T>(date: string): T | null {
    const allData = this.getEmotionData();
    return (allData[date] as T) || null;
  }

  setEmotionByDate<T>(date: string, data: T): void {
    const allData = this.getEmotionData();
    allData[date] = data;
    this.setEmotionData(allData);
  }

  removeEmotionByDate(date: string): void {
    const allData = this.getEmotionData();
    delete allData[date];
    this.setEmotionData(allData);
  }

  // 편지 관련 메서드들
  getLetterData(): Record<string, unknown> {
    return this.get<Record<string, unknown>>(LocalStorageAdapter.LETTER_STORAGE_KEY) || {};
  }

  setLetterData(data: Record<string, unknown>): void {
    this.set(LocalStorageAdapter.LETTER_STORAGE_KEY, data);
  }

  getLetterByDate<T>(date: string): T | null {
    const allData = this.getLetterData();
    return (allData[date] as T) || null;
  }

  setLetterByDate<T>(date: string, data: T): void {
    const allData = this.getLetterData();
    allData[date] = data;
    this.setLetterData(allData);
  }

  removeLetterByDate(date: string): void {
    const allData = this.getLetterData();
    delete allData[date];
    this.setLetterData(allData);
  }

  // 기존 데이터 마이그레이션을 위한 메서드
  getAllEmotionKeys(): string[] {
    if (typeof window === 'undefined') return [];

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('emotion_')) {
        keys.push(key);
      }
    }
    return keys;
  }
}
