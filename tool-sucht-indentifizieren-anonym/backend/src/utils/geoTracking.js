/**
 * Server-Side Geo-Tracking
 * Zuverlässiges Geo-Tracking basierend auf Server-IP-Lookup
 */

const fetch = require('node-fetch');

/**
 * Get Geo-Location from IP address (Server-Side)
 * Uses multiple APIs with fallback for reliability
 * 
 * @param {string} ip - User IP address
 * @returns {Promise<object|null>} Geo data or null
 */
async function getGeoFromIP(ip) {
  // Skip for localhost/private IPs
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    console.log('⚠️ Local IP detected, skipping geo lookup:', ip);
    return null;
  }

  // Clean IPv6 mapped IPv4
  const cleanIP = ip.replace(/^::ffff:/, '');

  // Try multiple APIs for reliability
  const apis = [
    {
      name: 'ip-api.com',
      url: `http://ip-api.com/json/${cleanIP}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`,
      parse: (data) => ({
        ip: data.query,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        isp: data.isp
      })
    },
    {
      name: 'ipapi.co',
      url: `https://ipapi.co/${cleanIP}/json/`,
      parse: (data) => ({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org
      })
    },
    {
      name: 'geojs.io',
      url: `https://get.geojs.io/v1/ip/geo/${cleanIP}.json`,
      parse: (data) => ({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country_code,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        timezone: data.timezone,
        isp: data.organization_name
      })
    }
  ];

  // Try each API until one succeeds
  for (const api of apis) {
    try {
      console.log(`🌍 Trying geo lookup via ${api.name} for IP: ${cleanIP}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(api.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'SAMEBI-Backend/1.0' }
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`⚠️ ${api.name} returned status ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      // Check for API-specific error indicators
      if (data.status === 'fail' || data.error) {
        console.warn(`⚠️ ${api.name} error:`, data.message || data.error);
        continue;
      }

      const geoData = api.parse(data);
      
      console.log(`✅ Geo data from ${api.name}:`, {
        city: geoData.city,
        country: geoData.country,
        ip: cleanIP
      });

      return geoData;

    } catch (error) {
      console.warn(`⚠️ ${api.name} failed:`, error.message);
      continue;
    }
  }

  console.error('❌ All geo APIs failed for IP:', cleanIP);
  return null;
}

/**
 * Extract real IP from request (behind proxies like Traefik)
 * 
 * @param {object} req - Express request object
 * @returns {string} Client IP address
 */
function getClientIP(req) {
  // Try various headers (Traefik, Cloudflare, etc.)
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip
  );
}

/**
 * Get complete server-side tracking data
 * 
 * @param {object} req - Express request object
 * @returns {Promise<object>} Complete tracking data
 */
async function getServerSideTracking(req) {
  const clientIP = getClientIP(req);
  const geoData = await getGeoFromIP(clientIP);

  return {
    ip: clientIP,
    geoData,
    serverTimestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'Unknown',
    acceptLanguage: req.headers['accept-language'] || 'Unknown'
  };
}

module.exports = {
  getGeoFromIP,
  getClientIP,
  getServerSideTracking
};

