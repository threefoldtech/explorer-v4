// Farms page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const farmsList = document.getElementById('farms-list');
    const farmsCount = document.getElementById('farms-count');
    const farmSearch = document.getElementById('farm-search');
    const farmIdSearch = document.getElementById('farm-id-search');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const pageSizeSelect = document.getElementById('page-size-select');
    const tableHeaders = document.querySelectorAll('#farms-table th.sortable');

    // State
    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);
    let filters = {};
    let sortField = 'farm_id';
    let sortDirection = 'asc';

    // Initialize sorting indicators
    initSortingHeaders();

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

    pageSizeSelect.addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        loadFarms();
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
            loadFarms();
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

    async function loadFarms() {
        // Show loading state
        farmsList.innerHTML = '<tr><td colspan="6" class="loading">Loading farms...</td></tr>';

        // Update page info
        pageInfo.textContent = `Page ${currentPage}`;

        // Disable previous button if on first page
        prevPageBtn.disabled = currentPage === 1;

        // Fetch farms from API
        const farms = await apiService.farms.getList(currentPage, pageSize, filters);

        // Handle error
        if (farms.error) {
            farmsList.innerHTML = `<tr><td colspan="6" class="error">Error: ${farms.error}</td></tr>`;
            farmsCount.textContent = '0';
            return;
        }

        // Handle empty results
        if (!farms.length) {
            farmsList.innerHTML = '<tr><td colspan="6" class="no-results">No farms found</td></tr>';
            nextPageBtn.disabled = true;
            farmsCount.textContent = '0';
            return;
        }

        // Update farms count
        farmsCount.textContent = farms.length;

        // Enable next button if we have results
        nextPageBtn.disabled = farms.length < pageSize;

        // Sort farms if needed
        if (sortField) {
            farms.sort((a, b) => {
                let valueA = a[sortField] || '';
                let valueB = b[sortField] || '';

                // Handle string vs number comparison
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                // Handle dates
                if (sortField === 'created_at' || sortField === 'updated_at') {
                    valueA = new Date(valueA).getTime();
                    valueB = new Date(valueB).getTime();
                }

                if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Render farms
        renderFarms(farms);
    }

    function renderFarms(farms) {
        farmsList.innerHTML = '';

        farms.forEach(farm => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${farm.farm_id}</td>
                <td>
                    <a href="farm-details.html?id=${farm.farm_id}">
                        ${farm.farm_name || 'Unnamed Farm'}
                    </a>
                </td>
                <td>${farm.twin_id}</td>
                <td>${formatDate(farm.created_at)}</td>
                <td>${formatDate(farm.updated_at)}</td>
                <td>
                    <div class="action-buttons">
                        <a href="farm-details.html?id=${farm.farm_id}" class="btn-small">View</a>
                    </div>
                </td>
            `;
            farmsList.appendChild(row);
        });
    }
});
