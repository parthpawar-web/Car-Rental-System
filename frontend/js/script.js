const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
    ? 'http://localhost:4000/api' 
    : 'https://your-backend-url.vercel.app/api';

function getToken() {
    return localStorage.getItem('token');
}

function checkAuth() {
    const token = getToken();
    if (!token && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'OWNER' || user.role === 'ADMIN') {
        const btn = document.getElementById('addCarBtn');
        if (btn) btn.style.display = 'block';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

async function fetchWithAuth(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
        throw new Error("Session expired");
    }
    return res;
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.accessToken || data.Success) {
            const token = data.accessToken || data.token;
            const userObj = data.user || { email, role: 'USER' };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userObj));
            window.location.href = 'cars.html';
        } else {
            alert(data.message || data.Message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. The server might be unreachable or sleeping.\n\nError: ' + error.message);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();
        alert(data.message || 'Registration successful');
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration.\n\nError: ' + error.message);
    }
});

let allCars = [];

async function loadCars() {
    try {
        const res = await fetch(`${API_URL}/cars`);
        const data = await res.json();
        allCars = data.Data || [];
        renderCars(allCars);
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

function renderCars(carsData) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnerOrAdmin = user.role === 'OWNER' || user.role === 'ADMIN';
    
    const carsList = document.getElementById('carsList');
    if (!carsList) return;

    if (document.getElementById('carsCount')) {
        document.getElementById('carsCount').innerText = `Showing ${carsData.length} cars`;
    }

    carsList.innerHTML = carsData.map((car, index) => `
        <div class="car-card reveal-active" style="animation-delay: ${index * 0.1}s">
            <div class="car-card-img">
                <div class="car-badge">${car.brand}</div>
                ${car.image ? `<img src="${API_URL.replace('/api', '')}/${car.image}" alt="${car.name}" onerror="this.src='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'">` : '<img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400" alt="Car">'}
            </div>
            
            <div class="car-card-body">
                <h3 class="car-card-title">${car.brand} ${car.name}</h3>
                <div class="car-card-rating">
                    <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    4.8 (128 reviews)
                </div>
                
                <div class="car-specs">
                    <div class="car-spec-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ${car.seats || 5}
                    </div>
                    <div class="car-spec-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        ${car.transmission || 'Manual'}
                    </div>
                    <div class="car-spec-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10.02 10.02 0 1 1-5.93-9.14"/></svg>
                        ${car.fuelType || 'Petrol'}
                    </div>
                </div>
                
                <div class="car-card-footer">
                    <div class="car-price-block">
                        <div class="car-price">₹${car.pricePerDay.toLocaleString('en-IN')}<span> per day</span></div>
                    </div>
                    <div>
                        <button onclick="window.location.href='booking.html?carId=${car._id}'" class="btn btn-primary">Rent Now</button>
                        ${isOwnerOrAdmin ? `<button onclick="deleteCar('${car._id}')" class="btn" style="background:#fef2f2; color:#ef4444; border:1px solid #fee2e2; margin-top:5px;">Delete</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-observe new elements
    initRevealOnScroll();
}

function showAddCarForm() {
    document.getElementById('addCarForm').style.display = 'block';
}

document.getElementById('carForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('carName').value);
    formData.append('brand', document.getElementById('carBrand').value);
    formData.append('pricePerDay', document.getElementById('carPrice').value);
    formData.append('seats', document.getElementById('carSeats').value);
    formData.append('fuelType', document.getElementById('carFuel').value);
    formData.append('transmission', document.getElementById('carTransmission').value);
    formData.append('category', document.getElementById('carCategory').value);
    const imageFile = document.getElementById('carImage').files[0];
    if (imageFile) formData.append('image', imageFile);

    const res = await fetchWithAuth(`${API_URL}/cars`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        },
        body: formData
    });

    const data = await res.json();
    alert(data.Message);
    if (data.Success) loadCars();
});

async function createBooking(e, carId) {
    e.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const res = await fetchWithAuth(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ carId, startDate, endDate })
    });

    const data = await res.json();
    alert(data.Message);
    if (data.Success) window.location.href = 'bookings.html';
}

async function loadBookings() {
    const res = await fetchWithAuth(`${API_URL}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const data = await res.json();
    const bookingsList = document.getElementById('bookingsList');
    if (!data.Data || data.Data.length === 0) {
        bookingsList.innerHTML = `
            <div style="text-align: center; padding: 5rem 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🚗</div>
                <h3 style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 0.5rem;">No trips yet</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">You haven't booked any cars. Start exploring our fleet!</p>
                <a href="cars.html" class="btn btn-primary" style="display:inline-flex; padding: 0.9rem 2.5rem; border-radius: 50px; font-size: 1rem; text-decoration:none;">Browse Cars</a>
            </div>`;
        return;
    }

    bookingsList.innerHTML = data.Data.map(booking => {
        const statusColors = {
            ACTIVE: { bg: '#ecfdf5', color: '#059669', dot: '#10b981' },
            PENDING: { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
            CANCELLED: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
            COMPLETED: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' }
        };
        const sc = statusColors[booking.status] || statusColors.PENDING;
        const days = Math.max(1, Math.round((new Date(booking.endDate) - new Date(booking.startDate)) / (1000*60*60*24)));

        return `
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.04); display: flex; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)';">
            
            <!-- Car Image Panel -->
            <div style="width: 260px; flex-shrink:0; background: linear-gradient(135deg, #f8fafc, #eef2ff); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; padding: 1.5rem;">
                <div style="position:absolute; top:1rem; left:1rem; background: var(--hero-bg-gradient); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px;">#${booking._id.slice(-6).toUpperCase()}</div>
                ${booking.carId?.image ? `<img src="${API_URL.replace('/api', '')}/${booking.carId.image}" alt="${booking.carId?.name}" onerror="this.src='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'" style="width:100%; object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));">` : '<img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400" alt="Car" style="width:100%; object-fit:contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));">'}
            </div>
            
            <!-- Main Content -->
            <div style="flex:1; padding: 2rem; display:flex; flex-direction:column; gap:1.25rem; border-left: 1px solid rgba(0,0,0,0.04);">
                
                <!-- Header row -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <p style="font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:0.4rem;">${booking.carId?.brand || 'Vehicle'}</p>
                        <h3 style="font-size:1.5rem; font-weight:800; color:var(--text-dark); letter-spacing:-0.5px; margin:0;">${booking.carId?.name || 'Reserved Vehicle'}</h3>
                    </div>
                    <div style="background:${sc.bg}; color:${sc.color}; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display:flex; align-items:center; gap:0.4rem; white-space:nowrap;">
                        <span style="width:7px; height:7px; background:${sc.dot}; border-radius:50%; display:inline-block;"></span>
                        ${booking.status}
                    </div>
                </div>

                <!-- Trip dates row -->
                <div style="display:flex; gap:1.5rem;">
                    <div style="background:#f8fafc; border-radius:12px; padding:0.9rem 1.25rem; border:1px solid #e9ecf0; flex:1;">
                        <p style="font-size:0.7rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; margin-bottom:0.3rem;">📅 Pick-up</p>
                        <strong style="font-size:1rem; color:var(--text-dark);">${new Date(booking.startDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</strong>
                    </div>
                    <div style="display:flex; align-items:center; color:var(--text-muted); font-size:1.2rem;">→</div>
                    <div style="background:#f8fafc; border-radius:12px; padding:0.9rem 1.25rem; border:1px solid #e9ecf0; flex:1;">
                        <p style="font-size:0.7rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; margin-bottom:0.3rem;">🏁 Return</p>
                        <strong style="font-size:1rem; color:var(--text-dark);">${new Date(booking.endDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</strong>
                    </div>
                    <div style="background:#f8fafc; border-radius:12px; padding:0.9rem 1.25rem; border:1px solid #e9ecf0; text-align:center;">
                        <p style="font-size:0.7rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; margin-bottom:0.3rem;">Duration</p>
                        <strong style="font-size:1rem; color:var(--primary);">${days} day${days > 1 ? 's' : ''}</strong>
                    </div>
                </div>

                <!-- Footer row -->
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1.25rem; border-top:1px solid rgba(0,0,0,0.06); margin-top:auto;">
                    <div>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.2rem;">Total Amount</p>
                        <div style="font-size:1.75rem; font-weight:800; color:var(--text-dark); letter-spacing:-1px;">₹${booking.totalPrice.toLocaleString('en-IN')}</div>
                    </div>
                    ${booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? `
                    <button onclick="deleteBooking('${booking._id}')" class="btn" style="background:white; color:#ef4444; border:1.5px solid #fecaca; border-radius:50px; padding:0.65rem 1.75rem; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                        Cancel Trip
                    </button>` : `<span style="color:var(--text-muted); font-size:0.9rem;">${booking.status === 'COMPLETED' ? '✅ Completed' : '❌ Cancelled'}</span>`}
                </div>

            </div>
        </div>
    `}).join('');
}

async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    const res = await fetchWithAuth(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const data = await res.json();
    alert(data.Message);
    if (data.Success) loadCars();
}

async function deleteBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const res = await fetchWithAuth(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const data = await res.json();
    alert(data.Message);
    if (data.Success) loadBookings();
}

// =====================
// SCROLL REVEAL
// =====================
function initRevealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// =====================
// FEATURED CARS (INDEX)
// =====================
async function loadFeaturedCars() {
    const featuredContainer = document.getElementById('featuredCars');
    if (!featuredContainer) return;

    try {
        const res = await fetch(`${API_URL}/cars`);
        const data = await res.json();
        const cars = data.Data || [];
        
        // Take top 3 cars for the featured section
        const featured = cars.slice(0, 3);
        
        if (featured.length === 0) {
            featuredContainer.innerHTML = '<div style="text-align: center; grid-column: 1 / -1; padding: 2rem; color: var(--text-muted);">Check back soon for our featured collection!</div>';
            return;
        }

        featuredContainer.className = "reveal active"; // Force active for container
        featuredContainer.innerHTML = featured.map((car, index) => `
            <div class="car-card reveal-active" style="animation-delay: ${index * 0.15}s">
                <div class="car-card-img">
                    <div class="car-badge">Featured</div>
                    ${car.image ? `<img src="${API_URL.replace('/api', '')}/${car.image}" alt="${car.name}" onerror="this.src='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'">` : '<img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400" alt="Car">'}
                </div>
                <div class="car-card-body">
                    <h3 class="car-card-title">${car.brand} ${car.name}</h3>
                    <div class="car-price" style="font-size: 1.3rem; margin-bottom: 1rem;">₹${car.pricePerDay.toLocaleString('en-IN')}<span> / day</span></div>
                    <button onclick="window.location.href='booking.html?carId=${car._id}'" class="btn btn-primary" style="width: 100%;">Reserve Now</button>
                </div>
            </div>
        `).join('');
        
        // Re-observe new elements
        initRevealOnScroll();
    } catch (error) {
        console.error('Error loading featured cars:', error);
    }
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    initRevealOnScroll();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('frontend/') ) {
        loadFeaturedCars();
    }
});

// =====================
// 3D TILT HOVER EFFECT
// =====================
document.addEventListener('mousemove', (e) => {
    const target = e.target.closest('.car-card');
    
    // Reset cards not currently hovered
    document.querySelectorAll('.car-card').forEach(card => {
        if (card !== target) {
            card.style.transform = '';
            // Reset glare
            const glare = card.querySelector('.glare');
            if (glare) glare.style.opacity = '0';
        }
    });

    if (target) {
        const rect = target.getBoundingClientRect();
        
        // Calculate mouse position relative to the card center
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt intensity (max 12 deg tilt)
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        target.style.transform = `perspective(1000px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Initialize glare layer if it doesn't exist
        let glare = target.querySelector('.glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'glare';
            glare.style.position = 'absolute';
            glare.style.top = '0';
            glare.style.left = '0';
            glare.style.width = '100%';
            glare.style.height = '100%';
            glare.style.pointerEvents = 'none';
            glare.style.opacity = '0';
            // Important for z-index layering above elements but below text if needed
            glare.style.zIndex = '5'; 
            glare.style.transition = 'opacity 0.4s ease';
            // Only show glare over the card boundaries
            glare.style.borderRadius = 'var(--radius-xl)'; 
            target.appendChild(glare);
        }
        
        // Update glare position following the mouse to simulate direct light
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, transparent 70%)`;
    }
});

// Full reset when mouse leaves the document altogether
document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.car-card').forEach(card => {
        card.style.transform = '';
        const glare = card.querySelector('.glare');
        if (glare) glare.style.opacity = '0';
    });
});
