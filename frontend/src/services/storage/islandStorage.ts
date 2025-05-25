import { Island, Category } from '../../core/entities';
import { IIslandStorage } from '../../core/usecases/islandUseCases';

const ISLAND_STORAGE_KEY = 'island';

// Island 데이터 스토리지 서비스
export class IslandStorage implements IIslandStorage {
  // Island 데이터 조회
  async get(): Promise<Island> {
    try {
      const data = localStorage.getItem(ISLAND_STORAGE_KEY);
      return data ? JSON.parse(data) : { category: {} };
    } catch (error) {
      console.error('Island 데이터 조회 실패:', error);
      return { category: {} };
    }
  }

  // Island 데이터 저장
  async save(island: Island): Promise<void> {
    try {
      localStorage.setItem(ISLAND_STORAGE_KEY, JSON.stringify(island));
    } catch (error) {
      console.error('Island 데이터 저장 실패:', error);
      throw error;
    }
  }

  // 특정 카테고리에 날짜 추가
  async addDateToCategory(category: Category, date: string): Promise<void> {
    try {
      const currentIsland = await this.get();

      if (!currentIsland.category[category]) {
        currentIsland.category[category] = [];
      }

      // 중복 날짜 방지
      if (!currentIsland.category[category].includes(date)) {
        currentIsland.category[category].push(date);
        // 날짜 순으로 정렬
        currentIsland.category[category].sort();
      }

      await this.save(currentIsland);
    } catch (error) {
      console.error('카테고리에 날짜 추가 실패:', error);
      throw error;
    }
  }

  // 특정 카테고리의 날짜 리스트 조회
  async getDatesForCategory(category: Category): Promise<string[]> {
    try {
      const island = await this.get();
      return island.category[category] || [];
    } catch (error) {
      console.error('카테고리별 날짜 조회 실패:', error);
      return [];
    }
  }

  // 모든 카테고리와 날짜 데이터 조회
  async getAllCategoryDates(): Promise<Record<string, string[]>> {
    try {
      const island = await this.get();
      return island.category;
    } catch (error) {
      console.error('전체 카테고리 데이터 조회 실패:', error);
      return {};
    }
  }

  // 특정 날짜가 속한 카테고리 찾기
  async getCategoryForDate(date: string): Promise<Category | null> {
    try {
      const island = await this.get();
      for (const [category, dates] of Object.entries(island.category)) {
        if (dates.includes(date)) {
          return category as Category;
        }
      }
      return null;
    } catch (error) {
      console.error('날짜별 카테고리 조회 실패:', error);
      return null;
    }
  }

  // Island 데이터 초기화
  async clear(): Promise<void> {
    try {
      localStorage.removeItem(ISLAND_STORAGE_KEY);
    } catch (error) {
      console.error('Island 데이터 초기화 실패:', error);
      throw error;
    }
  }
}
