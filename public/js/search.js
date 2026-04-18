// Search page functionality
$(document).ready(function() {
    let cars = [];
    let filteredCars = [];
    
    // Fetch all cars on page load
    fetchCars();
    
    // Event listener for search input
    $('#search-input').on('input', function() {
        const query = $(this).val().trim().toLowerCase();
        
        if (query.length > 0) {
            // Generate and display suggestions
            generateSuggestions(query);
            $('#search-suggestions').show();
        } else {
            $('#search-suggestions').hide();
        }
    });
    
    // Event listener for search button
    $('#search-button').on('click', function() {
        performSearch();
    });
    
    // Event listener for Enter key in search input
    $('#search-input').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            performSearch();
        }
    });
    
    // Event listeners for filters
    $('#car-type, #car-brand').on('change', function() {
        applyFilters();
    });
    
    // Close suggestions when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-box').length) {
            $('#search-suggestions').hide();
        }
    });
    
    // Fetch all cars from API
    function fetchCars() {
        $.ajax({
            url: '/api/cars',
            method: 'GET',
            success: function(data) {
                cars = data;
                filteredCars = [...cars];
                renderCars(filteredCars);
                populateFilters();
            },
            error: function(error) {
                console.error('Error fetching cars:', error);
            }
        });
    }
    
    // Populate filter dropdowns
    function populateFilters() {
        // Get unique car types
        const carTypes = [...new Set(cars.map(car => car.carType))];
        carTypes.forEach(type => {
            $('#car-type').append(`<option value="${type}">${type}</option>`);
        });
        
        // Get unique car brands
        const carBrands = [...new Set(cars.map(car => car.brand))];
        carBrands.forEach(brand => {
            $('#car-brand').append(`<option value="${brand}">${brand}</option>`);
        });
    }
    
    // Generate search suggestions
    function generateSuggestions(query) {
        const suggestionsContainer = $('#search-suggestions');
        suggestionsContainer.empty();
        
        // Get unique values for suggestions
        const types = [...new Set(cars.map(car => car.carType.toLowerCase()))];
        const brands = [...new Set(cars.map(car => car.brand.toLowerCase()))];
        const models = [...new Set(cars.map(car => car.carModel.toLowerCase()))];
        
        // Find matches in car type, brand, model, and description
        const typeMatches = types.filter(type => type.includes(query));
        const brandMatches = brands.filter(brand => brand.includes(query));
        const modelMatches = models.filter(model => model.includes(query));
        
        // Create suggestions list
        const allMatches = [...typeMatches, ...brandMatches, ...modelMatches];
        const uniqueMatches = [...new Set(allMatches)];
        
        uniqueMatches.slice(0, 5).forEach(match => {
            const suggestion = $(`<div class="suggestion-item">${match}</div>`);
            suggestionsContainer.append(suggestion);
        });
        
        // Event listener for suggestion items
        $('.suggestion-item').on('click', function() {
            const selectedValue = $(this).text();
            $('#search-input').val(selectedValue);
            $('#search-suggestions').hide();
            performSearch();
        });
    }
    
    // Perform search based on input and filters
    function performSearch() {
        const query = $('#search-input').val().trim().toLowerCase();
        const typeFilter = $('#car-type').val();
        const brandFilter = $('#car-brand').val();
        
        // Filter cars based on search query
        filteredCars = cars.filter(car => {
            const matchesQuery = query === '' || 
                car.carType.toLowerCase().includes(query) ||
                car.brand.toLowerCase().includes(query) ||
                car.carModel.toLowerCase().includes(query) ||
                car.description.toLowerCase().includes(query);
                
            const matchesType = typeFilter === '' || car.carType === typeFilter;
            const matchesBrand = brandFilter === '' || car.brand === brandFilter;
            
            return matchesQuery && matchesType && matchesBrand;
        });
        
        renderCars(filteredCars);
    }
    
    // Apply filters without search query
    function applyFilters() {
        const typeFilter = $('#car-type').val();
        const brandFilter = $('#car-brand').val();
        
        // If both filters are empty, show all cars
        if (typeFilter === '' && brandFilter === '' && $('#search-input').val().trim() === '') {
            filteredCars = [...cars];
            renderCars(filteredCars);
            return;
        }
        
        performSearch();
    }
    
    // Render cars in grid
    function renderCars(carsToRender) {
        const carsContainer = $('#cars-container');
        carsContainer.empty();
        
        if (carsToRender.length === 0) {
            carsContainer.html('<p class="no-results">No cars found matching your criteria.</p>');
            return;
        }
        
        carsToRender.forEach(car => {
            const carCard = $(`
                <div class="car-card">
                    <div class="car-image">
                        <img src="${car.image}" alt="${car.brand} ${car.carModel}">
                    </div>
                    <div class="car-info">
                        <div class="car-title">${car.brand} ${car.carModel}</div>
                        <div class="car-details">
                            <p>Type: ${car.carType}</p>
                            <p>Year: ${car.yearOfManufacture}</p>
                            <p>Mileage: ${car.mileage}</p>
                            <p>Fuel: ${car.fuelType}</p>
                        </div>
                        <div class="car-price">$${car.pricePerDay} per day</div>
                        <div class="car-availability">
                            Status: <span class="${car.available ? 'available' : 'unavailable'}">${car.available ? 'Available' : 'Not Available'}</span>
                        </div>
                        <button class="rent-button" data-vin="${car.vin}" ${!car.available ? 'disabled' : ''}>
                            Rent Now
                        </button>
                    </div>
                </div>
            `);
            
            carsContainer.append(carCard);
        });
        
        // Add event listener to rent buttons
        $('.rent-button').on('click', function() {
            const vin = $(this).data('vin');
            // Store the selected car in localStorage
            saveToLocalStorage('selectedCarVin', vin);
            // Redirect to reservation page
            window.location.href = '/reservation';
        });
    }
});