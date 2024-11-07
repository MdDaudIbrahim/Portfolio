let skill = ['HTML', 'CSS', 'JavaScript']; // Adjust values as needed


// Utility functions
const debounce = (func, wait = 20) => {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const elements = {
    header: document.querySelector('header'),
    navLinks: document.querySelectorAll('nav a[href^="#"]'),
    sections: document.querySelectorAll('section'),
    skillLevels: document.querySelectorAll('.skill-level'),
    shapes: document.querySelectorAll('.shape'),
    mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
    navMenu: document.querySelector('nav ul'),
    hamburger: document.querySelector('.hamburger'),
    navContainer: document.querySelector('.nav-container'),
    lazyImages: document.querySelectorAll('img[data-src]')
  };

  let lastScrollY = window.scrollY;
  const isMobile = () => window.innerWidth <= 768;

  // Smooth scrolling with performance optimization
  const initSmoothScrolling = () => {
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          // Use requestAnimationFrame for smoother scrolling
          const targetPosition = target.offsetTop - elements.header.offsetHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (isMobile()) {
            toggleMobileMenu(false);
          }
        }
      });
    });
  };

  // Intersection Observer setup with performance optimizations
  const setupIntersectionObservers = () => {
    // Use a single observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const navLink = document.querySelector(`nav a[href="#${id}"]`);
        if (navLink) {
          if (entry.isIntersecting) {
            navLink.classList.add('active');
            entry.target.classList.add('in-view');
          } else {
            navLink.classList.remove('active');
            entry.target.classList.remove('in-view');
          }
        }
      });
    }, { 
      rootMargin: '-50% 0px -50% 0px',
      threshold: [0, 0.1, 0.5] // More precise tracking
    });

    if (!isMobile() && elements.sections.length) {
      elements.sections.forEach(section => sectionObserver.observe(section));
    }

    // Optimize skill bars animation
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            const skill = entry.target;
            skill.style.width = skill.getAttribute('data-level') + '%';
            skill.style.opacity = 1;
          });
          skillObserver.unobserve(skill);
        }
      });
    }, { threshold: 0.2 });

    elements.skillLevels.forEach(skill => {
      skill.style.width = '0%';
      skill.style.opacity = 0;
      skillObserver.observe(skill);
    });
  };

  // Optimized scroll handling
  const handleScroll = debounce(() => {
    const currentScroll = window.scrollY;
    
    // Handle header visibility
    if (isMobile()) {
      if (currentScroll > lastScrollY && currentScroll > 50) {
        elements.header.classList.add('hidden');
      } else {
        elements.header.classList.remove('hidden');
      }
    }

    // Handle navbar shadow and position
    if (currentScroll > 0) {
      elements.navContainer?.classList.add('scroll-shadow');
    } else {
      elements.navContainer?.classList.remove('scroll-shadow');
    }

    // Optimize parallax effect
    if (!isMobile() && elements.shapes.length) {
      requestAnimationFrame(() => {
        elements.shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.15;
          shape.style.transform = `translateY(${currentScroll * speed}px)`;
        });
      });
    }

    lastScrollY = currentScroll;
  }, 10);

  // Mobile menu handling
  const toggleMobileMenu = (force = null) => {
    const isOpen = force !== null ? force : !elements.navMenu.classList.contains('active');
    elements.hamburger?.classList.toggle('active', isOpen);
    elements.navMenu?.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  };

  // Theme switcher
  const initThemeSwitcher = () => {
    const themeSwitcher = document.createElement('button');
    themeSwitcher.classList.add('theme-switcher');
    themeSwitcher.textContent = '🌓';
    document.body.appendChild(themeSwitcher);

    themeSwitcher.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', 
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
      );
    });

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
  };

  // Lazy loading images
  const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Use native lazy loading if available
      elements.lazyImages.forEach(img => {
        img.loading = 'lazy';
        img.src = img.dataset.src;
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
          }
        });
      });

      elements.lazyImages.forEach(img => imageObserver.observe(img));
    }
  };

  // Initialize everything
  const init = () => {
    initSmoothScrolling();
    setupIntersectionObservers();
    initThemeSwitcher();
    initLazyLoading();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    elements.mobileMenuToggle?.addEventListener('click', () => toggleMobileMenu());

    // Clean up on resize
    window.addEventListener('resize', debounce(() => {
      handleScroll();
      setupIntersectionObservers();
    }, 250));
  };

  init();
});

entries.forEach(entry => {
    if (entry.isIntersecting && entry.target instanceof Element) {
      requestAnimationFrame(() => {
        const skill = entry.target;
        skill.style.width = skill.getAttribute('data-level') + '%';
        skill.style.opacity = 1;
      });
      skillObserver.unobserve(entry.target); // Only unobserve if it's an Element
    }
});
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target instanceof Element) {
      const skill = entry.target;
      skill.style.width = skill.getAttribute('data-level') + '%';
      skill.style.opacity = 1;
      skillObserver.unobserve(skill);
    }
  });
}, { threshold: 0.1 }); // Trigger sooner
  
