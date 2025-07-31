// Mock database configuration for WebContainer environment
// MongoDB cannot run in WebContainer, so we'll use mock data

const connectDB = async () => {
  console.log('🔧 WebContainer Environment Detected');
  console.log('📝 MongoDB is not available in WebContainer - using mock database');
  console.log('✅ Mock database initialized for development');

  // Set up mock database state
  global.mockDatabase = true;
  global.dbConnected = false;

  // Create mock collections in memory
  global.mockCollections = {
    users: [],
    pets: [],
    products: [],
    orders: [],
    diseases: [],
    chats: []
  };

  // Mock successful connection for development
  return {
    connection: {
      host: 'mock-database',
      readyState: 1 // connected state
    }
  };
};

// Mock mongoose connection object
const mockConnection = {
  readyState: 1,
  on: () => {},
  close: () => Promise.resolve()
};

// Export mock connection
export { mockConnection as connection };
export default connectDB;