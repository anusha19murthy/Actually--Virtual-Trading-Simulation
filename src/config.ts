const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
const WS_BASE = API_BASE.replace('https://', 'wss://').replace('http://', 'ws://');

export { API_BASE, WS_BASE };