// 카테고리별 날짜 리스트를 저장하는 인터페이스
export interface CategoryDates {
  [category: string]: string[]; // 각 카테고리에 해당하는 날짜들의 배열
}

// Island 전체 구조
export interface Island {
  category: CategoryDates;
}
