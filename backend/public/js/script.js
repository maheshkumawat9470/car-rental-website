document.addEventListener('DOMContentLoaded', () => {
  // --- Auth State Management ---
  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const mobileAuthSection = document.getElementById('mobileAuthSection');
    const mobileUserSection = document.getElementById('mobileUserSection');
    
    if (token && user) {
      if (authSection) authSection.style.display = 'none';
      if (userSection) {
        userSection.style.display = 'flex';
        document.getElementById('userNameGreeting').innerText = `Hello, ${user.name}`;
      }
      if (mobileAuthSection) mobileAuthSection.style.display = 'none';
      if (mobileUserSection) {
        mobileUserSection.style.display = 'block';
        document.getElementById('mobileUserNameGreeting').innerText = `Hello, ${user.name}`;
      }
    } else {
      if (authSection) authSection.style.display = 'flex';
      if (userSection) userSection.style.display = 'none';
      if (mobileAuthSection) mobileAuthSection.style.display = 'block';
      if (mobileUserSection) mobileUserSection.style.display = 'none';
    }
  };
  
  updateAuthState();

  // --- Auth Modals Logic ---
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  
  const openLogin = () => {
    if (signupModal) signupModal.classList.remove('active');
    if (loginModal) loginModal.classList.add('active');
  };
  const openSignup = () => {
    if (loginModal) loginModal.classList.remove('active');
    if (signupModal) signupModal.classList.add('active');
  };

  document.getElementById('loginBtn')?.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
  document.getElementById('signupBtn')?.addEventListener('click', (e) => { e.preventDefault(); openSignup(); });
  document.getElementById('mobileLoginBtn')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('mobileMenu').classList.remove('active'); openLogin(); });
  document.getElementById('mobileSignupBtn')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('mobileMenu').classList.remove('active'); openSignup(); });
  
  document.getElementById('closeLoginBtn')?.addEventListener('click', () => loginModal.classList.remove('active'));
  document.getElementById('closeSignupBtn')?.addEventListener('click', () => signupModal.classList.remove('active'));
  document.getElementById('switchToSignup')?.addEventListener('click', (e) => { e.preventDefault(); openSignup(); });
  document.getElementById('switchToLogin')?.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthState();
  };
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('mobileLogoutBtn')?.addEventListener('click', handleLogout);

  // Login Submit
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
        updateAuthState();
        loginModal.classList.remove('active');
        document.getElementById('loginForm').reset();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) { alert('An error occurred during login'); }
  });

  // Signup Submit
  document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
        updateAuthState();
        signupModal.classList.remove('active');
        document.getElementById('signupForm').reset();
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) { alert('An error occurred during signup'); }
  });

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.8)';
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
    }
  });

  // Search Tabs (Car/Bike)
  const tabBtns = document.querySelectorAll('.tab-btn');
  let currentType = 'Car';

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.tab === 'car' ? 'Car' : 'Bike';
      fetchVehicles(currentType);
    });
  });

  // Fetch Vehicles from API
  const fetchVehicles = async (type = 'Car') => {
    const loading = document.getElementById('vehicleLoading');
    const container = document.getElementById('vehiclesContainer');
    
    loading.style.display = 'grid';
    container.innerHTML = '';

    try {
      const res = await fetch(`/api/vehicles?type=${type}`);
      const vehicles = await res.json();
      
      loading.style.display = 'none';

      // Only show top 6 featured vehicles
      const featured = vehicles.slice(0, 6);

      if (featured.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-600);">No vehicles found.</p>`;
        return;
      }

      featured.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card fade-in-up';
        card.innerHTML = `
          <img src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-img">
          <div class="vehicle-info">
            <div class="vehicle-brand">${vehicle.brand}</div>
            <h3 class="vehicle-name">${vehicle.model} <span style="font-size: 0.875rem; color: var(--gray-400); font-weight: normal;">(${vehicle.year})</span></h3>
            
            <div class="vehicle-specs">
              <div class="spec">
                <i data-lucide="droplet"></i>
                <span>${vehicle.fuelType}</span>
              </div>
              <div class="spec">
                <i data-lucide="settings"></i>
                <span>${vehicle.transmission}</span>
              </div>
              <div class="spec">
                <i data-lucide="gauge"></i>
                <span>${vehicle.mileage}</span>
              </div>
              <div class="spec">
                <i data-lucide="users"></i>
                <span>${vehicle.seatingCapacity} Seats</span>
              </div>
            </div>
            
            <div class="vehicle-footer">
              <div class="vehicle-price">₹${vehicle.pricePerDay}<span>/day</span></div>
              <button class="btn-primary" style="padding: 8px 16px;" onclick="bookVehicle('${vehicle._id}')">Book Now</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
      
      // Re-initialize icons for newly added HTML
      lucide.createIcons();
    } catch (error) {
      console.warn('API Failed, using fallback data');
      loading.style.display = 'none';
      
      const allVehicles = [
        // Cars
        { _id: 'c1', type: 'Car', brand: 'Hyundai', model: 'Creta', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '16 kmpl', seatingCapacity: 5, pricePerDay: 2500, images: ['https://cdn-s3.autocarindia.com/legacy/cdni/ExtraImages/20241227074040_5 _26_.jpg?w=728&q=75'] },
        { _id: 'c2', type: 'Car', brand: 'Hyundai', model: 'Verna', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2200, images: ['https://cdn.cartoq.com/photos/2026_hyundai_verna_facelift_spied_featured_0ffd0a301a.jpg'] },
        { _id: 'c3', type: 'Car', brand: 'Maruti', model: 'Baleno', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '22 kmpl', seatingCapacity: 5, pricePerDay: 1500, images: ['https://images.moneycontrol.com/static-mcnews/2019/01/Maruti-Suzuki-Baleno-770x433.jpg?impolicy=website&width=350&height=196'] },
        { _id: 'c4', type: 'Car', brand: 'Maruti', model: 'Brezza', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '19 kmpl', seatingCapacity: 5, pricePerDay: 1800, images: ['https://drivestm.com/wp-content/uploads/2025/12/Maruti-Brezza-compact-SUV-front-view-on-road.jpg'] },
        { _id: 'c5', type: 'Car', brand: 'Tata', model: 'Nexon', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '17 kmpl', seatingCapacity: 5, pricePerDay: 2000, images: ['https://selectcars.in/wp-content/uploads/2025/01/nexton-bg.webp'] },
        { _id: 'c6', type: 'Car', brand: 'Tata', model: 'Harrier', year: 2023, fuelType: 'Diesel', transmission: 'Auto', mileage: '15 kmpl', seatingCapacity: 5, pricePerDay: 3500, images: ['https://ic4.maxabout.us/autos/cars_india/2025/06/Tata_Harrier_EV-20250620112052.jpg'] },
        { _id: 'c7', type: 'Car', brand: 'Mahindra', model: 'XUV700', year: 2023, fuelType: 'Diesel', transmission: 'Auto', mileage: '14 kmpl', seatingCapacity: 7, pricePerDay: 4000, images: ['https://images.firstpost.com/wp-content/uploads/2021/09/mahindra-xuv700-ax7-priced-from-rs-17-59-lakh-all-variant-prices-revealed-deliveries-start-7-october.jpg?im=FitAndFill=(596,336)'] },
        { _id: 'c8', type: 'Car', brand: 'Mahindra', model: 'Thar', year: 2023, fuelType: 'Diesel', transmission: 'Manual', mileage: '15 kmpl', seatingCapacity: 4, pricePerDay: 3500, images: ['https://content.carlelo.com/media/news/mahindra-thar-roxx-waiting-period.webp'] },
        { _id: 'c9', type: 'Car', brand: 'Kia', model: 'Seltos', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '16 kmpl', seatingCapacity: 5, pricePerDay: 2600, images: ['https://assets.gqindia.com/photos/5d5265d8bef589000876c694/16:9/w_2560,c_limit/Kia-Seltos.jpg'] },
        { _id: 'c10', type: 'Car', brand: 'Kia', model: 'Sonet', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 1900, images: ['https://www.carandbike.com/_next/image?url=https://images.carandbike.com/cms/blog-feed/2023/12/39/articles/2023/12/3210789/Kia_Sonet_facelift_e30876a53d.jpg&w=1920&q=90'] },
        { _id: 'c11', type: 'Car', brand: 'Honda', model: 'City', year: 2022, fuelType: 'Petrol', transmission: 'Auto', mileage: '17 kmpl', seatingCapacity: 5, pricePerDay: 2400, images: ['https://apollo.olx.in/v1/files/s5h3m4iyfrpn1-IN/image;s=300x0'] },
        { _id: 'c12', type: 'Car', brand: 'Toyota', model: 'Innova Crysta', year: 2023, fuelType: 'Diesel', transmission: 'Manual', mileage: '13 kmpl', seatingCapacity: 7, pricePerDay: 4500, images: ['https://apollo.olx.in/v1/files/q33xyv7wqhm31-IN/image;s=300x0'] },
        { _id: 'c13', type: 'Car', brand: 'Toyota', model: 'Fortuner', year: 2023, fuelType: 'Diesel', transmission: 'Auto', mileage: '10 kmpl', seatingCapacity: 7, pricePerDay: 6000, images: ['https://www.jazzycars.in/wp-content/uploads/2022/12/WhatsApp-Image-2022-12-18-at-3.33.51-PM.jpeg'] },
        { _id: 'c14', type: 'Car', brand: 'MG', model: 'Hector', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '14 kmpl', seatingCapacity: 5, pricePerDay: 3000, images: ['https://mc.bajajfinserv.in/media/catalog/product/m/g/mghectorplus7sblackstormdsl6mtstarryblack_base.jpeg'] },
        { _id: 'c15', type: 'Car', brand: 'Volkswagen', model: 'Virtus', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2700, images: ['https://mc.bajajfinserv.in/media/catalog/product/v/o/volkswagenvirtusgtlineat10ltsireflexsilver5seater_additional1.jpeg'] },
        { _id: 'c16', type: 'Car', brand: 'Skoda', model: 'Slavia', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '18 kmpl', seatingCapacity: 5, pricePerDay: 2700, images: ['https://www.buyskodaonline.co.in/common/FeatureItem/FI_36.jpg'] },
        { _id: 'c17', type: 'Car', brand: 'Renault', model: 'Kiger', year: 2022, fuelType: 'Petrol', transmission: 'Auto', mileage: '19 kmpl', seatingCapacity: 5, pricePerDay: 1700, images: ['https://www.rushlane.com/wp-content/uploads/2021/01/new-renault-kiger-tvc-video.jpg'] },
        { _id: 'c18', type: 'Car', brand: 'Nissan', model: 'Magnite', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '20 kmpl', seatingCapacity: 5, pricePerDay: 1600, images: ['https://mda.spinny.com/sp-file-system/public/2026-02-21/1b85df4ca8cc42228daf9e4f7ad370ff/raw/file.JPG?q=85&w=900&dpr=0.8'] },
        { _id: 'c19', type: 'Car', brand: 'Jeep', model: 'Compass', year: 2023, fuelType: 'Diesel', transmission: 'Auto', mileage: '15 kmpl', seatingCapacity: 5, pricePerDay: 4000, images: ['https://images.financialexpressdigital.com/2023/12/2024-Jeep-Compass.jpg'] },
        { _id: 'c20', type: 'Car', brand: 'BMW', model: '3 Series', year: 2023, fuelType: 'Petrol', transmission: 'Auto', mileage: '14 kmpl', seatingCapacity: 5, pricePerDay: 10000, images: ['https://www.motoringresearch.com/wp-content/uploads/2018/11/P90190497_highRes_40-years-bmw-3-serie.jpg'] },
        // Bikes
        { _id: 'b1', type: 'Bike', brand: 'Royal Enfield', model: 'Classic 350', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 800, images: ['https://images.timesnownews.com/photo/msid-153261876/153261876.jpg'] },
        { _id: 'b2', type: 'Bike', brand: 'Royal Enfield', model: 'Hunter 350', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '36 kmpl', seatingCapacity: 2, pricePerDay: 750, images: ['https://images.drivespark.com/img/2025/04/2025-royal-enfield-hunter-350-leaks-1-1745485374.jpg'] },
        { _id: 'b3', type: 'Bike', brand: 'Royal Enfield', model: 'Meteor 350', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 850, images: ['https://cdn.bikedekho.com/upload/userreviewimages/6984e7abd6ae2.jpg'] },
        { _id: 'b4', type: 'Bike', brand: 'KTM', model: 'Duke 200', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '33 kmpl', seatingCapacity: 2, pricePerDay: 900, images: ['https://gaadiwaadi.com/wp-content/uploads/2017/02/2017-KTM-Duke-390-2017-KTM-Duke-250-2017-KTM-Duke-200-India-Launch-10.jpg'] },
        { _id: 'b5', type: 'Bike', brand: 'KTM', model: 'Duke 390', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '28 kmpl', seatingCapacity: 2, pricePerDay: 1500, images: ['https://www.motoroids.com/wp-content/uploads/2026/04/KTM-DUKE-390.jpg'] },
        { _id: 'b6', type: 'Bike', brand: 'Yamaha', model: 'R15 V4', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 1000, images: ['https://teja8.kuikr.com/i4/20260614/2024-Yamaha-YZF-R15-V4---10000-kms-driven-in-Danapur-Khagaul-Road-VB201705171774173-ak_LWBP368033322-1781433718.jpeg'] },
        { _id: 'b7', type: 'Bike', brand: 'Yamaha', model: 'MT15', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 950, images: ['https://gaadiwaadi.com/wp-content/uploads/2019/03/yamaha-mt15-india-launch-pics-10-1068x712.jpg'] },
        { _id: 'b8', type: 'Bike', brand: 'Bajaj', model: 'Pulsar NS200', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 700, images: ['https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3922983008409335663'] },
        { _id: 'b9', type: 'Bike', brand: 'Bajaj', model: 'Dominar 400', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '27 kmpl', seatingCapacity: 2, pricePerDay: 1200, images: ['https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3882079015318087252'] },
        { _id: 'b10', type: 'Bike', brand: 'TVS', model: 'Apache RTR 200', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '38 kmpl', seatingCapacity: 2, pricePerDay: 800, images: ['https://c.ndtvimg.com/2025-09/dsdeqgg_apache_625x300_07_September_25.jpg?im=FitAndFill,algorithm=dnn,width=400,height=225&q=70'] },
        { _id: 'b11', type: 'Bike', brand: 'TVS', model: 'Ronin', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '40 kmpl', seatingCapacity: 2, pricePerDay: 750, images: ['https://i.ytimg.com/vi/7bHYfdhN3ZI/maxresdefault.jpg'] },
        { _id: 'b12', type: 'Bike', brand: 'Honda', model: 'CB350', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 850, images: ['https://upload.wikimedia.org/wikipedia/commons/e/ec/Honda_350.jpg'] },
        { _id: 'b13', type: 'Bike', brand: 'Honda', model: 'Hornet 2.0', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 600, images: ['https://m.media-amazon.com/images/I/71K48czn6sL._AC_UF1000,1000_QL80_.jpg'] },
        { _id: 'b14', type: 'Bike', brand: 'Suzuki', model: 'Gixxer SF', year: 2022, fuelType: 'Petrol', transmission: 'Manual', mileage: '45 kmpl', seatingCapacity: 2, pricePerDay: 700, images: ['https://cdn.suzukimotorcycle.co.in/public-live/uploads/product-360-images/original/78/3.png'] },
        { _id: 'b15', type: 'Bike', brand: 'Hero', model: 'Xpulse 200', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '40 kmpl', seatingCapacity: 2, pricePerDay: 650, images: ['https://www.91wheels.com/assets/uploads/swatchs/Xpulse_200_BS6_MatteGreen1631269264.jpg'] },
        { _id: 'b16', type: 'Bike', brand: 'Hero', model: 'Karizma XMR', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', seatingCapacity: 2, pricePerDay: 900, images: ['https://acko-cms.ackoassets.com/2025_Hero_Karizma_XMR_210_2_d258676f0c.png'] },
        { _id: 'b17', type: 'Bike', brand: 'Jawa', model: '42', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '33 kmpl', seatingCapacity: 2, pricePerDay: 850, images: ['https://images.91wheels.com/assets/b_images/gallery/jawa/42/jawa-42-5-1777366635.jpg?w=560&q=40'] },
        { _id: 'b18', type: 'Bike', brand: 'Yezdi', model: 'Roadster', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '30 kmpl', seatingCapacity: 2, pricePerDay: 900, images: ['https://turbocharged.in/wp-content/uploads/2025/09/Yezdi-Roadster.Web4_.jpg'] },
        { _id: 'b19', type: 'Bike', brand: 'Kawasaki', model: 'Ninja 300', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '25 kmpl', seatingCapacity: 2, pricePerDay: 2500, images: ['https://www.visordown.com/sites/default/files/52493_0.jpg?aspect_ratio=16:9'] },
        { _id: 'b20', type: 'Bike', brand: 'BMW', model: 'G310R', year: 2023, fuelType: 'Petrol', transmission: 'Manual', mileage: '30 kmpl', seatingCapacity: 2, pricePerDay: 2000, images: ['https://www.carandbike.com/_next/image?url=https://images.carandbike.com/bike-images/colors/bmw/g-310-r/bmw-g-310-r-white.png?v=1602165447&w=640&q=75'] }
      ];

      // Store in window for global access (for modal)
      window.__ALL_VEHICLES__ = allVehicles;

      const displayVehicles = allVehicles.filter(v => v.type === type);

      displayVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card fade-in-up';
        card.innerHTML = `
          <img src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-img">
          <div class="vehicle-info">
            <div class="vehicle-brand">${vehicle.brand}</div>
            <h3 class="vehicle-name">${vehicle.model} <span style="font-size: 0.875rem; color: var(--gray-400); font-weight: normal;">(${vehicle.year})</span></h3>
            
            <div class="vehicle-specs">
              <div class="spec"><i data-lucide="droplet"></i><span>${vehicle.fuelType}</span></div>
              <div class="spec"><i data-lucide="settings"></i><span>${vehicle.transmission}</span></div>
              <div class="spec"><i data-lucide="gauge"></i><span>${vehicle.mileage}</span></div>
              <div class="spec"><i data-lucide="users"></i><span>${vehicle.seatingCapacity} Seats</span></div>
            </div>
            
            <div class="vehicle-footer">
              <div class="vehicle-price">₹${vehicle.pricePerDay}<span>/day</span></div>
              <button class="btn-primary" style="padding: 8px 16px;" onclick="openBookingModal('${vehicle._id}')">Book Now</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
      lucide.createIcons();
    }
  };

  // Initial fetch
  fetchVehicles('Car');

  // Booking Modal Logic
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const bookPickup = document.getElementById('bookPickup');
  const bookReturn = document.getElementById('bookReturn');
  const bookingForm = document.getElementById('bookingForm');
  const toast = document.getElementById('toast');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  window.openBookingModal = (id) => {
    const vehicle = window.__ALL_VEHICLES__.find(v => v._id === id);
    if (!vehicle) return;

    document.getElementById('bookVehicleId').value = vehicle._id;
    document.getElementById('bookVehiclePrice').value = vehicle.pricePerDay;

    document.getElementById('modalVehicleInfo').innerHTML = `
      <img src="${vehicle.images[0]}" alt="${vehicle.model}">
      <div>
        <h3 style="font-weight: 700;">${vehicle.brand} ${vehicle.model}</h3>
        <p style="color: var(--gray-600); font-size: 0.875rem;">₹${vehicle.pricePerDay}/day</p>
      </div>
    `;

    // Pre-fill name if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.name) {
      document.getElementById('bookName').value = user.name;
    }

    // Reset dates and prices
    bookPickup.value = '';
    bookReturn.value = '';
    updatePrices(0);

    modal.classList.add('active');
  };

  const calculateDays = (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (isNaN(d1) || isNaN(d2) || d1 >= d2) return 0;
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const updatePrices = (days) => {
    const pricePerDay = parseInt(document.getElementById('bookVehiclePrice').value) || 0;
    const rentalAmount = days * pricePerDay;
    const deposit = rentalAmount > 0 ? 5000 : 0; // Flat 5k deposit
    const gst = rentalAmount * 0.18;
    const total = rentalAmount + deposit + gst;

    document.getElementById('calcRental').innerText = `₹${rentalAmount}`;
    document.getElementById('calcDeposit').innerText = `₹${deposit}`;
    document.getElementById('calcGst').innerText = `₹${gst.toFixed(2)}`;
    document.getElementById('calcTotal').innerText = `₹${total.toFixed(2)}`;
  };

  [bookPickup, bookReturn].forEach(input => {
    input.addEventListener('change', () => {
      const days = calculateDays(bookPickup.value, bookReturn.value);
      updatePrices(days);
    });
  });

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      modal.classList.remove('active');
      openLogin();
      return;
    }

    const days = calculateDays(bookPickup.value, bookReturn.value);
    if (days <= 0) {
      alert("Please select valid dates. Return date must be after pickup date.");
      return;
    }

    const vehicleId = document.getElementById('bookVehicleId').value;
    const name = document.getElementById('bookName').value;
    const phone = document.getElementById('bookPhone').value;
    const aadhar = document.getElementById('bookAadhar').value;
    const pickupAddress = document.getElementById('bookPickupAddress').value;
    const dropAddress = document.getElementById('bookDropAddress').value;
    
    const pricePerDay = parseInt(document.getElementById('bookVehiclePrice').value) || 0;
    const rentalAmount = days * pricePerDay;
    const securityDeposit = rentalAmount > 0 ? 5000 : 0;
    const gstAmount = rentalAmount * 0.18;
    const totalAmount = rentalAmount + securityDeposit + gstAmount;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId,
          name,
          phone,
          aadhar,
          pickupAddress,
          dropAddress,
          pickupDate: bookPickup.value,
          returnDate: bookReturn.value,
          rentalAmount,
          securityDeposit,
          gstAmount,
          totalAmount
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Successful booking
        modal.classList.remove('active');
        
        // Show toast
        toast.innerText = "Booking Confirmed Successfully!";
        toast.style.background = "rgba(16, 185, 129, 0.9)"; // Green
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      } else {
        alert(data.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      alert('An error occurred while creating your booking.');
    }
  });

  // Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileBtn = document.getElementById('closeMobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && closeMobileBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    closeMobileBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all first
      faqItems.forEach(faq => faq.classList.remove('active'));
      
      // If wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // My Bookings Logic
  const myBookingsModal = document.getElementById('myBookingsModal');
  const closeMyBookingsBtn = document.getElementById('closeMyBookingsBtn');
  
  const openMyBookings = async () => {
    myBookingsModal.classList.add('active');
    const container = document.getElementById('myBookingsContainer');
    container.innerHTML = '<p style="text-align:center;">Loading your bookings...</p>';
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/bookings/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookings = await res.json();

      if (!res.ok) throw new Error(bookings.message);

      if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--gray-500);">You have no active bookings.</p>';
        return;
      }

      container.innerHTML = bookings.map(b => {
        const v = b.vehicle || {};
        const vName = v.brand ? `${v.brand} ${v.model}` : 'Unknown Vehicle';
        const img = (v.images && v.images[0]) ? v.images[0] : '';
        const pickup = new Date(b.pickupDate).toLocaleDateString();
        const drop = new Date(b.returnDate).toLocaleDateString();
        return `
          <div style="display:flex; gap:15px; border: 1px solid var(--gray-200); padding: 15px; border-radius: 8px; background: white;">
            ${img ? `<img src="${img}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 6px;">` : ''}
            <div style="flex:1;">
              <h3 style="margin-bottom: 5px;">${vName}</h3>
              <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 2px;"><strong>Dates:</strong> ${pickup} to ${drop}</p>
              <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 2px;"><strong>Total Paid:</strong> ₹${b.totalAmount}</p>
              <p style="font-size: 0.875rem; color: var(--primary-600); font-weight: 500;">Status: ${b.bookingStatus}</p>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      container.innerHTML = '<p style="text-align:center; color: red;">Failed to load bookings.</p>';
    }
  };

  document.getElementById('myBookingsBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openMyBookings();
  });
  
  document.getElementById('mobileMyBookingsBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobileMenu').classList.remove('active');
    openMyBookings();
  });

  closeMyBookingsBtn?.addEventListener('click', () => {
    myBookingsModal.classList.remove('active');
  });

});
