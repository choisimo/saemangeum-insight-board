/**
 * 공통 포맷터 유틸리티 함수들
 */

/**
 * 퍼센트 값을 소수점 2자리까지 포맷팅
 * @param value 소수 또는 퍼센트 값
 * @param isDecimal true이면 0-1 범위의 소수로 취급 (기본), false이면 이미 퍼센트 값으로 취급
 * @returns 포맷된 퍼센트 문자열 (예: "85.34%")
 */
export const formatPercentage = (value: number, isDecimal: boolean = true): string => {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(2)}%`;
};

/**
 * 통화 값을 포맷팅 (억원 단위)
 * @param value 억원 단위 값
 * @returns 포맷된 통화 문자열 (예: "1,234억원")
 */
export const formatCurrency = (value: number): string => {
  return `${value.toLocaleString()}억원`;
};

/**
 * 숫자를 천 단위 구분자와 함께 포맷팅
 * @param value 숫자 값
 * @returns 포맷된 숫자 문자열 (예: "1,234")
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * 변화율을 포맷팅 (+/- 기호 포함)
 * @param value 변화율 (소수)
 * @returns 포맷된 변화율 문자열 (예: "+12.34%", "-5.67%")
 */
export const formatChangeRate = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatPercentage(value, true)}`;
};

/**
 * 진행률을 소수점 2자리까지 포맷팅
 * @param current 현재 값
 * @param total 전체 값
 * @returns 포맷된 진행률 문자열 (예: "67.89%")
 */
export const formatProgress = (current: number, total: number): string => {
  if (total === 0) return "0.00%";
  return formatPercentage(current / total, true);
};