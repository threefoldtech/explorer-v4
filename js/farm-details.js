// Farm Details page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const farmDetailsContainer = document.getElementById('farm-details');
    const farmNodesContainer = document.getElementById('farm-nodes');
    
    // Get farm ID from URL
    const farmId = getQueryParam('id');
    
    // Load farm details if we have an ID
    if (farmId) {
        loadFarmDetails(farmId);
        loadFarmNodes(farmId);
    } else {
        farmDetailsContainer.innerHTML = '<div class="error">No farm ID provided</div>';
        farmNodesContainer.innerHTML = '<div class="error">No farm ID provided</div>';
    }
    
    // Functions
    async function loadFarmDetails(id) {
        // Show loading state
        farmDetailsContainer.innerHTML = '<div class="loading">Loading farm details...</div>';
        
        // Fetch farm details from API
        const farm = await apiService.farms.getById(id);
        
        // Handle error
        if (farm.error) {
            farmDetailsContainer.innerHTML = `<div class="error">Error: ${farm.error}</div>`;
            return;
        }
        
        // Render farm details
        renderFarmDetails(farm);
    }
    
    function renderFarmDetails(farm) {
        // Update page title
        document.title = `${farm.farm_name || 'Farm'} (ID: ${farm.farm_id}) - Grid4 Dashboard`;
        
        // Create details HTML
        const detailsHTML = `
            <div class="detail-row">
                <div class="detail-label">Farm ID</div>
                <div class="detail-value">${farm.farm_id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Farm Name</div>
                <div class="detail-value">${farm.farm_name || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Twin ID</div>
                <div class="detail-value">${farm.twin_id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Stellar Address</div>
                <div class="detail-value">${farm.stellar_address || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Dedicated</div>
                <div class="detail-value">${farm.dedicated ? 'Yes' : 'No'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Created At</div>
                <div class="detail-value">${formatDate(farm.created_at)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Updated At</div>
                <div class="detail-value">${formatDate(farm.updated_at)}</div>
            </div>
        `;
        
        // Update container
        farmDetailsContainer.innerHTML = detailsHTML;
    }
    
    async function loadFarmNodes(farmId) {
        // Show loading state
        farmNodesContainer.innerHTML = '<div class="loading">Loading farm nodes...</div>';
        
        // Fetch nodes for this farm
        const nodes = await apiService.nodes.getByFarmId(farmId);
        
        // Handle error
        if (nodes.error) {
            farmNodesContainer.innerHTML = `<div class="error">Error: ${nodes.error}</div>`;
            return;
        }
        
        // Handle empty results
        if (!nodes.length) {
            farmNodesContainer.innerHTML = '<div class="no-results">No nodes found for this farm</div>';
            return;
        }
        
        // Render nodes
        renderFarmNodes(nodes);
    }
    
    function renderFarmNodes(nodes) {
        farmNodesContainer.innerHTML = '';
        
        nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'data-item';
            
            // Determine node status
            const isHealthy = node.online===true;
            const statusClass = isHealthy ? 'status-up' : 'status-down';
            const statusText = isHealthy ? 'Up' : 'Down';
            
            nodeElement.innerHTML = `
                <h3>
                    <a href="node-details.html?id=${node.node_id}">
                        Node ${node.node_id}
                    </a>
                    <span class="status ${statusClass}">${statusText}</span>
                </h3>
                <p>Twin ID: ${node.twin_id}</p>
                <p>Resources: ${node.resources ? `CRU: ${node.resources.cru}, MRU: ${node.resources.mru}, SRU: ${node.resources.sru}, HRU: ${node.resources.hru}` : 'N/A'}</p>
                <a href="node-details.html?id=${node.node_id}" class="btn-small">View Details</a>
            `;
            
            farmNodesContainer.appendChild(nodeElement);
        });
    }
});
