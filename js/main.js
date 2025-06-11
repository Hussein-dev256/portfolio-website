// main.js - For interactive functionalities

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('#main-header nav ul li a, .logo-link'); // Include logo link for hero scroll
    const sections = document.querySelectorAll('main section');
    const menuToggle = document.querySelector('.menu-toggle'); 
    const navUl = document.querySelector('#main-header nav ul');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    let headerOffset = header ? header.offsetHeight : 70;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open and active
                    if (navUl && navUl.classList.contains('active')) {
                        navUl.classList.remove('active');
                        if (menuToggle) menuToggle.classList.remove('active'); 
                    }
                }
            }
        });
    });



    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    function toggleMobileMenu() {
        const isExpanded = mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active', isExpanded);
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        
        // Toggle between menu and close icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                // Focus on first nav item when opening
                const firstNavItem = mainNav.querySelector('a');
                if (firstNavItem) {
                    setTimeout(() => firstNavItem.focus(), 100);
                }
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        }
    }
    
    function closeMobileMenu() {
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }
    
    if (mobileMenuBtn && mainNav && menuOverlay) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a nav link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
            
            // Add keyboard navigation
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                    mobileMenuBtn.focus();
                }
            });
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileMenu();
                mobileMenuBtn.focus();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInside = mainNav.contains(e.target) || mobileMenuBtn.contains(e.target);
            if (!isClickInside && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // TODO: Add image hover effect logic for black & white to color
    // Intersection Observer for scroll animations
    const sectionsToAnimate = document.querySelectorAll('main > section');
    
    const sectionObserverOptions = {
        root: null, // relative to document viewport 
        rootMargin: '0px',
        threshold: 0.1 // 10% of section visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, sectionObserverOptions);

    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in-section'); // Add base class for styling
        sectionObserver.observe(section);
    });

    // === Update active nav link on scroll and click ===
    const sectionNavObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // section mostly in view
    };

    // Function to update active nav link
    const updateActiveNav = (targetId) => {
        // Remove active from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active to corresponding link
        if (targetId === 'home' || targetId === '') {
            // Special case for home
            const homeLink = document.querySelector(`#main-header nav ul li a[href="#"], 
                                                 #main-header nav ul li a[href="/"],
                                                 #main-header nav ul li a[href="#home"]`);
            if (homeLink) homeLink.classList.add('active');
        } else if (targetId) {
            const activeLink = document.querySelector(`#main-header nav ul li a[href="#${targetId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    };

    // Handle scroll-based activation
    const sectionNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNav(id);
            }
        });
    }, sectionNavObserverOptions);

    // Observe all sections
    sections.forEach(sec => sectionNavObserver.observe(sec));

    // Handle direct link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1); // Remove '#'
                updateActiveNav(targetId);
            }
        });
    });

    // Set home as active by default if at top of page
    if (window.scrollY < 100) {
        updateActiveNav('home');
    }

    console.log('Portfolio script loaded. Please ensure you have a .menu-toggle element in your HTML for mobile.');
});
