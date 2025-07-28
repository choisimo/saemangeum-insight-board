# 새만금 인사이트 대시보드 - 기술 분석 방법론

## 문서 정보
- **프로젝트명**: 새만금 인사이트 대시보드
- **문서 유형**: 기술 분석 방법론 (Technical Analysis Methodology)
- **버전**: 1.0
- **작성일**: 2025년 1월 28일
- **작성자**: 새만금 인사이트 대시보드 개발팀

## 1. 분석 방법론 개요

새만금 인사이트 대시보드는 4개 핵심 정책 영역에 대한 데이터 기반 분석을 통해 실시간 인사이트를 제공합니다. 본 문서는 각 영역별 분석 모델과 Python 기반 구현 방법론을 정의합니다.

### 1.1 핵심 분석 영역
1. **성장지 집촉 육성**: 교통량 및 관광 분석
2. **기반시설 구축**: 매립 정보 및 인프라 분석  
3. **투자환경 조성**: 기업 투자 유치 분석
4. **지속가능성 개발**: 재생에너지 적합도 분석

### 1.2 기술적 단순화 전략
- **분석 기법**: 상관계수 히트맵 + 다변량 ARIMA 예측 모델 적용
- **결측값 처리**: 평균 대체법 실시 (복잡한 임퓨테이션 생략)
- **시각화**: Streamlit 1-Page 보드 (그래픽 3개 + 사이드바 필터)

## 2. 핵심 라이브러리 및 환경 설정

### 2.1 필수 라이브러리
```python
# 기본 데이터 처리 및 분석
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 시계열 예측 모델
from prophet import Prophet
from statsmodels.tsa.statespace.sarimax import SARIMAX

# 머신러닝 및 분석
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN

# 공간 정보 분석
import geopandas as gpd
import folium

# AHP 분석
from ahpy import Compare

# 웹 대시보드
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# 네트워크 분석
import networkx as nx
```

### 2.2 설치 명령어
```bash
pip install streamlit pandas numpy matplotlib seaborn
pip install prophet scikit-learn geopandas folium
pip install plotly ahpy networkx
pip install statsmodels
```

## 3. 정책 영역별 분석 모델

### 3.1 성장지 집촉 육성 분석

#### 3.1.1 활용 데이터
- **새만금개발청_새만금 방조제 교통량**: 방조제 통행량 기간별 데이터
- **새만금개발청_기상정보초단기실황조회**: 실시간 기상 정보

#### 3.1.2 핵심 분석 모델
**시계열 예측 (SARIMA + Prophet)**
```python
def time_series_forecast(data, target_column):
    """
    시계열 예측 모델 (SARIMA + Prophet 결합)
    관광객/교통량 최대 안내시점 예측 → 도로 확충/서비스 일정표 제안
    """
    # Prophet 모델
    df_prophet = data[['date', target_column]].rename(
        columns={'date': 'ds', target_column: 'y'}
    )
    
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        changepoint_prior_scale=0.05
    )
    model.fit(df_prophet)
    
    # 미래 30일 예측
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    
    return forecast

# 교통-날씨 회귀 모델
def traffic_weather_regression(traffic_data, weather_data):
    """
    교통량과 날씨 조건 간의 상관관계 분석
    """
    merged_data = pd.merge(traffic_data, weather_data, on='date')
    
    X = merged_data[['temperature', 'humidity', 'precipitation']]
    y = merged_data['traffic_volume']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    return model
```

#### 3.1.3 주요 인사이트
- 관광객/교통량 최대 안내시점 예측
- 시즌별 예측을 통한 도로 확충 계획 수립
- 서비스 일정표 최적화 제안

### 3.2 기반시설 구축 분석

#### 3.2.1 활용 데이터
- **새만금개발청_새만금사업 매립_정보**: 매립 진행 현황
- **새만금개발청_새만금사업지역 지적공부**: 토지 정보 및 용도

#### 3.2.2 핵심 분석 모델
**공간 시계열 분석 (GIS + 시계열)**
```python
def spatial_temporal_analysis(gis_data, land_data):
    """
    공간정보 기반 매립 진행 분석
    공구별/용도별 매립 완료 예상 연도 → 인프라 선투자 시점 도출
    """
    # 공간 데이터 로드
    gdf = gpd.read_file(gis_data)
    
    # 클러스터링을 통한 지역 분류
    coords = gdf[['geometry']].apply(
        lambda x: [x.geometry.centroid.x, x.geometry.centroid.y], axis=1
    )
    coords_array = np.array(coords.tolist())
    
    kmeans = KMeans(n_clusters=5, random_state=42)
    gdf['cluster'] = kmeans.fit_predict(coords_array)
    
    # 매립 진행률 계산
    gdf['completion_rate'] = gdf['completed_area'] / gdf['total_area']
    
    # 지도 시각화
    m = folium.Map(location=[35.8, 126.5], zoom_start=10)
    
    for idx, row in gdf.iterrows():
        folium.GeoJson(
            row['geometry'],
            style_function=lambda x: {
                'fillColor': f'cluster_{row["cluster"]}',
                'fillOpacity': row['completion_rate']
            }
        ).add_to(m)
    
    return m, gdf
```

#### 3.2.3 주요 인사이트
- 공구별/용도별 매립 완료 예상 연도 산출
- 인프라 선투자 최적 시점 도출
- 단계별 개발 우선순위 제안

### 3.3 투자환경 조성 분석

#### 3.3.1 활용 데이터
- **새만금개발청_새만금 투자 인센티브 보조금지원 현황**: 투자 인센티브 정보
- **새만금개발청_새만금산업단지 입주기업 계약 현황**: 기업 입주 현황

#### 3.3.2 핵심 분석 모델
**다변량 로지스틱/랜덤포레스트 + 네트워크 분석**
```python
def investment_analysis(company_data):
    """
    기업 특성/인센티브 조합별 입주 성공 확률 모델
    산업용수 이용 용량 분석
    """
    # 특성 변수
    features = ['incentive_amount', 'company_size', 'industry_type',
                'infrastructure_score', 'accessibility_score']
    
    X = company_data[features]
    y = company_data['investment_decision']  # 0: 미투자, 1: 투자
    
    # 데이터 전처리
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 랜덤포레스트 모델
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_scaled, y)
    
    # 로지스틱 회귀 모델
    lr_model = LogisticRegression(random_state=42)
    lr_model.fit(X_scaled, y)
    
    return rf_model, lr_model, scaler

def network_analysis(company_connections):
    """
    기업 간 연결관계 분석
    """
    G = nx.from_pandas_edgelist(
        company_connections, 'company_a', 'company_b'
    )
    
    # 중심성 분석
    centrality = nx.degree_centrality(G)
    betweenness = nx.betweenness_centrality(G)
    
    return G, centrality, betweenness
```

#### 3.3.3 주요 인사이트
- 기업 특성/인센티브 조합별 입주 성공 확률 모델
- 산업용수 이용 용량 최적화 분석
- 기업 간 시너지 효과 예측

### 3.4 지속가능성 개발 분석

#### 3.4.1 활용 데이터
- **새만금개발청_새만금 재생에너지 사업 정보**: 재생에너지 현황
- **새만금개발청_기상정보초단기실황조회**: 기상 정보 (풍속, 일조량)

#### 3.4.2 핵심 분석 모델
**입지 적합도 분석 (AHP + 클러스터링)**
```python
def ahp_analysis(criteria_data):
    """
    AHP 기반 재생에너지 최적 입지 분석
    MW당 발전 효율 TOP 5 후보지 선정
    """
    # AHP 매트릭스 생성
    comparisons = Compare(
        name='Renewable Energy Site Selection',
        comparisons={
            ('Wind Speed', 'Solar Radiation'): 1/2,
            ('Wind Speed', 'Land Cost'): 3,
            ('Solar Radiation', 'Land Cost'): 2
        }, 
        precision=3
    )
    
    weights = comparisons.target_weights
    
    # 가중치 적용한 점수 계산
    criteria_data['total_score'] = (
        criteria_data['wind_speed'] * weights['Wind Speed'] +
        criteria_data['solar_radiation'] * weights['Solar Radiation'] +
        criteria_data['land_cost'] * weights['Land Cost']
    )
    
    # 클러스터링
    coords = criteria_data[['latitude', 'longitude']]
    clustering = DBSCAN(eps=0.01, min_samples=5)
    criteria_data['cluster'] = clustering.fit_predict(coords)
    
    return criteria_data, weights

def renewable_energy_forecast(energy_data):
    """
    발전량 시계열 예측
    """
    model = Prophet(
        yearly_seasonality=True,
        daily_seasonality=True,
        seasonality_mode='multiplicative'
    )
    
    df_prophet = energy_data[['date', 'generation']].rename(
        columns={'date': 'ds', 'generation': 'y'}
    )
    
    model.fit(df_prophet)
    
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)
    
    return forecast
```

#### 3.4.3 주요 인사이트
- MW당 발전 효율 TOP 5 후보지 선정
- 에너지원별 최적 입지 조건 분석
- 장기 발전량 예측 및 수익성 분석

## 4. Streamlit 대시보드 구현

### 4.1 1-Page 보드 구성
```python
def create_dashboard():
    """
    새만금 인사이트 보드 메인 대시보드
    """
    st.title("새만금 인사이트 보드")
    
    # 사이드바 설정 (날짜 슬라이더 + 차원체크박스)
    st.sidebar.header("필터 설정")
    
    # 날짜 슬라이더
    date_range = st.sidebar.date_input(
        "분석 기간 선택",
        value=(pd.to_datetime('2024-01-01'), pd.to_datetime('2024-12-31'))
    )
    
    # 차원 체크박스
    dimensions = st.sidebar.multiselect(
        "분석 차원 선택",
        ['교통량', '투자유치', '재생에너지', '관광객'],
        default=['교통량', '투자유치']
    )
    
    # 메인 대시보드 (3개 그래픽)
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.subheader("시계열 라인 차트")
        # 시계열 예측 결과 표시
        fig_line = px.line(
            forecast_data, x='ds', y='yhat',
            title='교통량 예측'
        )
        st.plotly_chart(fig_line, use_container_width=True)
    
    with col2:
        st.subheader("예측 그림자 (신뢰구간)")
        # 예측 구간 시각화
        fig_shadow = go.Figure()
        fig_shadow.add_trace(go.Scatter(
            x=forecast_data['ds'],
            y=forecast_data['yhat_upper'],
            fill=None,
            mode='lines',
            line_color='rgba(0,100,80,0)'
        ))
        fig_shadow.add_trace(go.Scatter(
            x=forecast_data['ds'],
            y=forecast_data['yhat_lower'],
            fill='tonexty',
            mode='lines',
            line_color='rgba(0,100,80,0)',
            name='예측 구간'
        ))
        st.plotly_chart(fig_shadow, use_container_width=True)
    
    with col3:
        st.subheader("성과 히트맵")
        # 상관계수 히트맵
        correlation_matrix = performance_data.corr()
        fig_heatmap = px.imshow(
            correlation_matrix,
            text_auto=True,
            title='KPI 상관관계'
        )
        st.plotly_chart(fig_heatmap, use_container_width=True)
```

### 4.2 실행 방법
```bash
# 터미널에서 실행
streamlit run dashboard.py

# 또는 주피터 노트북에서 개별 분석
python saemangeum_analysis.py
```

## 5. 통합 분석 파이프라인

### 5.1 메인 실행 스크립트
```python
def main_analysis_pipeline():
    """
    새만금 인사이트 보드 통합 분석 파이프라인
    """
    # 1. 데이터 로드
    traffic_data = pd.read_csv('새만금개발청_새만금 방조제 교통량.csv')
    weather_data = pd.read_csv('새만금개발청_기상정보초단기실황조회.csv')
    investment_data = pd.read_csv('새만금개발청_새만금 투자 인센티브 보조금지원 현황.csv')
    energy_data = pd.read_csv('새만금개발청_새만금 재생에너지 사업 정보.csv')
    gis_data = 'saemangeum_districts.shp'
    
    # 2. 모델 실행
    # 교통/관광 분석
    traffic_forecast = time_series_forecast(traffic_data, 'traffic_volume')
    traffic_model = traffic_weather_regression(traffic_data, weather_data)
    
    # 투자환경 분석
    investment_models = investment_analysis(investment_data)
    
    # 공간정보 분석
    spatial_map, gis_results = spatial_temporal_analysis(gis_data, None)
    
    # 재생에너지 분석
    energy_analysis, weights = ahp_analysis(energy_data)
    energy_forecast = renewable_energy_forecast(energy_data)
    
    # 3. 결과 저장
    traffic_forecast.to_csv('results/traffic_forecast.csv', index=False)
    energy_analysis.to_csv('results/energy_analysis.csv', index=False)
    gis_results.to_file('results/spatial_analysis.shp')
    
    # 4. 대시보드 실행
    create_dashboard()
    
    return "분석 완료!"

# 스크립트 실행
if __name__ == "__main__":
    result = main_analysis_pipeline()
    print(result)
```

### 5.2 성능 최적화 고려사항
- **데이터 캐싱**: Streamlit @st.cache_data 데코레이터 활용
- **비동기 처리**: 대용량 데이터 처리 시 백그라운드 작업
- **메모리 관리**: 데이터 청크 단위 처리로 메모리 효율성 확보

## 6. 데이터 품질 관리

### 6.1 결측값 처리 전략
```python
def handle_missing_values(df):
    """
    결측값 처리 (평균 대체법 적용)
    """
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
    
    categorical_columns = df.select_dtypes(include=['object']).columns
    df[categorical_columns] = df[categorical_columns].fillna('Unknown')
    
    return df
```

### 6.2 데이터 검증 규칙
- **범위 검증**: 수치 데이터의 논리적 범위 확인
- **일관성 검증**: 날짜, 단위 등의 일관성 확인
- **완전성 검증**: 필수 필드의 완전성 확인

## 7. 배포 및 운영

### 7.1 Docker 기반 배포
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "dashboard.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

### 7.2 모니터링 및 로깅
- **성능 모니터링**: 응답 시간, 메모리 사용량 추적
- **오류 로깅**: 데이터 처리 오류 및 예외 상황 기록
- **사용자 분석**: 대시보드 사용 패턴 분석

---

**작성일**: 2025년 1월 28일  
**작성자**: 새만금 인사이트 대시보드 개발팀  
**검토자**: [TBD]  
**승인자**: [TBD]