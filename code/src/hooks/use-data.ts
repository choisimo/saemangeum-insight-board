import { useState, useEffect } from 'react';
import { dataService, type DataResponse, type InvestmentData, type TrafficData, type RenewableEnergyData, type WeatherData, type LandData, type ReclaimData, type BuildingPermitData, type UtilityData } from '@/lib/data-service';

export function useDatasets() {
  const [datasets, setDatasets] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dataService.loadDatasets();
      setDatasets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { datasets, loading, error, refetch: loadData };
}

export function useInvestmentData() {
  const [data, setData] = useState<InvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const investmentData = await dataService.getInvestmentData();
        setData(investmentData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load investment data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useTrafficData() {
  const [data, setData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const trafficData = await dataService.getTrafficData();
        setData(trafficData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load traffic data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useRenewableEnergyData() {
  const [data, setData] = useState<RenewableEnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const energyData = await dataService.getRenewableEnergyData();
        setData(energyData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load renewable energy data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useWeatherData() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const weatherData = await dataService.getWeatherData();
        setData(weatherData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useLandData() {
  const [data, setData] = useState<Array<LandData | ReclaimData>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const landData = await dataService.getLandData();
        setData(landData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load land data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useBuildingPermitData() {
  const [data, setData] = useState<BuildingPermitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const buildingData = await dataService.getBuildingPermitData();
        setData(buildingData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load building permit data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useUtilityData() {
  const [data, setData] = useState<UtilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const utilityData = await dataService.getUtilityData();
        setData(utilityData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load utility data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}