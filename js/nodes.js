// Nodes page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const nodesList = document.getElementById('nodes-list');
    const nodeIdSearch = document.getElementById('node-id-search');
    const farmIdSearch = document.getElementById('farm-id-search');
    const statusFilter = document.getElementById('status-filter');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    // State
    let currentPage = 1;
    let pageSize = 10;
    let filters = {};
    
    // Load nodes on page load
    loadNodes();
    
    // Event listeners
    searchBtn.addEventListener('click', function() {
        filters = {};
        
        if (nodeIdSearch.value.trim()) {
            filters.node_id = nodeIdSearch.value.trim();
        }
        
        if (farmIdSearch.value.trim()) {
            filters.farm_id = farmIdSearch.value.trim();
        }
        
        if (statusFilter.value) {
            filters.status = statusFilter.value;
        }
        
        currentPage = 1;
        loadNodes();
    });
    
    clearBtn.addEventListener('click', function() {
        nodeIdSearch.value = '';
        farmIdSearch.value = '';
        statusFilter.value = '';
        filters = {};
        currentPage = 1;
        loadNodes();
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadNodes();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        currentPage++;
        loadNodes();
    });
    
    // Functions
    async function loadNodes() {
        // Show loading state
        nodesList.innerHTML = '<div class="loading">Loading nodes...</div>';
        
        // Update page info
        pageInfo.textContent = `Page ${currentPage}`;
        
        // Disable previous button if on first page
        prevPageBtn.disabled = currentPage === 1;
        
        // Fetch nodes from API
        const nodes = await apiService.nodes.getList(currentPage, pageSize, filters);
        
        // Handle error
        if (nodes.error) {
            nodesList.innerHTML = `<div class="error">Error: ${nodes.error}</div>`;
            return;
        }
        
        // Handle empty results
        if (!nodes.length) {
            nodesList.innerHTML = '<div class="no-results">No nodes found</div>';
            nextPageBtn.disabled = true;
            return;
        }
        
        // Enable next button if we have results
        nextPageBtn.disabled = nodes.length < pageSize;
        
        // Render nodes
        renderNodes(nodes);
    }
    
    function renderNodes(nodes) {
        nodesList.innerHTML = '';
        
        nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'data-item';
            
            // Determine node status
            const isHealthy = node.uptime && node.uptime.length > 0;
            const statusClass = isHealthy ? 'status-up' : 'status-down';
            const statusText = isHealthy ? 'Up' : 'Down';
            
            // Get location info
            const location = node.location || {};
            const locationText = location.country && location.city 
                ? `${location.city}, ${location.country}` 
                : 'Location unknown';
            
            nodeElement.innerHTML = `
                <h3>
                    <a href="node-details.html?id=${node.node_id}">
                        Node ${node.node_id}
                    </a>
                    <span class="status ${statusClass}">${statusText}</span>
                </h3>
                <p>Farm ID: ${node.farm_id}</p>
                <p>Twin ID: ${node.twin_id}</p>
                <p>Location: ${locationText}</p>
                <p>Resources: ${node.resources ? `CRU: ${node.resources.cru}, MRU: ${node.resources.mru}, SRU: ${node.resources.sru}, HRU: ${node.resources.hru}` : 'N/A'}</p>
                <a href="node-details.html?id=${node.node_id}" class="btn-small">View Details</a>
            `;
            
            nodesList.appendChild(nodeElement);
        });
    }
});
