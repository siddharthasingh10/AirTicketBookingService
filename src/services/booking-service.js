const axios = require('axios');
const { BookingRepository } = require('./../repository/index');
const { FLIGHT_SERVICE_PATH } = require('./../config/server-config');
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor() {
        // Initialize the booking repository to handle booking-related database operations
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            // Extract flightId and number of seats from the incoming booking request data
            const flightId = data.flightId;

            // Construct the URL to fetch flight details from the flight microservice
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            // Fetch flight details using Axios
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data; // Extract flight data from the response
            
            // Get the price of the flight
            let priceOfTheFlight = flightData.price;

            // Check if the requested number of seats is greater than the available seats
            if (flightData.totalSeats < data.noOfSeats) {
                throw new ServiceError('Insufficient Seats', 'Something went wrong in the booking process');
            }

            // Calculate the total cost of booking based on the number of seats
            const totalCost = flightData.price * data.noOfSeats;
            const bookingPayLoad = { ...data, totalCost }; // Prepare the payload for booking

            // Create the booking record in the database
            const booking = await this.bookingRepository.create(bookingPayLoad);

            // Calculate the remaining available seats in the flight
            const availableSeatsInFlight = flightData.totalSeats - data.noOfSeats;
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            // Update the flight's available seats using a PATCH request
            await axios.patch(updateFlightRequestURL, { totalSeats: availableSeatsInFlight });

            // Update the booking status to "BOOKED" after a successful booking
            const finalBooking = await this.bookingRepository.update(booking.id, { status: "BOOKED" });

            // Return the final booking details
            return finalBooking;

        } catch (error) {
            console.log('Error in service layer:', error);

            // Re-throw known repository and validation errors
            if (error.name === 'RepositoryError' || error.name === 'ValidationError') {
                throw error; 
            }

            // Handle Axios or other HTTP request errors
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.response?.data || error.message);
            }

            // Throw a generic service error for unexpected issues
            throw new ServiceError('Service Error', 'An unexpected error occurred during the booking process.');
        }
    }
}

module.exports = BookingService;
