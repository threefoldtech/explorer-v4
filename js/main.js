// Main JavaScript file for Grid4 Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any global functionality here
    console.log('Grid4 Dashboard loaded');

    // Initialize environment selector
    initEnvironmentSelector();

    // Test API connection
    testApiConnection();

    // Load stats for the home page
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        loadStats();
    }

    // Listen for environment changes
    window.addEventListener('environment-changed', function() {
        console.log('Environment changed to:', currentEnv);
        updateEnvironmentDisplay();
        testApiConnection();

        // Reload stats if on home page
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            loadStats();
        }
    });
});

// Function to initialize environment selector
function initEnvironmentSelector() {
    const envSelector = document.getElementById('env-selector');
    if (!envSelector) return;

    // Clear existing options
    envSelector.innerHTML = '';

    // Add options for each environment
    Object.keys(ENVIRONMENTS).forEach(env => {
        const option = document.createElement('option');
        option.value = env;
        option.textContent = ENVIRONMENTS[env].name;
        option.selected = env === currentEnv;
        envSelector.appendChild(option);
    });

    // Add change event listener
    envSelector.addEventListener('change', function() {
        changeEnvironment(this.value);
    });

    // Update environment display
    updateEnvironmentDisplay();
}

// Function to update environment display
function updateEnvironmentDisplay() {
    // Update selector
    const envSelector = document.getElementById('env-selector');
    if (envSelector) {
        envSelector.value = currentEnv;
    }

    // Update environment badge
    const envBadge = document.getElementById('env-badge');
    if (envBadge) {
        envBadge.textContent = ENVIRONMENTS[currentEnv].name;

        // Update badge color based on environment
        envBadge.className = 'env-badge';
        envBadge.classList.add(`env-${currentEnv}`);
    }
}

// Function to test API connection
async function testApiConnection() {
    const apiStatusElement = document.getElementById('api-status');
    if (!apiStatusElement) return;

    console.log(`Testing API connection to ${ENVIRONMENTS[currentEnv].name}...`);
    apiStatusElement.textContent = `API Status: Testing connection to ${ENVIRONMENTS[currentEnv].name}...`;
    apiStatusElement.style.color = 'var(--dark-gray)';

    try {
        const startTime = performance.now();
        const response = await fetch(`${getApiBaseUrl()}/farms/?page=1&size=1`);
        const endTime = performance.now();

        if (response.ok) {
            const responseTime = endTime - startTime;
            console.log(`API connection successful! Response time: ${responseTime.toFixed(2)}ms`);

            // Update the API status indicator
            apiStatusElement.textContent = `API Status: Connected to ${ENVIRONMENTS[currentEnv].name} (${responseTime.toFixed(0)}ms)`;
            apiStatusElement.style.color = 'green';
        } else {
            console.warn(`API connection failed with status: ${response.status}`);
            apiStatusElement.textContent = `API Status: Error ${response.status} on ${ENVIRONMENTS[currentEnv].name}`;
            apiStatusElement.style.color = 'red';
        }
    } catch (error) {
        console.error('API connection error:', error);
        apiStatusElement.textContent = `API Status: Connection to ${ENVIRONMENTS[currentEnv].name} failed`;
        apiStatusElement.style.color = 'red';
    }
}

// Function to load and display stats on the home page
async function loadStats() {
    // Elements
    const farmsCountElement = document.getElementById('farms-count');
    const nodesCountElement = document.getElementById('nodes-count');
    const totalCruElement = document.getElementById('total-cru');
    const totalMruElement = document.getElementById('total-mru');
    const totalSruElement = document.getElementById('total-sru');
    const totalHruElement = document.getElementById('total-hru');

    // Set loading state
    if (farmsCountElement) farmsCountElement.textContent = 'Loading...';
    if (nodesCountElement) nodesCountElement.textContent = 'Loading...';
    if (totalCruElement) totalCruElement.textContent = 'Loading...';
    if (totalMruElement) totalMruElement.textContent = 'Loading...';
    if (totalSruElement) totalSruElement.textContent = 'Loading...';
    if (totalHruElement) totalHruElement.textContent = 'Loading...';

    try {
        // Fetch farms
        const farmsResponse = await fetch(`${getApiBaseUrl()}/farms/?page=1&size=1000`);
        if (farmsResponse.ok) {
            const farms = await farmsResponse.json();

            // Update farms count
            if (farmsCountElement) {
                farmsCountElement.textContent = farms.length.toLocaleString();
            }
        } else {
            if (farmsCountElement) farmsCountElement.textContent = 'Error';
        }

        // Fetch nodes
        const nodesResponse = await fetch(`${getApiBaseUrl()}/nodes/?page=1&size=1000`);
        if (nodesResponse.ok) {
            const nodes = await nodesResponse.json();

            // Update nodes count
            if (nodesCountElement) {
                nodesCountElement.textContent = nodes.length.toLocaleString();
            }

            // Calculate resource totals
            let totalCru = 0;
            let totalMru = 0;
            let totalSru = 0;
            let totalHru = 0;

            nodes.forEach(node => {
                if (node.resources) {
                    totalCru += node.resources.cru || 0;
                    totalMru += node.resources.mru || 0;
                    totalSru += node.resources.sru || 0;
                    totalHru += node.resources.hru || 0;
                }
            });

            // Update resource totals
            if (totalCruElement) totalCruElement.textContent = totalCru.toLocaleString();
            if (totalMruElement) totalMruElement.textContent = formatBytes(totalMru);
            if (totalSruElement) totalSruElement.textContent = formatBytes(totalSru);
            if (totalHruElement) totalHruElement.textContent = formatBytes(totalHru);
        } else {
            if (nodesCountElement) nodesCountElement.textContent = 'Error';
            if (totalCruElement) totalCruElement.textContent = 'Error';
            if (totalMruElement) totalMruElement.textContent = 'Error';
            if (totalSruElement) totalSruElement.textContent = 'Error';
            if (totalHruElement) totalHruElement.textContent = 'Error';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        if (farmsCountElement) farmsCountElement.textContent = 'Error';
        if (nodesCountElement) nodesCountElement.textContent = 'Error';
        if (totalCruElement) totalCruElement.textContent = 'Error';
        if (totalMruElement) totalMruElement.textContent = 'Error';
        if (totalSruElement) totalSruElement.textContent = 'Error';
        if (totalHruElement) totalHruElement.textContent = 'Error';
    }
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
