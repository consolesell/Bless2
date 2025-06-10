// Firebase imports and configuration
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx-cS3l5_49Q2-xs5hqe5BKs79Laz4B0o",
  authDomain: "leotu-5c2b5.firebaseapp.com",
  databaseURL: "https://leotu-5c2b5-default-rtdb.firebaseio.com",
  projectId: "leotu-5c2b5",
  storageBucket: "leotu-5c2b5.firebasestorage.app",
  messagingSenderId: "694359717732",
  appId: "1:694359717732:web:1e79cc09e8e991f7322c71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const messaging = getMessaging(app);

// Services data
const servicesData = [
    {
        title: "Hotel Transfers",
        description: "Comfortable and reliable transfers to and from your hotel. Professional drivers ensure you reach your destination safely and on time.",
        images: ["hotel1.jpg", "hotel2.jpg", "hotel3.jpg"]
    },
    {
        title: "Airport/SGR Transfers",
        description: "Hassle-free airport and Standard Gauge Railway transfers. Never miss a flight or train with our punctual service.",
        images: ["airport1.jpg", "airport2.jpg", "airport3.jpg"]
    },
    {
        title: "Mombasa Old Town/Fort Jesus Tours",
        description: "Explore the rich history and culture of Mombasa Old Town and the historic Fort Jesus with our knowledgeable guides.",
        images: ["mombasa1.jpg", "mombasa2.jpg", "mombasa3.jpg"]
    },
    {
        title: "Marafa Hell's Kitchen Excursion",
        description: "Experience the breathtaking geological formations of Marafa Hell's Kitchen, also known as Nyari.",
        images: ["marafa1.jpg", "marafa2.jpg", "marafa3.jpg"]
    },
    {
        title: "Wasini/Dolphins Tour",
        description: "Unforgettable marine adventure with dolphin watching, snorkeling, and exploring Wasini Island.",
        images: ["wasini1.jpg", "wasini2.jpg", "wasini3.jpg"]
    },
    {
        title: "Shimba Hills National Reserve",
        description: "Discover the unique ecosystem of Shimba Hills, home to rare sable antelopes and stunning landscapes.",
        images: ["shimba1.jpg", "shimba2.jpg", "shimba3.jpg"]
    },
    {
        title: "Bora Bora Wildlife Sanctuary",
        description: "Experience wildlife conservation at its finest with guided tours through Bora Bora Wildlife Sanctuary.",
        images: ["borabora1.jpg", "borabora2.jpg", "borabora3.jpg"]
    },
    {
        title: "Tsavo East/West Park Safaris",
        description: "Epic safari adventures in Kenya's largest national parks, home to the famous red elephants.",
        images: ["tsavo1.jpg", "tsavo2.jpg", "tsavo3.jpg"]
    },
    {
        title: "Amboseli Safari",
        description: "Witness majestic elephants against the backdrop of Mount Kilimanjaro in Amboseli National Park.",
        images: ["amboseli1.jpg", "amboseli2.jpg", "amboseli3.jpg"]
    },
    {
        title: "Masai Mara Safari",
        description: "Experience the world-famous Great Migration and Big Five in the iconic Masai Mara National Reserve.",
        images: ["masaimara1.jpg", "masaimara2.jpg", "masaimara3.jpg"]
    },
    {
        title: "Car Hire & Chauffeur Services",
        description: "Self-drive options or professional chauffeur-driven vehicles for all your transportation needs.",
        images: ["carhire1.jpg", "carhire2.jpg", "carhire3.jpg"]
    },
    {
        title: "Executive Transfers",
        description: "Premium executive transport services for business travelers and VIP clients.",
        images: ["executive1.jpg", "executive2.jpg", "executive3.jpg"]
    },
    {
        title: "Long Distance Hire",
        description: "Comfortable long-distance travel services across Kenya and neighboring countries.",
        images: ["longdistance1.jpg", "longdistance2.jpg", "longdistance3.jpg"]
    },
    {
        title: "Group/Corporate Transfers",
        description: "Efficient group transportation solutions for corporate events, conferences, and team building.",
        images: ["group1.jpg", "group2.jpg", "group3.jpg"]
    },
    {
        title: "International Pilgrimage Transfers",
        description: "Annual pilgrimage transfers to Tanzania, Uganda, and Rwanda with experienced guides.",
        images: ["pilgrimage1.jpg", "pilgrimage2.jpg", "pilgrimage3.jpg"]
    }
];

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const servicesGrid = document.getElementById('services-grid');
const loadingOverlay = document.getElementById('loading-overlay');
const pwaBanner = document.getElementById('pwa-banner');
const installBtn = document.getElementById('install-btn');
const closeBanner = document.getElementById('close-banner');
const logoutBtn = document.getElementById('logout-btn');

// PWA Installation
let deferredPrompt;
let isInstallPromptShown = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    checkAuthState();
    setupEventListeners();
    setupPWA();
    setupNotifications();
    loadServices();
    setupScrollAnimations();
});

// Authentication state check
function checkAuthState() {
    showLoading(true);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            saveUserData(user);
            showLoading(false);
        } else {
            // User is signed out, redirect to login
            window.location.href = 'login.html';}
   });
}

// Save user data to Firebase
async function saveUserData(user) {
   try {
       const userRef = ref(database, `users/${user.uid}`);
       const userData = {
           uid: user.uid,
           email: user.email,
           displayName: user.displayName || 'User',
           lastLogin: new Date().toISOString(),
           loginCount: 1
       };
       
       // Check if user exists to increment login count
       onValue(userRef, (snapshot) => {
           if (snapshot.exists()) {
               const existingData = snapshot.val();
               userData.loginCount = (existingData.loginCount || 0) + 1;
           }
           set(userRef, userData);
       }, { onlyOnce: true });
       
   } catch (error) {
       console.error('Error saving user data:', error);
   }
}

// Initialize app functions
function initializeApp() {
   // Smooth scrolling for navigation links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function (e) {
           e.preventDefault();
           const target = document.querySelector(this.getAttribute('href'));
           if (target) {
               target.scrollIntoView({
                   behavior: 'smooth',
                   block: 'start'
               });
           }
       });
   });
}

// Setup event listeners
function setupEventListeners() {
   // Navbar scroll effect
   window.addEventListener('scroll', handleScroll);
   
   // Mobile menu toggle
   hamburger.addEventListener('click', toggleMobileMenu);
   
   // Close mobile menu when clicking on links
   document.querySelectorAll('.nav-link').forEach(link => {
       link.addEventListener('click', () => {
           navMenu.classList.remove('active');
       });
   });
   
   // Logout functionality
   logoutBtn.addEventListener('click', handleLogout);
   
   // Vehicle category selection
   document.querySelectorAll('.category-card').forEach(card => {
       card.addEventListener('click', () => {
           const category = card.dataset.category;
           localStorage.setItem('selectedVehicleCategory', category);
           window.location.href = 'bookings.html';
       });
   });
   
   // PWA banner events
   if (closeBanner) {
       closeBanner.addEventListener('click', hidePWABanner);
   }
   if (installBtn) {
       installBtn.addEventListener('click', installPWA);
   }
}

// Handle scroll events
function handleScroll() {
   const scrollTop = window.pageYOffset;
   
   // Navbar scroll effect
   if (scrollTop > 100) {
       navbar.classList.add('scrolled');
   } else {
       navbar.classList.remove('scrolled');
   }
   
   // Parallax effect for hero section
   const hero = document.querySelector('.hero');
   if (hero) {
       const speed = scrollTop * 0.5;
       hero.style.transform = `translateY(${speed}px)`;
   }
}

// Toggle mobile menu
function toggleMobileMenu() {
   navMenu.classList.toggle('active');
   
   // Animate hamburger
   const bars = hamburger.querySelectorAll('.bar');
   bars.forEach((bar, index) => {
       if (navMenu.classList.contains('active')) {
           if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
           if (index === 1) bar.style.opacity = '0';
           if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
       } else {
           bar.style.transform = 'none';
           bar.style.opacity = '1';
       }
   });
}

// Handle logout
async function handleLogout() {
   try {
       showLoading(true);
       await signOut(auth);
       window.location.href = 'login.html';
   } catch (error) {
       console.error('Error signing out:', error);
       showLoading(false);
   }
}

// Load services dynamically
function loadServices() {
   servicesGrid.innerHTML = '';
   
   servicesData.forEach((service, index) => {
       const serviceCard = createServiceCard(service, index);
       servicesGrid.appendChild(serviceCard);
   });
   
   // Start image animations
   setTimeout(() => {
       startImageAnimations();
   }, 1000);
}

// Create service card
function createServiceCard(service, index) {
   const card = document.createElement('div');
   card.className = 'service-card fade-in-up';
   card.style.animationDelay = `${index * 0.1}s`;
   
   const imagesHtml = service.images.map((image, imgIndex) => 
       `<img src="public/services/${image}" alt="${service.title}" class="service-image ${imgIndex === 0 ? 'active' : ''}" loading="lazy">`
   ).join('');
   
   card.innerHTML = `
       <div class="service-images" data-service-index="${index}">
           ${imagesHtml}
       </div>
       <div class="service-content">
           <h3 class="service-title">${service.title}</h3>
           <p class="service-description">${service.description}</p>
           <button class="book-now-btn" onclick="redirectToBookings('${service.title}')">
               Book Now
           </button>
       </div>
   `;
   
   return card;
}

// Start image animations for service cards
function startImageAnimations() {
   const imageContainers = document.querySelectorAll('.service-images');
   
   imageContainers.forEach(container => {
       const images = container.querySelectorAll('.service-image');
       let currentIndex = 0;
       
       if (images.length > 1) {
           setInterval(() => {
               images[currentIndex].classList.remove('active');
               currentIndex = (currentIndex + 1) % images.length;
               images[currentIndex].classList.add('active');
           }, 3000); // Change image every 3 seconds
       }
   });
}

// Redirect to bookings with service pre-selected
window.redirectToBookings = function(serviceName) {
   localStorage.setItem('selectedService', serviceName);
   window.location.href = 'bookings.html';
};

// Scroll to services section
window.scrollToServices = function() {
   document.getElementById('services').scrollIntoView({
       behavior: 'smooth'
   });
};

// Setup scroll animations
function setupScrollAnimations() {
   const observerOptions = {
       threshold: 0.1,
       rootMargin: '0px 0px -50px 0px'
   };
   
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.classList.add('fade-in-up');
           }
       });
   }, observerOptions);
   
   // Observe elements for animation
   document.querySelectorAll('.service-card, .category-card, .contact-item').forEach(el => {
       observer.observe(el);
   });
}

// PWA Setup
function setupPWA() {
   // Register service worker
   if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('/sw.js')
           .then(registration => {
               console.log('SW registered: ', registration);
           })
           .catch(registrationError => {
               console.log('SW registration failed: ', registrationError);
           });
   }
   
   // Handle install prompt
   window.addEventListener('beforeinstallprompt', (e) => {
       e.preventDefault();
       deferredPrompt = e;
       
       // Show PWA banner after 30 seconds if not installed
       if (!isInstallPromptShown && !window.matchMedia('(display-mode: standalone)').matches) {
           setTimeout(() => {
               showPWABanner();
           }, 30000);
       }
   });
   
   // Handle app installed
   window.addEventListener('appinstalled', () => {
       hidePWABanner();
       deferredPrompt = null;
   });
}

// Show PWA banner
function showPWABanner() {
   if (pwaBanner && !isInstallPromptShown) {
       pwaBanner.classList.add('show');
       isInstallPromptShown = true;
   }
}

// Hide PWA banner
function hidePWABanner() {
   if (pwaBanner) {
       pwaBanner.classList.remove('show');
   }
}

// Install PWA
async function installPWA() {
   if (deferredPrompt) {
       deferredPrompt.prompt();
       const { outcome } = await deferredPrompt.userChoice;
       
       if (outcome === 'accepted') {
           hidePWABanner();
       }
       
       deferredPrompt = null;
   }
}

// Setup push notifications
async function setupNotifications() {
   if ('Notification' in window && 'serviceWorker' in navigator) {
       try {
           // Request notification permission
           const permission = await Notification.requestPermission();
           
           if (permission === 'granted') {
               // Get FCM token
               const token = await getToken(messaging, {
                   vapidKey: 'YOUR_VAPID_KEY' // You'll need to generate this in Firebase Console
               });
               
               if (token) {
                   // Save token to database for admin notifications
                   const user = auth.currentUser;
                   if (user) {
                       const tokenRef = ref(database, `tokens/${user.uid}`);
                       await set(tokenRef, {
                           token: token,
                           timestamp: new Date().toISOString()
                       });
                   }
               }
               
               // Listen for foreground messages
               onMessage(messaging, (payload) => {
                   console.log('Message received: ', payload);
                   showNotification(payload.notification.title, payload.notification.body);
               });
           }
       } catch (error) {
           console.error('Error setting up notifications:', error);
       }
   }
}

// Show notification
function showNotification(title, body) {
   if ('Notification' in window && Notification.permission === 'granted') {
       const notification = new Notification(title, {
           body: body,
           icon: '/public/services/logo.png',
           badge: '/public/services/logo.png',
           tag: 'excellence-travel'
       });
       
       notification.onclick = function() {
           window.focus();
           notification.close();
       };
       
       // Auto close after 5 seconds
       setTimeout(() => {
           notification.close();
       }, 5000);
   }
}

// Send booking notification to admin
export async function sendBookingNotification(bookingData) {
   try {
       const notificationRef = ref(database, 'admin_notifications');
       const newNotificationRef = push(notificationRef);
       
       const notification = {
           type: 'new_booking',
           title: 'New Booking Received',
           message: `New booking for ${bookingData.service} by ${bookingData.customerName}`,
           bookingId: bookingData.id,
           timestamp: new Date().toISOString(),
           read: false,
           customerEmail: bookingData.email,
           service: bookingData.service,
           bookingDate: bookingData.bookingDate
       };
       
       await set(newNotificationRef, notification);
       
       // Send email notification (you'll need to implement server-side function)
       await sendEmailNotification(bookingData);
       
   } catch (error) {
       console.error('Error sending booking notification:', error);
   }
}

// Send email notification (placeholder - implement server-side)
async function sendEmailNotification(bookingData) {
   // This would typically be handled by a cloud function
   const emailData = {
       to: 'sblgivan@gmail.com',
       subject: 'New Booking - Excellence Travel Solutions Africa',
       body: `
           New booking received:
           
           Customer: ${bookingData.customerName}
           Email: ${bookingData.email}
           Phone: ${bookingData.phone}
           Service: ${bookingData.service}
           Date: ${bookingData.bookingDate}
           Passengers: ${bookingData.passengers}
           
           Please check your admin dashboard for full details.
       `
   };
   
   // You would send this to your backend/cloud function
   console.log('Email notification would be sent:', emailData);
}

// Show/hide loading overlay
function showLoading(show) {
   if (loadingOverlay) {
       if (show) {
           loadingOverlay.classList.add('active');
       } else {
           loadingOverlay.classList.remove('active');
       }
   }
}

// Utility functions
function formatDate(date) {
   return new Intl.DateTimeFormat('en-KE', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
   }).format(new Date(date));
}

function formatCurrency(amount) {
   return new Intl.NumberFormat('en-KE', {
       style: 'currency',
       currency: 'KES'
   }).format(amount);
}

// Geolocation helper
function getCurrentLocation() {
   return new Promise((resolve, reject) => {
       if ('geolocation' in navigator) {
           navigator.geolocation.getCurrentPosition(
               position => {
                   resolve({
                       latitude: position.coords.latitude,
                       longitude: position.coords.longitude
                   });
               },
               error => {
                   reject(error);
               },
               {
                   enableHighAccuracy: true,
                   timeout: 10000,
                   maximumAge: 300000
               }
           );
       } else {
           reject(new Error('Geolocation not supported'));
       }
   });
}

// Export functions for use in other modules
export { 
   sendBookingNotification, 
   getCurrentLocation, 
   formatDate, 
   formatCurrency,
   showLoading 
};

// Error handling
window.addEventListener('error', (e) => {
   console.error('Global error:', e.error);
   // You could send this to your error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
   console.error('Unhandled promise rejection:', e.reason);
   // You could send this to your error tracking service
});

// Performance monitoring
if ('performance' in window) {
   window.addEventListener('load', () => {
       setTimeout(() => {
           const perfData = performance.getEntriesByType('navigation')[0];
           console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
       }, 0);
   });
}