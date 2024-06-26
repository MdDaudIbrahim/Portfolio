'use strict';

(() => {
  // Utility functions
  const debounce = (func, wait = 20, immediate = true) => {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // DOM elements
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section');
  const skillLevels = document.querySelectorAll('.skill-level');
  const form = document.querySelector('.contact-form');
  const shapes = document.querySelectorAll('.shape');
  const projectItems = document.querySelectorAll('.project');

  // Smooth scrolling
  const smoothScroll = (target) => {
    const targetSection = document.querySelector(target);
    window.scrollTo({
      top: targetSection.offsetTop - header.offsetHeight,
      behavior: 'smooth'
    });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      smoothScroll(target);
    });
  });

  // Intersection Observer for nav highlight and section animations
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = document.querySelector(`nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLink.classList.add('active');
        entry.target.classList.add('in-view');
      } else {
        navLink.classList.remove('active');
        if (entry.boundingClientRect.top > 0) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // Sticky header
  const stickyHeader = new IntersectionObserver(
    ([e]) => header.classList.toggle('sticky', !e.isIntersecting),
    { threshold: [0], rootMargin: `-${header.offsetHeight}px 0px 0px 0px` }
  );

  stickyHeader.observe(document.querySelector('#home'));

  // Parallax effect for shapes
  const parallaxShapes = () => {
    const top = window.pageYOffset;
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.2;
      const yPos = -(top * speed);
      shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  };

  window.addEventListener('scroll', debounce(parallaxShapes));

  // Skill bar animation
  const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const level = skill.getAttribute('data-level');
        skill.style.width = `${level}%`;
        skill.style.opacity = 1;
        observer.unobserve(skill);
      }
    });
  };

  const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.5,
  });

  skillLevels.forEach(skill => {
    skill.style.width = '0%';
    skill.style.opacity = 0;
    skillObserver.observe(skill);
  });

  // Project hover effects
  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.project-description').style.opacity = 1;
      item.querySelector('.project-description').style.transform = 'translateY(0)';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.project-description').style.opacity = 0;
      item.querySelector('.project-description').style.transform = 'translateY(20px)';
    });
  });

  // Form validation and submission
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 100);
  };

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Form submitted successfully!', 'success');
      form.reset();
    } catch (error) {
      showNotification('An error occurred. Please try again.', 'error');
    }
  });

  // Custom cursor
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  const updateCursor = (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  };

  document.addEventListener('mousemove', updateCursor);

  document.querySelectorAll('a, button, .project').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });

  // Typing effect for hero section
  const heroText = document.querySelector('.hero-text');
  const text = heroText.textContent;
  heroText.textContent = '';
  let index = 0;

  const typeText = () => {
    if (index < text.length) {
      heroText.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, Math.random() * 150 + 50);
    }
  };

  typeText();

  // Lazy loading images
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          img.setAttribute('src', src);
          img.classList.add('fade-in');

          observer.disconnect();
        }
      });
    });

    io.observe(target);
  };

  lazyImages.forEach(lazyLoad);

  // Smooth reveal animation for elements
  const revealElements = document.querySelectorAll('.reveal');

  const revealElement = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealElement, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => revealObserver.observe(element));

  // Theme switcher
  const themeSwitcher = document.createElement('button');
  themeSwitcher.textContent = '🌓';
  themeSwitcher.classList.add('theme-switcher');
  document.body.appendChild(themeSwitcher);

  themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Easter egg: Konami Code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  const activateEasterEgg = () => {
    document.body.classList.add('easter-egg');
    showNotification('Easter egg activated!', 'success');
    setTimeout(() => document.body.classList.remove('easter-egg'), 10000);
  };

  // Performance optimization: Use requestAnimationFrame for smooth animations
  let ticking = false;
  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

  const updateAnimations = () => {
    parallaxShapes();
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      raf(updateAnimations);
      ticking = true;
    }
  });

  // Initialize AOS (Animate On Scroll) library if it's included
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }
})();