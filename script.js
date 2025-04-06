// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to scroll to contact section
function scrollToContact() {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile menu functionality
const menuButton = document.getElementById('menuButton');
const menuIcon = document.getElementById('menuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

function toggleMenu() {
    menuIcon.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.classList.toggle('hidden');
}

menuButton.addEventListener('click', toggleMenu);

// Close menu when clicking a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    }
});

// Portfolio filtering functionality
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');
let currentCategory = 'all';

portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Update active filter button
        portfolioFilters.forEach(f => {
            f.classList.remove('bg-primary', 'text-white');
            f.classList.add('text-gray-700', 'hover:bg-gray-200');
        });
        filter.classList.remove('text-gray-700', 'hover:bg-gray-200');
        filter.classList.add('bg-primary', 'text-white');

        currentCategory = filter.getAttribute('data-category');

        // Filter portfolio items with animation
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (currentCategory === 'all' || itemCategory === currentCategory) {
                item.classList.remove('hidden');
                // Add a small delay to ensure the transition works
                setTimeout(() => {
                    item.classList.remove('opacity-0', 'scale-80');
                    item.classList.add('opacity-100', 'scale-100');
                }, 50);
            } else {
                item.classList.add('opacity-0', 'scale-80');
                // Add a small delay before hiding to allow for animation
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });

        // Reset show more/less state when filtering
        showingAll = false;
        togglePortfolioBtn.textContent = 'View All Projects';
        updatePortfolioItems();
    });
});

// Portfolio show more/less functionality
const togglePortfolioBtn = document.getElementById('togglePortfolio');
const itemsPerPage = 6;
let showingAll = false;

function updatePortfolioItems() {
    const visibleItems = Array.from(portfolioItems).filter(item => {
        const itemCategory = item.getAttribute('data-category');
        return (currentCategory === 'all' || itemCategory === currentCategory) && !item.classList.contains('hidden');
    });

    visibleItems.forEach((item, index) => {
        if (index < itemsPerPage) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function togglePortfolioItems() {
    showingAll = !showingAll;
    const visibleItems = Array.from(portfolioItems).filter(item => {
        const itemCategory = item.getAttribute('data-category');
        return (currentCategory === 'all' || itemCategory === currentCategory);
    });
    
    visibleItems.forEach((item, index) => {
        if (showingAll) {
            // Show all items when "View All Projects" is clicked
            item.classList.remove('hidden');
        } else {
            // Show only first 6 items when "Show Less" is clicked
            if (index < itemsPerPage) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    });
    togglePortfolioBtn.textContent = showingAll ? 'Show Less' : 'View All Projects';
}

// Initialize portfolio items
updatePortfolioItems();

// Add click event listener to toggle button
togglePortfolioBtn.addEventListener('click', togglePortfolioItems);

// Contact form functionality
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('hidden');
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('formSuccess').classList.add('hidden');
    document.getElementById('formError').classList.add('hidden');
    ['nameError', 'emailError', 'phoneError', 'projectError'].forEach(hideError);
}

async function handleSubmit(event) {
    event.preventDefault();
    
    // Reset previous errors
    ['nameError', 'emailError', 'phoneError', 'projectError'].forEach(hideError);
    document.getElementById('formError').classList.add('hidden');
    document.getElementById('formSuccess').classList.add('hidden');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const project = document.getElementById('project').value.trim();
    const newsletter = document.getElementById('newsletter').checked;

    // Validate inputs
    let isValid = true;

    if (name.length < 2) {
        showError('nameError', 'Please enter a valid name');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    if (project.length < 10) {
        showError('projectError', 'Please provide more details about your project');
        isValid = false;
    }

    if (!isValid) return false;

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const submitButtonText = document.getElementById('submitButtonText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    submitButton.disabled = true;
    submitButtonText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');

    try {
        // Send data to backend
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                project,
                newsletter
            })
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            document.getElementById('formSuccess').classList.remove('hidden');
            resetForm();
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        // Show error message
        document.getElementById('formError').classList.remove('hidden');
        document.getElementById('errorMessage').textContent = error.message || 'Failed to send message. Please try again later.';
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButtonText.classList.remove('hidden');
        submitSpinner.classList.add('hidden');
    }

    return false;
}

// Newsletter subscription functionality
async function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value.trim();
    const submitButton = document.querySelector('#newsletterForm button[type="submit"]');
    const buttonText = document.getElementById('newsletterButtonText');
    const spinner = document.getElementById('newsletterSpinner');
    const successMessage = document.getElementById('newsletterSuccess');
    const errorMessage = document.getElementById('newsletterError');

    // Reset messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    // Show loading state
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            successMessage.classList.remove('hidden');
            document.getElementById('newsletterForm').reset();
        } else {
            throw new Error(data.error || 'Failed to subscribe to newsletter');
        }
    } catch (error) {
        errorMessage.textContent = error.message || 'Failed to subscribe. Please try again later.';
        errorMessage.classList.remove('hidden');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }

    return false;
} 