// ==================== MENU MOBILE ====================
document.addEventListener('DOMContentLoaded', function() {
    // Criar elementos do menu mobile
    createMobileMenu();
    
    // Selecionar elementos
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav a');
    
    // Abrir menu
    mobileMenuToggle.addEventListener('click', function() {
        toggleMenu(true);
    });
    
    // Fechar menu ao clicar no overlay
    mobileMenuOverlay.addEventListener('click', function() {
        toggleMenu(false);
    });
    
    // Fechar menu ao clicar no botão fechar
    mobileMenuClose.addEventListener('click', function() {
        toggleMenu(false);
    });
    
    // Fechar menu ao clicar em um link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu(false);
        });
    });
    
    // Função para toggle do menu
    function toggleMenu(open) {
        if (open) {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Ajustar ao redimensionar janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
});

// Função para criar elementos do menu mobile
function createMobileMenu() {
    // Verificar se já existe
    if (document.querySelector('.mobile-menu')) return;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Criar menu mobile
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Criar botão fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.setAttribute('aria-label', 'Fechar menu');
    
    // Clonar navegação
    const nav = document.querySelector('.header .nav');
    const mobileNav = nav.cloneNode(true);
    
    // Criar CTA mobile
    const mobileCta = document.createElement('div');
    mobileCta.className = 'mobile-menu-cta';
    mobileCta.innerHTML = `
        <a href="https://wa.me/5512982510015?text=Olá! Gostaria de agendar um horário" class="btn btn-primary">
            Agendar Horário
        </a>
    `;
    
    // Montar menu
    mobileMenu.appendChild(closeBtn);
    mobileMenu.appendChild(mobileNav);
    mobileMenu.appendChild(mobileCta);
    
    // Adicionar ao body
    document.body.appendChild(mobileMenu);
}

// ==================== HEADER SCROLL ====================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Adicionar sombra ao rolar
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
    }
    
    lastScroll = currentScroll;
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==================== LAZY LOADING IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ACTIVE LINK ====================
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav a');
    
    links.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveLink();

// ==================== TOUCH GESTURES ====================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const swipeThreshold = 50;
    
    // Swipe da esquerda para direita (abrir menu)
    if (touchEndX > touchStartX + swipeThreshold && touchStartX < 50) {
        if (!mobileMenu.classList.contains('active')) {
            const event = new Event('click');
            document.querySelector('.mobile-menu-toggle').dispatchEvent(event);
        }
    }
    
    // Swipe da direita para esquerda (fechar menu)
    if (touchStartX > touchEndX + swipeThreshold) {
        if (mobileMenu.classList.contains('active')) {
            const event = new Event('click');
            document.querySelector('.mobile-menu-overlay').dispatchEvent(event);
        }
    }
}

// ==================== PREVENT SCROLL BOUNCE ====================
document.addEventListener('touchmove', function(e) {
    const target = e.target;
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Prevenir bounce apenas se o menu mobile estiver ativo
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(target)) {
            e.preventDefault();
        }
    }
}, { passive: false });

// ==================== PERFORMANCE ====================
// Adicionar will-change para elementos animados
const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .highlight-card');
animatedElements.forEach(el => {
    el.style.willChange = 'transform';
});

// Remover will-change após animação
document.addEventListener('scroll', function() {
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(function() {
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });
    }, 500);
});

console.log('🎨 Studio Cláudia - Mobile App Ready!');