// Node Details page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const nodeDetailsContainer = document.getElementById('node-details');
    const nodeResourcesContainer = document.getElementById('node-resources');
    const nodeInterfacesContainer = document.getElementById('node-interfaces');
    
    // Get node ID from URL
    const nodeId = getQueryParam('id');
    
    // Load node details if we have an ID
    if (nodeId) {
        loadNodeDetails(nodeId);
    } else {
        nodeDetailsContainer.innerHTML = '<div class="error">No node ID provided</div>';
        nodeResourcesContainer.innerHTML = '<div class="error">No node ID provided</div>';
        nodeInterfacesContainer.innerHTML = '<div class="error">No node ID provided</div>';
    }
    
    // Functions
    async function loadNodeDetails(id) {
        // Show loading state
        nodeDetailsContainer.innerHTML = '<div class="loading">Loading node details...</div>';
        nodeResourcesContainer.innerHTML = '<div class="loading">Loading resources...</div>';
        nodeInterfacesContainer.innerHTML = '<div class="loading">Loading interfaces...</div>';
        
        // Fetch node details from API
        const node = await apiService.nodes.getById(id);
        
        // Handle error
        if (node.error) {
            nodeDetailsContainer.innerHTML = `<div class="error">Error: ${node.error}</div>`;
            nodeResourcesContainer.innerHTML = `<div class="error">Error: ${node.error}</div>`;
            nodeInterfacesContainer.innerHTML = `<div class="error">Error: ${node.error}</div>`;
            return;
        }
        
        // Render node details
        renderNodeDetails(node);
        renderNodeResources(node.resources);
        renderNodeInterfaces(node.interfaces);
    }
    
    function renderNodeDetails(node) {
        // Update page title
        document.title = `Node ${node.node_id} - Grid4 Dashboard`;
        
        // Determine node status
        const isHealthy = node.online === true;
        const statusClass = isHealthy ? 'status-up' : 'status-down';
        const statusText = isHealthy ? 'Up' : 'Down';
        
        // Get location info
        const location = node.location || {};
        const locationText = location.country && location.city 
            ? `${location.city}, ${location.country}` 
            : 'Location unknown';
        
        // Create details HTML
        const detailsHTML = `
            <div class="detail-row">
                <div class="detail-label">Node ID</div>
                <div class="detail-value">${node.node_id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status ${statusClass}">${statusText}</span></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Farm ID</div>
                <div class="detail-value"><a href="farm-details.html?id=${node.farm_id}">${node.farm_id}</a></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Twin ID</div>
                <div class="detail-value">${node.twin_id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Location</div>
                <div class="detail-value">${locationText}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Coordinates</div>
                <div class="detail-value">
                    ${location.latitude && location.longitude ? 
                        `${location.latitude}, ${location.longitude}` : 
                        'N/A'}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Serial Number</div>
                <div class="detail-value">${node.serial_number || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Secure Boot</div>
                <div class="detail-value">${node.secure_boot ? 'Yes' : 'No'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Virtualized</div>
                <div class="detail-value">${node.virtualized ? 'Yes' : 'No'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Created At</div>
                <div class="detail-value">${formatDate(node.created_at)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Updated At</div>
                <div class="detail-value">${formatDate(node.updated_at)}</div>
            </div>
        `;
        
        // Update container
        nodeDetailsContainer.innerHTML = detailsHTML;
    }
    
    function renderNodeResources(resources) {
        if (!resources) {
            nodeResourcesContainer.innerHTML = '<div class="no-results">No resource information available</div>';
            return;
        }
        
        const resourcesHTML = `
            <div class="resource-grid">
                <div class="resource-item">
                    <div class="resource-value">${resources.cru || 0}</div>
                    <div class="resource-label">CPU (cores)</div>
                </div>
                <div class="resource-item">
                    <div class="resource-value">${formatBytes(resources.mru || 0)}</div>
                    <div class="resource-label">Memory (MRU)</div>
                </div>
                <div class="resource-item">
                    <div class="resource-value">${formatBytes(resources.sru || 0)}</div>
                    <div class="resource-label">SSD Storage (SRU)</div>
                </div>
                <div class="resource-item">
                    <div class="resource-value">${formatBytes(resources.hru || 0)}</div>
                    <div class="resource-label">HDD Storage (HRU)</div>
                </div>
            </div>
        `;
        
        nodeResourcesContainer.innerHTML = resourcesHTML;
    }
    
    function renderNodeInterfaces(interfaces) {
        if (!interfaces || interfaces.length === 0) {
            nodeInterfacesContainer.innerHTML = '<div class="no-results">No interface information available</div>';
            return;
        }
        
        nodeInterfacesContainer.innerHTML = '';
        
        interfaces.forEach(iface => {
            const interfaceElement = document.createElement('div');
            interfaceElement.className = 'interface-item';
            
            interfaceElement.innerHTML = `
                <h4>${iface.name || 'Unnamed Interface'}</h4>
                <p>MAC: ${iface.mac || 'N/A'}</p>
                <p>IPs: ${iface.ips || 'N/A'}</p>
            `;
            
            nodeInterfacesContainer.appendChild(interfaceElement);
        });
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
});
