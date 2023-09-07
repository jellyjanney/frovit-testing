function loadBookingsFromJsonFile() {
        return fetch('booking-data.json')
        .then(response => {
                if (!response.ok) {
                        throw new Error('Failed to load booking data');
                }
                return response.json();
        });
}

function isRoomAvailable(bookings, room, startTime, endTime) {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Convert input strings to Date objects
        const requestedStartTime = new Date(startTime);
        const requestedEndTime = new Date(endTime);

        // Filter bookings for the requested room
        const roomBookings = bookings.filter(booking => booking.roomId === room);

        // Check if there are any conflicting bookings
        for (const booking of roomBookings) {
                const bookingStartTime = new Date(booking.startTime);
                const bookingEndTime = new Date(booking.endTime);

                if (
                        (requestedStartTime >= bookingStartTime && requestedStartTime < bookingEndTime) ||
                        (requestedEndTime > bookingStartTime && requestedEndTime <= bookingEndTime) ||
                        (requestedStartTime <= bookingStartTime && requestedEndTime >= bookingEndTime) ||
                        (
                                booking.roomId === room &&
                                (bookingStartTime >= today || bookingEndTime >= today) &&
                                bookingStartTime <= nextWeek
                        )
                ) {
                // There is a booking conflict
                        return false;
                }
        }

        // If no conflicts were found, the room is available
        return true;
}

function getCurrentBookings(bookings, room) {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        return bookings.filter(booking => {
                const bookingStartTime = new Date(booking.startTime);
                const bookingEndTime = new Date(booking.endTime);

                // Check if the booking is for the requested room
                // and falls within the specified time frames
                return (
                        booking.roomId === room &&
                        (bookingStartTime >= today || bookingEndTime >= today) &&
                        bookingStartTime <= nextWeek
                );
        });
}

function checkAvailability() {
        const room = document.getElementById('room').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        const isAvailable = isRoomAvailable(bookings, room, startTime, endTime);
        const currentBookings = getCurrentBookings(bookings, room);
        const resultContainer = document.getElementById('currentBookingsContainer');

        // Clear previous results
        resultContainer.innerHTML = '';

        const roomId = document.getElementById('roomId');
        const Label = document.getElementById('meta-label');

        // Check Available
        roomId.textContent = `${room}`;
        Label.textContent = `${isAvailable ? 'Available' : 'Unavailable'}`;

        
        // resultCard.appendChild(resultText);
        // resultContainer.appendChild(resultCard);
        // resultCard.appendChild(resultBook);
}

loadBookingsFromJsonFile().then(jsonData => {
        bookings = jsonData;
})
.catch(error => {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง:', error);
});