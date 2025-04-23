// Farms page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const farmsList = document.getElementById('farms-list');
    const farmSearch = document.getElementById('farm-search');
    const farmIdSearch = document.getElementById('farm-id-search');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    // State
    let currentPage = 1;
    let pageSize = 10;
    let filters = {};
    
    // Load farms on page load
    loadFarms();
    
    // Event listeners
    searchBtn.addEventListener('click', function() {
        filters = {};
        
        if (farmSearch.value.trim()) {
            filters.farm_name = farmSearch.value.trim();
        }
        
        if (farmIdSearch.value.trim()) {
            filters.farm_id = farmIdSearch.value.trim();
        }
        
        currentPage = 1;
        loadFarms();
    });
    
    clearBtn.addEventListener('click', function() {
        farmSearch.value = '';
        farmIdSearch.value = '';
        filters = {};
        currentPage = 1;
        loadFarms();
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadFarms();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        currentPage++;
        loadFarms();
    });
    
    // Functions
    async function loadFarms() {
        // Show loading state
        farmsList.innerHTML = '<div class="loading">Loading farms...</div>';
        
        // Update page info
        pageInfo.textContent = `Page ${currentPage}`;
        
        // Disable previous button if on first page
        prevPageBtn.disabled = currentPage === 1;
        
        // Fetch farms from API
        const farms = await apiService.farms.getList(currentPage, pageSize, filters);
        
        // Handle error
        if (farms.error) {
            farmsList.innerHTML = `<div class="error">Error: ${farms.error}</div>`;
            return;
        }
        
        // Handle empty results
        if (!farms.length) {
            farmsList.innerHTML = '<div class="no-results">No farms found</div>';
            nextPageBtn.disabled = true;
            return;
        }
        
        // Enable next button if we have results
        nextPageBtn.disabled = farms.length < pageSize;
        
        // Render farms
        renderFarms(farms);
    }
    
    function renderFarms(farms) {
        farmsList.innerHTML = '';
        
        farms.forEach(farm => {
            const farmElement = document.createElement('div');
            farmElement.className = 'data-item';
            farmElement.innerHTML = `
                <h3>
                    <a href="farm-details.html?id=${farm.farm_id}">
                        ${farm.farm_name || 'Unnamed Farm'} (ID: ${farm.farm_id})
                    </a>
                </h3>
                <p>Twin ID: ${farm.twin_id}</p>
                <p>Created: ${formatDate(farm.created_at)}</p>
                <p>Updated: ${formatDate(farm.updated_at)}</p>
                <a href="farm-details.html?id=${farm.farm_id}" class="btn-small">View Details</a>
            `;
            farmsList.appendChild(farmElement);
        });
    }
});
