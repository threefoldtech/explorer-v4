// Nodes page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const nodesList = document.getElementById('nodes-list');
    const nodesCount = document.getElementById('nodes-count');
    const nodeIdSearch = document.getElementById('node-id-search');
    const farmIdSearch = document.getElementById('farm-id-search');
    const statusFilter = document.getElementById('status-filter');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const pageSizeSelect = document.getElementById('nodes-page-size-select');
    const tableHeaders = document.querySelectorAll('#nodes-table th.sortable');

    // State
    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);
    let filters = {};
    let sortField = 'node_id';
    let sortDirection = 'asc';

    // Initialize sorting indicators
    initSortingHeaders();

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

    pageSizeSelect.addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        loadNodes();
    });

    // Add event listeners to sortable headers
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-sort');

            // If clicking the same header, toggle direction
            if (field === sortField) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortField = field;
                sortDirection = 'asc';
            }

            // Update sorting indicators
            updateSortingHeaders();

            // Reset to first page and reload
            currentPage = 1;
            loadNodes();
        });
    });

    // Functions
    function initSortingHeaders() {
        tableHeaders.forEach(header => {
            const field = header.getAttribute('data-sort');
            if (field === sortField) {
                header.classList.add(`sort-${sortDirection}`);
            }
        });
    }

    function updateSortingHeaders() {
        tableHeaders.forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            const field = header.getAttribute('data-sort');
            if (field === sortField) {
                header.classList.add(`sort-${sortDirection}`);
            }
        });
    }

    async function loadNodes() {
        // Show loading state
        nodesList.innerHTML = '<tr><td colspan="7" class="loading">Loading nodes...</td></tr>';

        // Update page info
        pageInfo.textContent = `Page ${currentPage}`;

        // Disable previous button if on first page
        prevPageBtn.disabled = currentPage === 1;

        // Fetch nodes from API
        const nodes = await apiService.nodes.getList(currentPage, pageSize, filters);

        // Handle error
        if (nodes.error) {
            nodesList.innerHTML = `<tr><td colspan="7" class="error">Error: ${nodes.error}</td></tr>`;
            nodesCount.textContent = '0';
            return;
        }

        // Handle empty results
        if (!nodes.length) {
            nodesList.innerHTML = '<tr><td colspan="7" class="no-results">No nodes found</td></tr>';
            nextPageBtn.disabled = true;
            nodesCount.textContent = '0';
            return;
        }

        // Update nodes count
        nodesCount.textContent = nodes.length;

        // Enable next button if we have results
        nextPageBtn.disabled = nodes.length < pageSize;

        // Sort nodes if needed
        if (sortField) {
            nodes.sort((a, b) => {
                let valueA = a[sortField] || '';
                let valueB = b[sortField] || '';

                // Handle string vs number comparison
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                // Handle dates
                if (sortField === 'created_at') {
                    valueA = new Date(valueA).getTime();
                    valueB = new Date(valueB).getTime();
                }

                if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Render nodes
        renderNodes(nodes);
    }

    function renderNodes(nodes) {
        nodesList.innerHTML = '';

        nodes.forEach(node => {
            // Determine node status
            const isHealthy = node.online === true;
            console.log(isHealthy, node.id);
            const statusClass = isHealthy ? 'status-up' : 'status-down';
            const statusText = isHealthy ? 'Up' : 'Down';

            // Get location info
            const location = node.location || {};
            const locationText = location.country && location.city
                ? `${location.city}, ${location.country}`
                : 'Location unknown';

            // Format resources
            let resourcesHtml = 'N/A';
            if (node.resources) {
                resourcesHtml = `
                    <div class="resource-pills">
                        <span class="resource-pill">CPU: ${node.resources.cru || 0}</span>
                        <span class="resource-pill">RAM: ${formatBytes(node.resources.mru || 0)}</span>
                        <span class="resource-pill">SSD: ${formatBytes(node.resources.sru || 0)}</span>
                        <span class="resource-pill">HDD: ${formatBytes(node.resources.hru || 0)}</span>
                    </div>
                `;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${node.node_id}</td>
                <td>
                    <a href="farm-details.html?id=${node.farm_id}">${node.farm_id}</a>
                </td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${locationText}</td>
                <td>${resourcesHtml}</td>
                <td>${formatDate(node.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <a href="node-details.html?id=${node.node_id}" class="btn-small">View</a>
                    </div>
                </td>
            `;
            nodesList.appendChild(row);
        });
    }

    // Helper function to format bytes
    function formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});
