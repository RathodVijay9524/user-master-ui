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
  
  // For local development (localhost:5173)
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    // Try different local backend ports
    const localBackendPorts = ['9091', '8080', '3001', '5000', '8000'];
    const backendPort = localBackendPorts[0]; // Default to 9091
    const localUrl = `http://localhost:${backendPort}`;
    console.log('Local development detected, using:', localUrl);
    return localUrl;
  }
  
  // For production (codewithvijay.online)
  if (currentHost === 'codewithvijay.online') {
    // Try different possible production backend URLs
    const productionUrls = [
      'https://codewithvijay.online',
      'https://api.codewithvijay.online',
      'https://codewithvijay.online:9091',
      'https://codewithvijay.online:8080',
      'https://codewithvijay.online:3000',
      'https://codewithvijay.online:5000'
    ];
    const productionUrl = productionUrls[0]; // Default to main domain
    console.log('Production detected, using:', productionUrl);
    return productionUrl;
  }
  
  // Default fallback based on current protocol
  const fallbackUrl = currentProtocol === 'https:' 
    ? 'https://codewithvijay.online' 
    : 'http://localhost:9091';
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
      'http://localhost:9091',
      'http://localhost:8080',
      'http://localhost:3001',
      'http://localhost:5000',
      'http://localhost:8000'
    ];
  }
  
  return [
    'https://codewithvijay.online',
    'https://api.codewithvijay.online',
    'https://codewithvijay.online:9091',
    'https://codewithvijay.online:8080',
    'https://codewithvijay.online:3000',
    'https://codewithvijay.online:5000'
  ];
};
