document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://671a20b5acf9aa94f6a94357.mockapi.io/hotel/ht';
    const tableBody = document.getElementById('hotelTableBody');
    const addHotelForm = document.getElementById('addHotelForm');

    if (!tableBody || !addHotelForm) {
        console.error('Required DOM elements not found.');
        return;
    }

    // Fetch and display data
    function fetchData(callback) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                callback(error, null);
            });
    }

    function displayData(error, data) {
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td class="actions">
                        <button class="btn btn-warning btn-sm" onclick="editItem(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Initial data fetch
    fetchData(displayData);

    // Add new hotel
    addHotelForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('hotelName').value;
        const image = document.getElementById('hotelImage').value;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, image })
        })
        .then(response => response.json())
        .then(newHotel => {
            fetchData(displayData);
            addHotelForm.reset();
        })
        .catch(error => {
            console.error('Error adding hotel:', error);
        });
    });

    // Edit hotel
    window.editItem = function(id) {
        const name = prompt('Enter new hotel name:');
        const image = prompt('Enter new hotel image URL:');

        if (name && image) {
            fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, image })
            })
            .then(response => response.json())
            .then(updatedHotel => {
                fetchData(displayData);
            })
            .catch(error => {
                console.error('Error updating hotel:', error);
            });
        }
    };

    // Delete hotel
    window.deleteItem = function(id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchData(displayData);
        })
        .catch(error => {
            console.error('Error deleting hotel:', error);
        });
    };
});
