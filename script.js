// Основные переменные - Updated: SCRIPTDIKO fixed
let isVideoPlaying = true;
let isSoundEnabled = false;
let animationFrameId = null;

// DOM элементы
const bgVideo = document.getElementById('bg-video');
const soundToggle = document.getElementById('sound-toggle');
const videoToggle = document.getElementById('video-toggle');
const navbar = document.querySelector('.navbar');
const statNumbers = document.querySelectorAll('.stat-number');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeVideo();
    initializeScrollEffects();
    initializeAnimations();
    initializeCounters();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    // initializeTypingEffect(); // Убираем анимацию печатания
    initializeMagneticButtons();
    
    // Показываем контент после загрузки с анимацией
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Инициализация видео
function initializeVideo() {
    if (bgVideo) {
        // Включаем звук по умолчанию (но muted для автозапуска)
        bgVideo.muted = true;
        bgVideo.volume = 0.3; // Низкая громкость для фона
        
        // Обработка ошибок видео
        bgVideo.addEventListener('error', function() {
            console.warn('Ошибка загрузки видео, используем статичный фон');
            document.querySelector('.video-background').style.background = 
                'linear-gradient(135deg, #2a2a2a, #3a3a3a)';
        });
        
        // Обработка загрузки видео
        bgVideo.addEventListener('loadeddata', function() {
            console.log('Видео загружено успешно');
        });
    }
}

// Инициализация эффектов скролла
function initializeScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Эффект навбара при скролле
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Параллакс эффект для видео
        if (bgVideo) {
            const parallaxSpeed = 0.5;
            const yPos = -(scrollTop * parallaxSpeed);
            bgVideo.style.transform = `translateY(${yPos}px)`;
        }
        
        lastScrollTop = scrollTop;
    });
}

// Инициализация анимаций
function initializeAnimations() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Специальные анимации для разных элементов
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                } else if (entry.target.classList.contains('command-item')) {
                    animateCommandItem(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const animatedElements = document.querySelectorAll('.feature-card, .command-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Анимация карточек функций
function animateFeatureCard(card) {
    const icon = card.querySelector('.feature-icon');
    if (icon) {
        icon.style.animation = 'float 3s ease-in-out infinite';
    }
}

// Анимация элементов команд
function animateCommandItem(item) {
    item.style.animation = 'fadeInUp 0.5s ease forwards';
}

// Инициализация счетчиков
function initializeCounters() {
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // Форматируем числа с разделителями тысяч
            const formattedNumber = Math.floor(current).toLocaleString('ru-RU');
            element.textContent = formattedNumber;
        }, 16);
    };
    
    // Запускаем счетчики при появлении в viewport
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

// Инициализация обработки форм
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Анимация отправки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
                submitBtn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Инициализация плавной прокрутки
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Учитываем высоту навбара
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Инициализация параллакс эффектов
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Управление звуком
soundToggle.addEventListener('click', function() {
    if (bgVideo) {
        isSoundEnabled = !isSoundEnabled;
        bgVideo.muted = !isSoundEnabled;
        
        const icon = this.querySelector('i');
        if (isSoundEnabled) {
            icon.className = 'fas fa-volume-up';
            this.classList.add('active');
        } else {
            icon.className = 'fas fa-volume-mute';
            this.classList.remove('active');
        }
    }
});

// Управление видео
videoToggle.addEventListener('click', function() {
    if (bgVideo) {
        isVideoPlaying = !isVideoPlaying;
        
        const icon = this.querySelector('i');
        if (isVideoPlaying) {
            bgVideo.play();
            icon.className = 'fas fa-video';
            this.classList.add('active');
        } else {
            bgVideo.pause();
            icon.className = 'fas fa-video-slash';
            this.classList.remove('active');
        }
    }
});

// Эффект печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Эффект частиц
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--orange-primary);
        border-radius: 50%;
        opacity: 0.6;
        animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(particle);
}

// Эффект свечения для кнопок
function addGlowEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(255, 140, 66, 0.5)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Инициализация дополнительных эффектов
document.addEventListener('DOMContentLoaded', function() {
    addGlowEffect();
    createParticles();
    
    // Эффект печатания для главного заголовка
    const mainTitle = document.querySelector('.title-main');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, originalText, 150);
        }, 1000);
    }
});

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    // Пересчитываем позиции элементов при изменении размера
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        // Обновляем анимации при изменении размера
        const animatedElements = document.querySelectorAll('.feature-card, .command-item');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Принудительный reflow
            el.style.animation = null;
        });
    });
});

// Предзагрузка изображений и ресурсов
function preloadResources() {
    const resources = [
        'diko.mp4'
    ];
    
    resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.mp4') ? 'video' : 'image';
        document.head.appendChild(link);
    });
}

// Инициализация предзагрузки
preloadResources();

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Ошибка JavaScript:', e.error);
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', function(e) {
    console.error('Необработанное отклонение промиса:', e.reason);
});

// Убираем систему частиц - мешает чтению

// Убираем эффект печатания - заголовок статичный

// Магнитные кнопки
function initializeMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Убираем глитч-эффект - мешает чтению

// Убираем matrix rain - мешает чтению

// Простые анимации при скролле - без избыточности
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Простая анимация появления
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const animatedElements = document.querySelectorAll('.feature-card, .command-item, .contact-item, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Эффект волны для кнопок
function addWaveEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Добавляем CSS для ripple эффекта
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);

// Инициализация дополнительных эффектов
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    addWaveEffect();
});

// Экспорт функций для возможного использования
window.SiteControls = {
    toggleSound: () => soundToggle.click(),
    toggleVideo: () => videoToggle.click(),
    scrollToSection: (sectionId) => {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },
    triggerGlitch: () => {
        const title = document.querySelector('.title-main');
        if (title) {
            title.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => title.style.animation = '', 300);
        }
    }
};
