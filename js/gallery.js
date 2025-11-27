// Funcionalidades da Galeria
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeLightbox();
});

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item, .galeria-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
        
        // Adicionar efeito hover
        item.style.cursor = 'pointer';
        item.style.transition = 'transform 0.3s ease';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeLightbox() {
    // Criar elementos do lightbox se não existirem
    if (!document.getElementById('lightbox')) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <span class="lightbox-prev">&#10094;</span>
                <span class="lightbox-next">&#10095;</span>
                <div class="lightbox-content">
                    <img src="" alt="">
                </div>
                <div class="lightbox-caption"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Adicionar event listeners
        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
}

let currentImageIndex = 0;
let imagesCollection = [];

function openLightbox(src, alt, collection = null) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    // Definir coleção de imagens
    if (collection) {
        imagesCollection = collection;
        currentImageIndex = imagesCollection.findIndex(img => img.src === src);
    } else {
        // Coletar todas as imagens da galeria atual
        const gallery = document.querySelector('.gallery-grid, .galeria-grid');
        if (gallery) {
            imagesCollection = Array.from(gallery.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt
            }));
            currentImageIndex = imagesCollection.findIndex(img => img.src === src);
        } else {
            imagesCollection = [{ src, alt }];
            currentImageIndex = 0;
        }
    }
    
    lightboxImg.src = src;
    caption.textContent = alt;
    lightbox.style.display = 'flex';
    
    document.body.style.overflow = 'hidden';
    
    updateNavigationButtons();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    if (imagesCollection.length <= 1) return;
    
    currentImageIndex = (currentImageIndex - 1 + imagesCollection.length) % imagesCollection.length;
    updateLightboxImage();
}

function showNextImage() {
    if (imagesCollection.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + 1) % imagesCollection.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImg = document.querySelector('#lightbox .lightbox-content img');
    const caption = document.querySelector('#lightbox .lightbox-caption');
    
    lightboxImg.src = imagesCollection[currentImageIndex].src;
    caption.textContent = imagesCollection[currentImageIndex].alt;
    
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const lightbox = document.getElementById('lightbox');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Mostrar/ocultar botões de navegação baseado no número de imagens
    if (imagesCollection.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

// CSS para o lightbox
const lightboxStyles = `
    .lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }
    
    .lightbox-content {
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
    }
    
    .lightbox-prev,
    .lightbox-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: white;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        padding: 16px;
        user-select: none;
        z-index: 10001;
    }
    
    .lightbox-prev {
        left: 20px;
    }
    
    .lightbox-next {
        right: 20px;
    }
    
    .lightbox-caption {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        text-align: center;
        max-width: 80%;
    }
    
    @media (max-width: 768px) {
        .lightbox-prev,
        .lightbox-next {
            font-size: 24px;
            padding: 12px;
        }
        
        .lightbox-close {
            font-size: 30px;
            top: 10px;
            right: 15px;
        }
    }
`;

// Adicionar estilos do lightbox ao documento
const lightboxStyleSheet = document.createElement('style');
lightboxStyleSheet.textContent = lightboxStyles;
document.head.appendChild(lightboxStyleSheet);