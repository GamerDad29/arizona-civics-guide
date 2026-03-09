import { useState, useCallback, useEffect } from 'react';
import type { CivicOfficial, CongressMemberData } from '../types';
import { buildStaticOfficials, fetchCivicOfficials } from '../services/civicService';
import { fetchAZMembers, extractBioguideId, fetchSponsoredBills } from '../services/congressService';

const ADDRESS_KEY = 'az_civics_address';

export type AddressStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseCivicDataReturn {
  address: string;
  normalizedAddress: string;
  addressStatus: AddressStatus;
  addressError: string | null;
  officials: CivicOfficial[];
  staticOfficials: CivicOfficial[];
  congressMembers: CongressMemberData[];
  submitAddress: (addr: string) => Promise<void>;
  clearAddress: () => void;
  officialsByLevel: (level: 'local' | 'state' | 'federal') => CivicOfficial[];
  enrichOfficial: (official: CivicOfficial) => Promise<CivicOfficial>;
}

export function useCivicData(): UseCivicDataReturn {
  const staticOfficials = buildStaticOfficials();

  const [address, setAddress] = useState<string>(() => localStorage.getItem(ADDRESS_KEY) ?? '');
  const [normalizedAddress, setNormalizedAddress] = useState<string>('');
  const [addressStatus, setAddressStatus] = useState<AddressStatus>('idle');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [officials, setOfficials] = useState<CivicOfficial[]>(staticOfficials);
  const [congressMembers, setCongressMembers] = useState<CongressMemberData[]>([]);

  // Load Congress data once on mount
  useEffect(() => {
    fetchAZMembers().then(setCongressMembers);
  }, []);

  // Re-run civic API if we had a saved address on load
  useEffect(() => {
    const saved = localStorage.getItem(ADDRESS_KEY);
    if (saved) {
      submitAddress(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAddress = useCallback(async (addr: string) => {
    if (!addr.trim()) return;
    setAddressStatus('loading');
    setAddressError(null);
    try {
      const { officials: merged, normalizedAddress: norm } = await fetchCivicOfficials(addr.trim());
      setOfficials(merged);
      setNormalizedAddress(norm);
      setAddress(addr);
      setAddressStatus('success');
      localStorage.setItem(ADDRESS_KEY, addr.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Address lookup failed';
      setAddressError(msg);
      setAddressStatus('error');
      // Fall back to static data
      setOfficials(staticOfficials);
    }
  }, [staticOfficials]);

  const clearAddress = useCallback(() => {
    localStorage.removeItem(ADDRESS_KEY);
    setAddress('');
    setNormalizedAddress('');
    setAddressStatus('idle');
    setAddressError(null);
    setOfficials(staticOfficials);
  }, [staticOfficials]);

  const officialsByLevel = useCallback((level: 'local' | 'state' | 'federal') => {
    return officials.filter(o => o.level === level);
  }, [officials]);

  // Enrich a specific federal official with Congress sponsored bills
  const enrichOfficial = useCallback(async (official: CivicOfficial): Promise<CivicOfficial> => {
    if (official.level !== 'federal') return official;
    const bgId = official.bioguideId ?? extractBioguideId(official.congressGovUrl);
    if (!bgId) return official;

    // Check if already enriched
    if (official.congressData?.sponsoredBills) return official;

    const bills = await fetchSponsoredBills(bgId);
    return {
      ...official,
      bioguideId: bgId,
      congressData: {
        ...(official.congressData ?? { bioguideId: bgId }),
        bioguideId: bgId,
        sponsoredBills: bills,
      },
    };
  }, []);

  return {
    address,
    normalizedAddress,
    addressStatus,
    addressError,
    officials,
    staticOfficials,
    congressMembers,
    submitAddress,
    clearAddress,
    officialsByLevel,
    enrichOfficial,
  };
}
