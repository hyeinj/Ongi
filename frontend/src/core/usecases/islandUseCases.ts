import { Island, Category } from '../entities';

// Island 스토리지 인터페이스
export interface IIslandStorage {
  get(): Promise<Island>;
  save(island: Island): Promise<void>;
  addDateToCategory(category: Category, date: string): Promise<void>;
  getDatesForCategory(category: Category): Promise<string[]>;
  getAllCategoryDates(): Promise<Record<string, string[]>>;
  getCategoryForDate(date: string): Promise<Category | null>;
  clear(): Promise<void>;
}

// Island 관련 비즈니스 로직을 담당하는 클래스
export class IslandUseCases {
  constructor(private islandStorage: IIslandStorage) {}

  // 카테고리에 날짜 추가
  async addDateToCategory(category: Category, date: string): Promise<void> {
    await this.islandStorage.addDateToCategory(category, date);
  }

  // 특정 카테고리의 날짜 리스트 조회
  async getDatesForCategory(category: Category): Promise<string[]> {
    return await this.islandStorage.getDatesForCategory(category);
  }

  // 모든 카테고리와 날짜 데이터 조회
  async getAllCategoryDates(): Promise<Record<string, string[]>> {
    return await this.islandStorage.getAllCategoryDates();
  }

  // 특정 날짜가 속한 카테고리 찾기
  async getCategoryForDate(date: string): Promise<Category | null> {
    return await this.islandStorage.getCategoryForDate(date);
  }

  // Island 데이터 초기화
  async clearIsland(): Promise<void> {
    await this.islandStorage.clear();
  }

  // Island 전체 데이터 조회
  async getIsland(): Promise<Island> {
    return await this.islandStorage.get();
  }
}
