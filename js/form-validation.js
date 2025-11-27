// Validação de Formulário de Contato
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('form-contato');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                // Simular envio do formulário
                submitContactForm(this);
            }
        });
    }

    // Validação em tempo real
    const formInputs = document.querySelectorAll('#form-contato input, #form-contato textarea, #form-contato select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Limpar erros anteriores
    clearAllErrors(form);
    
    // Validar campos obrigatórios
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar email se preenchido
    const emailField = form.querySelector('#email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Por favor, insira um email válido');
        isValid = false;
    }
    
    // Validar telefone
    const phoneField = form.querySelector('#telefone');
    if (phoneField.value.replace(/\D/g, '').length < 10) {
        showFieldError(phoneField, 'Por favor, insira um telefone válido');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Por favor, insira um email válido');
        return false;
    }
    
    if (field.id === 'telefone' && value && value.replace(/\D/g, '').length < 10) {
        showFieldError(field, 'Por favor, insira um telefone válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    // Remover erro anterior
    clearFieldError(field);
    
    // Adicionar classe de erro
    field.classList.add('error');
    
    // Criar elemento de erro
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        display: block;
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearAllErrors(form) {
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
    
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(error => {
        error.remove();
    });
}

function submitContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Desabilitar botão
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Simular envio (substituir por AJAX real)
    setTimeout(() => {
        // Aqui você faria a requisição AJAX para o backend
        console.log('Dados do formulário:', Object.fromEntries(formData));
        
        // Mostrar mensagem de sucesso
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Resetar formulário
        form.reset();
        
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensagem';
        
        // Opcional: Redirecionar ou fazer outra ação
    }, 2000);
}

// CSS adicional para erros de formulário
const errorStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336 !important;
        background-color: #fff5f5;
    }
    
    .field-error {
        display: block;
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 5px;
    }
`;

// Adicionar estilos de erro ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);