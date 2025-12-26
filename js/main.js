// Variables globales
let currentPage = 'accueil';
let services = [
    {
        id: 1,
        name: 'Installation électrique complète',
        description: 'Installation électrique pour logement neuf ou rénovation',
        price: 150,
        category: 'Installation',
        quantity: 0,
        selected: false
    },
    {
        id: 2,
        name: 'Dépannage électrique',
        description: 'Intervention rapide pour panne électrique',
        price: 80,
        category: 'Dépannage',
        quantity: 0,
        selected: false
    },
    {
        id: 3,
        name: 'Mise aux normes',
        description: 'Mise aux normes NF C 15-100',
        price: 200,
        category: 'Rénovation',
        quantity: 0,
        selected: false
    },
    {
        id: 4,
        name: 'Installation domotique',
        description: 'Installation système domotique connecté',
        price: 300,
        category: 'Domotique',
        quantity: 0,
        selected: false
    },
    {
        id: 5,
        name: 'Éclairage LED',
        description: 'Installation éclairage LED économique',
        price: 120,
        category: 'Installation',
        quantity: 0,
        selected: false
    },
    {
        id: 6,
        name: 'Tableau électrique',
        description: 'Remplacement tableau électrique',
        price: 250,
        category: 'Rénovation',
        quantity: 0,
        selected: false
    }
];

let realizations = [
    {
        id: 1,
        title: 'Installation électrique villa',
        category: 'Installation',
        location: 'Marseille 8ème',
        description: 'Installation électrique complète pour villa de 200m²',
        image: '/assets/img/realisation1.png'
    },
    {
        id: 2,
        title: 'Rénovation électrique appartement',
        category: 'Rénovation',
        location: 'Marseille Centre',
        description: 'Rénovation électrique appartement haussmannien',
        image: '/assets/img/realisation2.png'
    },
    {
        id: 3,
        title: 'Installation industrielle',
        category: 'Industriel',
        location: 'Zone Nord',
        description: 'Installation électrique pour entrepôt industriel',
        image: '/assets/img/realisation3.png'
    },
    {
        id: 4,
        title: 'Système domotique',
        category: 'Domotique',
        location: 'Aix-en-Provence',
        description: 'Installation système domotique maison connectée',
        image: '/assets/img/realisation4.png'
    }
];

// Authentification
let currentUser = null;
let isAdmin = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializePageLoader();
    initializeApp();
});

// Gestion du loader
function initializePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    // Vérifier si l'utilisateur a déjà vu le loader
    const hasSeenLoader = localStorage.getItem('hasSeenLoader');

    if (hasSeenLoader === 'true') {
        // Masquer immédiatement le loader
        loader.style.display = 'none';
    } else {
        // Afficher le loader pendant 2 secondes
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Sauvegarder que l'utilisateur a vu le loader
                localStorage.setItem('hasSeenLoader', 'true');
            }, 500); // Attendre la fin de la transition d'opacité
        }, 2000);
    }
}

function initializeApp() {
    // Vérifier l'authentification
    checkAuth();
    
    // Initialiser les composants
    initializeHeader();
    initializeCookieBanner();
    initializeAnimations();
    
    // Initialiser les pages spécifiques
    const path = window.location.pathname;
    if (path.includes('calculateur')) {
        initializeCalculator();
    } else if (path.includes('realisations')) {
        initializeRealizations();
    } else if (path.includes('contact')) {
        initializeContact();
    } else if (path.includes('login')) {
        initializeLogin();
    } else if (path.includes('admin')) {
        initializeAdmin();
    }
}

// Header
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            if (mobileNav) {
                mobileNav.classList.toggle('active');
            }
        });
    }
    
    // Smooth scrolling for anchor links
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

// Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });
}

// Cookies
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    if (!cookieBanner) return;
    
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

function rejectCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

// Calculateur
function initializeCalculator() {
    renderServices();
    updateTotal();
}

function renderServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    servicesList.innerHTML = services.map(service => `
        <div class="service-item ${service.selected ? 'selected' : ''}" data-id="${service.id}">
            <div class="service-info">
                <div class="service-name">${service.name}</div>
                <div class="service-description">${service.description}</div>
                <div class="service-price">${service.price}€</div>
            </div>
            <div class="service-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${service.id}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${service.quantity}" min="0" onchange="setQuantity(${service.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${service.id}, 1)">+</button>
                </div>
                <input type="checkbox" class="service-checkbox" ${service.selected ? 'checked' : ''} onchange="toggleService(${service.id})">
            </div>
        </div>
    `).join('');
}

function toggleService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        service.selected = !service.selected;
        if (!service.selected) {
            service.quantity = 0;
        } else if (service.quantity === 0) {
            service.quantity = 1;
        }
        renderServices();
        updateTotal();
    }
}

function updateQuantity(serviceId, change) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        service.quantity = Math.max(0, service.quantity + change);
        service.selected = service.quantity > 0;
        renderServices();
        updateTotal();
    }
}

function setQuantity(serviceId, value) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        service.quantity = Math.max(0, parseInt(value) || 0);
        service.selected = service.quantity > 0;
        renderServices();
        updateTotal();
    }
}

function updateTotal() {
    const total = services.reduce((sum, service) => {
        return sum + (service.selected ? service.price * service.quantity : 0);
    }, 0);
    
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        totalElement.textContent = `${total}€`;
    }
}

function requestQuote() {
    const selectedServices = services.filter(s => s.selected);
    if (selectedServices.length === 0) {
        alert('Veuillez sélectionner au moins un service');
        return;
    }
    
    const total = selectedServices.reduce((sum, service) => {
        return sum + service.price * service.quantity;
    }, 0);
    
    const servicesText = selectedServices.map(s => 
        `${s.name} (Quantité: ${s.quantity}) - ${s.price * s.quantity}€`
    ).join('\n');
    
    const emailBody = `Bonjour,\n\nJe souhaite obtenir un devis pour les services suivants :\n\n${servicesText}\n\nTotal estimé : ${total}€\n\nCordialement`;
    
    window.location.href = `mailto:treizelec.pro@gmail.com?subject=Demande de devis&body=${encodeURIComponent(emailBody)}`;
}

// Réalisations
function initializeRealizations() {
    renderRealizations();
    initializeFilters();
}

function renderRealizations(filter = 'all') {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    
    const filteredRealizations = filter === 'all' 
        ? realizations 
        : realizations.filter(r => r.category === filter);
    
    gallery.innerHTML = filteredRealizations.map(realization => `
        <div class="gallery-item fade-in">
            <img src="${realization.image}" alt="${realization.title}">
            <div class="gallery-item-content">
                <div class="gallery-item-category">${realization.category}</div>
                <h3 class="gallery-item-title">${realization.title}</h3>
                <p class="gallery-item-description">${realization.description}</p>
            </div>
        </div>
    `).join('');
    
    // Réinitialiser les animations
    initializeAnimations();
}

function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderRealizations(this.dataset.filter);
        });
    });
}

// Contact
function initializeContact() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validation
    if (!data.name || !data.email || !data.message) {
        showNotificationModal('Champs requis', 'Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    // Simulation d'envoi
    showNotificationModal('Message envoyé', 'Votre message a été envoyé avec succès. Nous vous recontacterons dans les plus brefs délais.', 'success');
    e.target.reset();
}

// Notification Modal
function showNotificationModal(title, message, type = 'success') {
    const modal = document.getElementById('notificationModal');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');
    const icon = modal.querySelector('.notification-icon');

    if (modal && titleElement && messageElement) {
        titleElement.textContent = title;
        messageElement.textContent = message;

        // Changer l'icône selon le type
        if (type === 'error') {
            icon.style.backgroundColor = '#dc3545';
            icon.querySelector('svg').innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>';
        } else {
            icon.style.backgroundColor = 'var(--primary-color)';
            icon.querySelector('svg').innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
        }

        modal.classList.add('show');
    }
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Authentification
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const admin = localStorage.getItem('isAdmin');
    
    if (user) {
        currentUser = JSON.parse(user);
    }
    
    if (admin === 'true') {
        isAdmin = true;
    }
}

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simulation d'authentification
    if (email === 'client@example.com' && password === 'password') {
        currentUser = {
            id: 1,
            name: 'Jean Dupont',
            email: 'client@example.com',
            phone: '06 12 34 56 78'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'espace-client.html';
    } else if (email === 'admin@treize-elec.com' && password === 'admin123') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Email ou mot de passe incorrect');
    }
}

function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

// Admin
function initializeAdmin() {
    if (!isAdmin) {
        // Admin login page not implemented
        console.warn('Admin functionality not available');
        return;
    }

    initializeAdminDashboard();
}

function initializeAdminDashboard() {
    const dashboardNav = document.querySelectorAll('.dashboard-nav .btn');
    dashboardNav.forEach(btn => {
        btn.addEventListener('click', function() {
            dashboardNav.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showDashboardSection(this.dataset.section);
        });
    });
    
    // Afficher la première section par défaut
    showDashboardSection('services');
}

function showDashboardSection(section) {
    const dashboardContent = document.getElementById('dashboardContent');
    
    switch(section) {
        case 'services':
            dashboardContent.innerHTML = renderServicesManager();
            break;
        case 'realizations':
            dashboardContent.innerHTML = renderRealizationsManager();
            break;
        case 'stats':
            dashboardContent.innerHTML = renderStatsManager();
            break;
    }
}

function renderServicesManager() {
    return `
        <div class="services-manager">
            <div class="manager-header">
                <h3>Gestion des Services</h3>
                <button class="btn btn-primary" onclick="showAddServiceModal()">Ajouter un service</button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Catégorie</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(service => `
                        <tr>
                            <td>${service.name}</td>
                            <td>${service.price}€</td>
                            <td>${service.category}</td>
                            <td>
                                <button class="btn btn-small btn-secondary" onclick="editService(${service.id})">Modifier</button>
                                <button class="btn btn-small btn-outline" onclick="deleteService(${service.id})">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderRealizationsManager() {
    return `
        <div class="realizations-manager">
            <div class="manager-header">
                <h3>Gestion des Réalisations</h3>
                <button class="btn btn-primary" onclick="showAddRealizationModal()">Ajouter une réalisation</button>
            </div>
            <div class="realizations-grid">
                ${realizations.map(realization => `
                    <div class="gallery-item">
                        <img src="${realization.image}" alt="${realization.title}">
                        <div class="gallery-item-content">
                            <div class="gallery-item-category">${realization.category}</div>
                            <h3 class="gallery-item-title">${realization.title}</h3>
                            <p class="gallery-item-description">${realization.description}</p>
                            <div class="gallery-item-actions">
                                <button class="btn btn-small btn-secondary" onclick="editRealization(${realization.id})">Modifier</button>
                                <button class="btn btn-small btn-outline" onclick="deleteRealization(${realization.id})">Supprimer</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderStatsManager() {
    return `
        <div class="stats-manager">
            <h3>Statistiques</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Services totaux</h4>
                    <div class="stat-value">${services.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Réalisations totales</h4>
                    <div class="stat-value">${realizations.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Prix moyen</h4>
                    <div class="stat-value">${Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}€</div>
                </div>
            </div>
        </div>
    `;
}

// Modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function showAddServiceModal() {
    // Créer et afficher le modal d'ajout de service
    const modalHtml = `
        <div class="modal" id="addServiceModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Ajouter un service</h3>
                    <button class="modal-close" onclick="hideModal('addServiceModal')">&times;</button>
                </div>
                <form id="addServiceForm">
                    <div class="form-group">
                        <label class="form-label">Nom du service</label>
                        <input type="text" class="form-control" name="name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prix (€)</label>
                        <input type="number" class="form-control" name="price" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Catégorie</label>
                        <select class="form-control" name="category" required>
                            <option value="Installation">Installation</option>
                            <option value="Dépannage">Dépannage</option>
                            <option value="Rénovation">Rénovation</option>
                            <option value="Domotique">Domotique</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Ajouter</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    showModal('addServiceModal');
    
    document.getElementById('addServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newService = {
            id: Math.max(...services.map(s => s.id)) + 1,
            name: formData.get('name'),
            price: parseInt(formData.get('price')),
            category: formData.get('category'),
            description: formData.get('description'),
            quantity: 0,
            selected: false
        };
        
        services.push(newService);
        hideModal('addServiceModal');
        document.getElementById('addServiceModal').remove();
        showDashboardSection('services');
    });
}

function deleteService(serviceId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        services = services.filter(s => s.id !== serviceId);
        showDashboardSection('services');
    }
}

function deleteRealization(realizationId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
        realizations = realizations.filter(r => r.id !== realizationId);
        showDashboardSection('realizations');
    }
}

// Utilitaires
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return re.test(phone);
}

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Initialiser les éléments interactifs
document.addEventListener('click', function(e) {
    // Fermer les modals en cliquant à l'extérieur
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Gestion du redimensionnement
window.addEventListener('resize', function() {
    // Fermer le menu mobile si on passe en desktop
    if (window.innerWidth > 768) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileNav) mobileNav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
});

// Performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}