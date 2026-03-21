import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useAnimations = () => {
  useEffect(() => {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      // Interactive elements hover
      document.querySelectorAll('a, button').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
          gsap.to(cursor, { scale: 1.5, duration: 0.2 });
        });
        elem.addEventListener('mouseleave', () => {
          gsap.to(cursor, { scale: 1, duration: 0.2 });
        });
      });
    }

    // Navigation animation
    gsap.from('nav', {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Hero content animations
    gsap.from('.hero-text h1', {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    });

    gsap.from('.hero-text p', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });

    gsap.from('.hero-buttons', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      ease: 'power3.out'
    });

    // Floating cards animations
    gsap.from('.card-1', {
      x: -200,
      opacity: 0,
      rotation: -20,
      duration: 1.2,
      delay: 0.5,
      ease: 'power3.out'
    });

    gsap.from('.card-2', {
      x: 200,
      opacity: 0,
      rotation: 20,
      duration: 1.2,
      delay: 0.7,
      ease: 'power3.out'
    });

    gsap.from('.card-3', {
      y: 200,
      opacity: 0,
      rotation: -10,
      duration: 1.2,
      delay: 0.9,
      ease: 'power3.out'
    });

    // Floating animation for cards
    gsap.to('.card-1', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.card-2', {
      y: -30,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.card-3', {
      y: -25,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Background elements animation
    gsap.to('.bg-1', {
      x: 50,
      y: 50,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.bg-2', {
      x: -50,
      y: -50,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Stats counter animation
    ScrollTrigger.create({
      trigger: '.stats',
      start: 'top 80%',
      onEnter: () => {
        document.querySelectorAll('.stat-number').forEach(stat => {
          const target = stat.textContent;
          const isPercentage = target.includes('%');
          const number = parseInt(target.replace(/[^\d]/g, ''));

          gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = Math.ceil(this.targets()[0].textContent);
              if (isPercentage) {
                stat.textContent = current + '%';
              } else if (number >= 1000) {
                stat.textContent = (current / 1000).toFixed(1) + 'K+';
              } else {
                stat.textContent = current + '+';
              }
            }
          });
        });
      }
    });

    // Steps animation
    gsap.from('.step', {
      scrollTrigger: {
        trigger: '.steps',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      x: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Features cards animation
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // CTA section animation
    gsap.from('.cta-content h2', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    });

    gsap.from('.cta-content p', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.cta-buttons', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: 'power3.out'
    });

    // Parallax effect for sections
    gsap.utils.toArray('.section-title').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: target,
            ease: 'power3.inOut'
          });
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};