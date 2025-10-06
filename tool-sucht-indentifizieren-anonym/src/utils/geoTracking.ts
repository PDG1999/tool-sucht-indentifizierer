/**
 * Geo-Tracking & Metadata Collection
 * Erfasst automatisch Geodaten und Browser-Informationen
 */

export interface GeoData {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
}

export interface DeviceData {
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  screenResolution: string;
  language: string;
  timezone: string;
  cookiesEnabled: boolean;
}

export interface TrackingData {
  geoData: GeoData | null;
  deviceData: DeviceData;
  timestamp: string;
  referrer: string;
  browserFingerprint: string;
}

/**
 * Detect device type from user agent
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Parse user agent to extract browser info
 */
function getBrowserInfo(): { browser: string; browserVersion: string; os: string; osVersion: string } {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';
  let osVersion = 'Unknown';

  // Browser detection
  if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Edg') > -1) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Chrome') > -1) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Safari') > -1) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
  }

  // OS detection
  if (ua.indexOf('Win') > -1) {
    os = 'Windows';
    osVersion = ua.match(/Windows NT ([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Mac') > -1) {
    os = 'macOS';
    osVersion = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (ua.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    os = 'Android';
    osVersion = ua.match(/Android ([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
    os = 'iOS';
    osVersion = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  }

  return { browser, browserVersion, os, osVersion };
}

/**
 * Generate a simple browser fingerprint
 */
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser Fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Get device metadata
 */
export function getDeviceData(): DeviceData {
  const { browser, browserVersion, os, osVersion } = getBrowserInfo();
  
  return {
    userAgent: navigator.userAgent,
    deviceType: getDeviceType(),
    browser,
    browserVersion,
    os,
    osVersion,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled
  };
}

/**
 * Fetch geo data from IP (using free API)
 */
export async function getGeoData(): Promise<GeoData | null> {
  try {
    // Use ipapi.co - free, no API key needed, 1000 requests/day
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      console.warn('Geo API request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      isp: data.org
    };
  } catch (error) {
    console.warn('Failed to fetch geo data:', error);
    return null;
  }
}

/**
 * Get complete tracking data
 */
export async function getTrackingData(): Promise<TrackingData> {
  const geoData = await getGeoData();
  const deviceData = getDeviceData();
  
  return {
    geoData,
    deviceData,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'direct',
    browserFingerprint: generateFingerprint()
  };
}
