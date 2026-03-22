import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { fetchLocation, fetchLocationByCoords, type LocationProfile, type CivicOfficial } from '../lib/api';

export interface UserLocation {
  status: 'idle' | 'detecting' | 'resolving' | 'resolved' | 'error';
  address: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zip: string | null;
  legislativeDistrict: number | null;
  congressionalDistrict: number | null;
  lat: number | null;
  lng: number | null;
  officials: CivicOfficial[];
  error: string | null;
}

interface UserLocationContextValue {
  location: UserLocation;
  resolveByAddress: (address: string) => Promise<void>;
  resolveByGeolocation: () => Promise<void>;
  clearLocation: () => void;
  isPersonalized: boolean;
}

const STORAGE_KEY = 'az-civics-location';

const defaultLocation: UserLocation = {
  status: 'idle',
  address: null,
  city: null,
  county: null,
  state: null,
  zip: null,
  legislativeDistrict: null,
  congressionalDistrict: null,
  lat: null,
  lng: null,
  officials: [],
  error: null,
};

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

function profileToLocation(profile: LocationProfile): UserLocation {
  return {
    status: 'resolved',
    address: profile.address,
    city: profile.city,
    county: profile.county,
    state: profile.state,
    zip: profile.zip,
    legislativeDistrict: profile.legislativeDistrict,
    congressionalDistrict: profile.congressionalDistrict,
    lat: profile.lat,
    lng: profile.lng,
    officials: profile.officials,
    error: null,
  };
}

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.status === 'resolved') return parsed;
      }
    } catch { /* ignore */ }
    return defaultLocation;
  });

  // Persist to sessionStorage on change
  useEffect(() => {
    if (location.status === 'resolved') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    }
  }, [location]);

  const resolveByAddress = useCallback(async (address: string) => {
    setLocation(prev => ({ ...prev, status: 'resolving', error: null }));
    try {
      const profile = await fetchLocation(address);
      setLocation(profileToLocation(profile));
    } catch (err) {
      setLocation(prev => ({
        ...prev,
        status: 'error',
        error: (err as Error).message || 'Failed to resolve address',
      }));
    }
  }, []);

  const resolveByGeolocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setLocation(prev => ({ ...prev, status: 'error', error: 'Geolocation not supported' }));
      return;
    }

    setLocation(prev => ({ ...prev, status: 'detecting', error: null }));

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });

      setLocation(prev => ({ ...prev, status: 'resolving' }));
      const profile = await fetchLocationByCoords(pos.coords.latitude, pos.coords.longitude);
      setLocation(profileToLocation(profile));
    } catch (err) {
      const msg = err instanceof GeolocationPositionError
        ? 'Location access denied. Try entering your address instead.'
        : (err as Error).message || 'Failed to detect location';
      setLocation(prev => ({ ...prev, status: 'error', error: msg }));
    }
  }, []);

  const clearLocation = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    // Also clean up the old key
    sessionStorage.removeItem('az-civics-city');
    setLocation(defaultLocation);
  }, []);

  const isPersonalized = location.status === 'resolved';

  return (
    <UserLocationContext.Provider value={{ location, resolveByAddress, resolveByGeolocation, clearLocation, isPersonalized }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation(): UserLocationContextValue {
  const ctx = useContext(UserLocationContext);
  if (!ctx) throw new Error('useUserLocation must be used within UserLocationProvider');
  return ctx;
}
