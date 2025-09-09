// Environment configuration for chat application
export const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Try to detect based on current location
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;
  
  console.log('Environment detection:', {
    hostname: currentHost,
    protocol: currentProtocol,
    port: currentPort,
    fullUrl: window.location.href
  });
  
  // For local development (localhost:5173) - use production API
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    // Use production API even for local development since backend is not running locally
    const productionUrl = 'https://codewithvijay.online:9091';
    console.log('Local development detected, using production API:', productionUrl);
    return productionUrl;
  }
  
  // For production (codewithvijay.online)
  if (currentHost === 'codewithvijay.online') {
    // Use the main domain with port 9091 (which proxies to chat API on 8080)
    const productionUrl = 'https://codewithvijay.online:9091';
    console.log('Production detected, using:', productionUrl);
    return productionUrl;
  }
  
  // Default fallback based on current protocol
  const fallbackUrl = currentProtocol === 'https:' 
    ? 'https://codewithvijay.online:9091' 
    : 'https://codewithvijay.online:9091';
  console.log('Using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

export const getEnvironmentInfo = () => {
  const currentHost = window.location.hostname;
  const isLocal = currentHost === 'localhost' || currentHost === '127.0.0.1';
  const isProduction = currentHost === 'codewithvijay.online';
  
  return {
    isLocal,
    isProduction,
    hostname: currentHost,
    protocol: window.location.protocol,
    port: window.location.port,
    fullUrl: window.location.href
  };
};

export const getPossibleUrls = () => {
  const env = getEnvironmentInfo();
  
  if (env.isLocal) {
    return [
      'https://codewithvijay.online:9091',
      'https://codewithvijay.online',
      'https://api.codewithvijay.online'
    ];
  }
  
  return [
    'https://codewithvijay.online:9091',
    'https://codewithvijay.online',
    'https://api.codewithvijay.online'
  ];
};
