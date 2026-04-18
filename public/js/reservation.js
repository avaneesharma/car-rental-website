// Reservation page functionality
$(document).ready(function() {
    let selectedCar = null;
    let formValidated = false;
    
    // Set minimum date for start date to today
    setMinDateToToday();
    
    // Get selected car from localStorage
    const selectedCarVin = getFromLocalStorage('selectedCarVin');
    
    if (selectedCarVin) {
        // Fetch car details
        fetchCarDetails(selectedCarVin);
    } else {
        // Show message if no car is selected
        $('#no-car-message').show();
    }
    
    // Load saved form data if exists
    loadSavedFormData();
    
    // Form validation on input
    $('#reservation-form input').on('input', function() {
        validateForm();
        updateTotalPrice();
    });
    
    // Submit button event
    $('#submit-btn').on('click', function() {
        if (formValidated) {
            submitReservation();
        }
    });
    
    // Cancel button event
    $('#cancel-btn').on('click', function() {
        clearForm();
        window.location.href = '/';
    });
    
    // Save form data when leaving page
    $(window).on('beforeunload', function() {
        saveFormData();
    });
    
    // Fetch car details by VIN
    function fetchCarDetails(vin) {
        $.ajax({
            url: `/api/cars/${vin}`,
            method: 'GET',
            success: function(car) {
                selectedCar = car;
                
                if (car) {
                    renderCarDetails(car);
                    
                    if (car.available) {
                        $('#reservation-form-container').show();
                    } else {
                        $('#unavailable-message').show();
                    }
                } else {
                    $('#no-car-message').show();
                }
            },
            error: function(error) {
                console.error('Error fetching car details:', error);
                $('#no-car-message').show();
            }
        });
    }
    
    // Render car details
    function renderCarDetails(car) {
        const carDetailsHtml = `
            <div class="car-details-header">
                <div class="car-details-image">
                    <img src="${car.image}" alt="${car.brand} ${car.carModel}">
                </div>
                <div class="car-details-info">
                    <div class="car-details-title">${car.brand} ${car.carModel}</div>
                    <div class="car-details-price">$${car.pricePerDay} per day</div>
                    <div class="car-details-specs">
                        <p>Type: ${car.carType}</p>
                        <p>Year: ${car.yearOfManufacture}</p>
                        <p>Mileage: ${car.mileage}</p>
                        <p>Fuel: ${car.fuelType}</p>
                        <p>Availability: <span class="${car.available ? 'available' : 'unavailable'}">${car.available ? 'Available' : 'Not Available'}</span></p>
                    </div>
                </div>
            </div>
            <div class="car-details-description">
                <h3>Description</h3>
                <p>${car.description}</p>
            </div>
        `;
        
        $('#car-details').html(carDetailsHtml);
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Validate name (non-empty)
        const name = $('#customer-name').val().trim();
        if (name === '') {
            $('#name-validation').text('Name is required');
            isValid = false;
        } else {
            $('#name-validation').text('');
        }
        
        // Validate phone (format: +1234567890)
        const phone = $('#phone-number').val().trim();
        const phoneRegex = /^\+?\d{10,15}$/;
        if (phone === '') {
            $('#phone-validation').text('Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            $('#phone-validation').text('Please enter a valid phone number');
            isValid = false;
        } else {
            $('#phone-validation').text('');
        }
        
        // Validate email
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            $('#email-validation').text('Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#email-validation').text('Please enter a valid email address');
            isValid = false;
        } else {
            $('#email-validation').text('');
        }
        
        // Validate license number (non-empty)
        const license = $('#license-number').val().trim();
        if (license === '') {
            $('#license-validation').text('Driver\'s license number is required');
            isValid = false;
        } else {
            $('#license-validation').text('');
        }
        
        // Validate start date (must be today or future)
        const startDate = new Date($('#start-date').val());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!$('#start-date').val()) {
            $('#date-validation').text('Start date is required');
            isValid = false;
        } else if (startDate < today) {
            $('#date-validation').text('Start date must be today or later');
            isValid = false;
        } else {
            $('#date-validation').text('');
        }
        
        // Validate rental period (must be positive)
        const period = $('#rental-period').val();
        if (period === '') {
            $('#period-validation').text('Rental period is required');
            isValid = false;
        } else if (parseInt(period) < 1) {
            $('#period-validation').text('Rental period must be at least 1 day');
            isValid = false;
        } else {
            $('#period-validation').text('');
        }
        
        // Update form validation status
        formValidated = isValid;
        
        // Enable/disable submit button
        $('#submit-btn').prop('disabled', !isValid);
        
        return isValid;
    }
    
    // Update total price based on inputs
    function updateTotalPrice() {
        if (selectedCar && $('#rental-period').val()) {
            const days = parseInt($('#rental-period').val());
            const totalPrice = selectedCar.pricePerDay * days;
            $('#price-value').text(`$${totalPrice}`);
        } else {
            $('#price-value').text('$0');
        }
    }
    
    // Submit reservation
    // Add this to reservation.js after the submitReservation function

function submitReservation() {
    const formData = {
        customer: {
            name: $('#customer-name').val(),
            phoneNumber: $('#phone-number').val(),
            email: $('#email').val(),
            driversLicenseNumber: $('#license-number').val()
        },
        car: {
            vin: selectedCar.vin
        },
        rental: {
            startDate: $('#start-date').val(),
            rentalPeriod: parseInt($('#rental-period').val()),
            totalPrice: parseFloat($('#total-price').text().replace('Total Price: $', ''))
        }
    };

    $.ajax({
        url: '/api/orders',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            // Hide the reservation form
            $('#reservation-form-container').hide();
            
            // Show confirmation message with order details
            showOrderConfirmation(response.order);
        },
        error: function(error) {
            console.error('Error creating order:', error);
            if (error.responseJSON && error.responseJSON.error) {
                alert('Error: ' + error.responseJSON.error);
            } else {
                alert('Error creating order. Please try again.');
            }
        }
    });
}

function showOrderConfirmation(order) {
    const confirmationHtml = `
        <div class="confirmation-message">
            <h2>Order Placed Successfully!</h2>
            <p>Your rental order has been created and is pending confirmation.</p>
            <div class="order-details">
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Car:</strong> ${selectedCar.brand} ${selectedCar.carModel}</p>
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Start Date:</strong> ${order.rental.startDate}</p>
                <p><strong>Rental Period:</strong> ${order.rental.rentalPeriod} days</p>
                <p><strong>Total Price:</strong> $${order.rental.totalPrice}</p>
                <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            </div>
            <p><strong>Please confirm your order to complete the reservation:</strong></p>
            <div class="confirmation-buttons">
                <button id="confirm-order-btn" class="button">Confirm Order</button>
                <button id="cancel-order-btn" class="button cancel">Cancel Order</button>
            </div>
        </div>
    `;
    
    // Insert confirmation message after car details
    $('.car-details-description').after(confirmationHtml);
    
    // Add event listeners for confirmation buttons
    $('#confirm-order-btn').on('click', function() {
        confirmOrder(order.id);
    });
    
    $('#cancel-order-btn').on('click', function() {
        cancelOrder();
    });
}

function confirmOrder(orderId) {
    $.ajax({
        url: `/api/orders/${orderId}/confirm`,
        method: 'POST',
        success: function(response) {
            // Hide confirmation message
            $('.confirmation-message').hide();
            
            // Show success message
            showSuccessMessage(response.order);
            
            // Clear saved form data
            clearFromLocalStorage('reservationFormData');
        },
        error: function(error) {
            console.error('Error confirming order:', error);
            if (error.responseJSON && error.responseJSON.error) {
                alert('Error: ' + error.responseJSON.error);
                if (error.responseJSON.error.includes('no longer available')) {
                    // Refresh the page to show updated car status
                    location.reload();
                }
            } else {
                alert('Error confirming order. Please try again.');
            }
        }
    });
}

function showSuccessMessage(order) {
    const successHtml = `
        <div class="success-message">
            <h2>Order Confirmed Successfully!</h2>
            <p>Your rental reservation has been confirmed.</p>
            <div class="order-details">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
                <p>You will receive a confirmation email shortly.</p>
            </div>
            <a href="/" class="button">Browse More Cars</a>
        </div>
    `;
    
    $('.car-details-description').after(successHtml);
}

function cancelOrder() {
    // Hide confirmation message
    $('.confirmation-message').hide();
    
    // Show the reservation form again
    $('#reservation-form-container').show();
    
    // Optionally clear the form
    clearForm();
}

    
    // Save form data to localStorage
    function saveFormData() {
        const formData = {
            name: $('#customer-name').val().trim(),
            phone: $('#phone-number').val().trim(),
            email: $('#email').val().trim(),
            license: $('#license-number').val().trim(),
            startDate: $('#start-date').val(),
            rentalPeriod: $('#rental-period').val()
        };
        
        saveToLocalStorage('savedFormData', formData);
    }
    
    // Load saved form data from localStorage
    function loadSavedFormData() {
        const savedFormData = getFromLocalStorage('savedFormData');
        
        if (savedFormData) {
            $('#customer-name').val(savedFormData.name || '');
            $('#phone-number').val(savedFormData.phone || '');
            $('#email').val(savedFormData.email || '');
            $('#license-number').val(savedFormData.license || '');
            $('#start-date').val(savedFormData.startDate || '');
            $('#rental-period').val(savedFormData.rentalPeriod || '');
            
            // Validate form and update price
            setTimeout(function() {
                validateForm();
                updateTotalPrice();
            }, 100);
        }
    }
    
   function clearForm() {
    $('#reservation-form')[0].reset();
    $('.validation-message').text('');
    $('#price-value').text('$0');
    formValidated = false;
    $('#submit-btn').prop('disabled', true);
    
    // CRITICAL: Clear saved form data from localStorage
    clearFromLocalStorage('reservationFormData');
    clearFromLocalStorage('selectedCarVin');
    }

});