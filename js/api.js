// API Service for Grid4 Dashboard
// Environment configurations
const ENVIRONMENTS = {
    dev: {
        name: 'Development',
        url: 'https://registrar.dev4.grid.tf/api/v1'
    },
    qa: {
        name: 'QA',
        url: 'https://registrar.qa4.grid.tf/api/v1'
    },
    test: {
        name: 'Test',
        url: 'https://registrar.test4.grid.tf/api/v1'
    },
    prod: {
        name: 'Production',
        url: 'https://registrar.prod4.grid.tf/api/v1'
    }
};

// Default environment
let currentEnv = localStorage.getItem('grid4_environment') || 'prod';

// Make sure the stored environment is valid
if (!ENVIRONMENTS[currentEnv]) {
    currentEnv = 'prod';
    localStorage.setItem('grid4_environment', currentEnv);
}

// Get the current API base URL
const getApiBaseUrl = () => ENVIRONMENTS[currentEnv].url;

// Function to change the environment
function changeEnvironment(env) {
    if (ENVIRONMENTS[env]) {
        currentEnv = env;
        localStorage.setItem('grid4_environment', env);
        // Dispatch an event to notify components that the environment has changed
        window.dispatchEvent(new CustomEvent('environment-changed', { detail: { env } }));
        return true;
    }
    return false;
}

// Helper function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    return { error: error.message || 'An error occurred while fetching data' };
}

// API Service object
const apiService = {
    // Farms API
    farms: {
        // Get farms list with optional filters
        async getList(page = 1, size = 10, filters = {}) {
            try {
                let url = `${getApiBaseUrl()}/farms?page=${page}&size=${size}`;

                // Add filters if provided
                if (filters.farm_name) url += `&farm_name=${encodeURIComponent(filters.farm_name)}`;
                if (filters.farm_id) url += `&farm_id=${filters.farm_id}`;
                if (filters.twin_id) url += `&twin_id=${filters.twin_id}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                return handleApiError(error);
            }
        },

        // Get farm details by ID
        async getById(farmId) {
            try {
                const response = await fetch(`${getApiBaseUrl()}/farms/${farmId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                return handleApiError(error);
            }
        }
    },

    // Nodes API
    nodes: {
        // Get nodes list with optional filters
        async getList(page = 1, size = 10, filters = {}) {
            try {
                let url = `${getApiBaseUrl()}/nodes?page=${page}&size=${size}`;

                // Add filters if provided
                if (filters.node_id) url += `&node_id=${filters.node_id}`;
                if (filters.farm_id) url += `&farm_id=${filters.farm_id}`;
                if (filters.twin_id) url += `&twin_id=${filters.twin_id}`;
                if (filters.status) url += `&status=${filters.status}`;
                if (filters.healthy !== undefined) url += `&healthy=${filters.healthy}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                return handleApiError(error);
            }
        },

        // Get node details by ID
        async getById(nodeId) {
            try {
                const response = await fetch(`${getApiBaseUrl()}/nodes/${nodeId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                return handleApiError(error);
            }
        },

        // Get nodes by farm ID
        async getByFarmId(farmId, page = 1, size = 10) {
            try {
                const url = `${getApiBaseUrl()}/nodes?farm_id=${farmId}&page=${page}&size=${size}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                return handleApiError(error);
            }
        }
    }
};

// Helper functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Export the API service and environment functions
window.apiService = apiService;
window.currentEnv = currentEnv;
window.ENVIRONMENTS = ENVIRONMENTS;
window.changeEnvironment = changeEnvironment;
