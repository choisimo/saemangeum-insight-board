import React, { useEffect, useState } from 'react';
import { useInvestmentData, useTrafficData, useRenewableEnergyData, useWeatherData } from '@/hooks/use-data';

export function ApiTest() {
  const investment = useInvestmentData();
  const traffic = useTrafficData();
  const renewable = useRenewableEnergyData();
  const weather = useWeatherData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">API 테스트</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 투자 데이터 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">투자 데이터</h2>
          <p>상태: {investment.loading ? '로딩중...' : investment.error ? '에러' : '완료'}</p>
          <p>데이터 수: {investment.data.length}개</p>
          {investment.error && (
            <p className="text-red-500 text-sm">오류: {investment.error.message}</p>
          )}
          {investment.data.slice(0, 3).map((item, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded mt-2">
              <p>회사: {item.company}</p>
              <p>제도: {item.sector}</p>
              <p>지역: {item.location}</p>
            </div>
          ))}
        </div>

        {/* 교통량 데이터 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">교통량 데이터</h2>
          <p>상태: {traffic.loading ? '로딩중...' : traffic.error ? '에러' : '완료'}</p>
          <p>데이터 수: {traffic.data.length}개</p>
          {traffic.error && (
            <p className="text-red-500 text-sm">오류: {traffic.error.message}</p>
          )}
          {traffic.data.slice(0, 3).map((item, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded mt-2">
              <p>날짜: {item.date}</p>
              <p>출발: {item.departure}</p>
              <p>도착: {item.destination}</p>
              <p>총 교통량: {item.totalTraffic.toLocaleString()}대</p>
            </div>
          ))}
        </div>

        {/* 재생에너지 데이터 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">재생에너지 데이터</h2>
          <p>상태: {renewable.loading ? '로딩중...' : renewable.error ? '에러' : '완료'}</p>
          <p>데이터 수: {renewable.data.length}개</p>
          {renewable.error && (
            <p className="text-red-500 text-sm">오류: {renewable.error.message}</p>
          )}
          {renewable.data.slice(0, 3).map((item, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded mt-2">
              <p>지역: {item.region}</p>
              <p>유형: {item.generationType}</p>
              <p>용량: {item.capacity}MW</p>
              <p>면적: {(item.area / 1000000).toFixed(2)}km²</p>
            </div>
          ))}
        </div>

        {/* 날씨 데이터 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">날씨 데이터</h2>
          <p>상태: {weather.loading ? '로딩중...' : weather.error ? '에러' : '완료'}</p>
          <p>데이터: {weather.data ? '있음' : '없음'}</p>
          {weather.error && (
            <p className="text-red-500 text-sm">오류: {weather.error.message}</p>
          )}
          {weather.data && (
            <div className="text-sm p-2 bg-gray-50 rounded mt-2">
              <p>기준일시: {weather.data.baseDate} {weather.data.baseTime}</p>
              <p>관측값 수: {weather.data.observations.length}개</p>
              {weather.data.observations.slice(0, 3).map((obs, index) => (
                <div key={index} className="ml-2">
                  <p>{obs.category}: {obs.obsrValue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}