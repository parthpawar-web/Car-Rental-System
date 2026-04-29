async function loadCarsPreview() {
    const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
        ? 'http://localhost:4000/api' 
        : 'https://car-rental-api.onrender.com/api';

    try {
        const res = await fetch(`${API_URL}/cars`);
        const data = await res.json();
        const container = document.getElementById('carsList');
        
        if (!container) return;
        
        if (!data.Data || data.Data.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b; border: 2px dashed #cbd5e1; border-radius: 8px;">
                <h3>No Cars in Database</h3>
                <p>Open Postman and send a POST request to <b>/api/cars</b> to add your first vehicle.</p>
            </div>`;
            return;
        }

        container.innerHTML = data.Data.map(car => {
            const imageSrc = car.image 
                ? (car.image.startsWith('http') ? car.image : `${API_URL.replace('/api', '')}/${car.image}`) 
                : 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400';

            return `
                <div class="car-card">
                    <img src="${imageSrc}" alt="${car.carName}" onerror="this.src='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'">
                    <div class="car-title">${car.brand} ${car.carName}</div>
                    <div class="car-details">
                        <span>Model: ${car.model}</span>
                        <span>${car.transmission}</span>
                    </div>
                    <div class="car-details">
                        <span>${car.fuelType}</span>
                        <span>${car.seats} Seats</span>
                    </div>
                    <div class="car-price">₹${car.pricePerDay.toLocaleString('en-IN')} / day</div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        const container = document.getElementById('carsList');
        if (container) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: red;">Failed to connect to backend backend API at localhost:4000</div>`;
        }
    }
}

// Ensure the fetch runs automatically if we are on the preview page
if (window.location.pathname.includes('cars.html')) {
    document.addEventListener('DOMContentLoaded', loadCarsPreview);
}
