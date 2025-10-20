// ============================================
// PDF GENERATION (html2pdf.js)
// ============================================
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function() {
        // Désactiver le bouton pendant la génération
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.textContent = '⏳ Génération du PDF...';
        
        // Sélectionner le contenu à convertir (tout le main)
        const element = document.querySelector('main');
        
        // Options de configuration du PDF
        const options = {
            margin: [10, 15, 10, 15], // [haut, droite, bas, gauche] en mm
            filename: 'CV-Wostry-Matis.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: 'section'
            }
        };
        
        // Ajouter une classe temporaire pour le style PDF
        document.body.classList.add('pdf-generating');
        
        // Générer et télécharger le PDF
        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                // Réactiver le bouton après génération
                downloadPdfBtn.disabled = false;
                downloadPdfBtn.textContent = '📄 Télécharger le CV (PDF)';
                document.body.classList.remove('pdf-generating');
            })
            .catch((error) => {
                console.error('Erreur lors de la génération du PDF:', error);
                downloadPdfBtn.disabled = false;
                downloadPdfBtn.textContent = '❌ Erreur - Réessayer';
                document.body.classList.remove('pdf-generating');
                
                // Réinitialiser le texte après 3 secondes
                setTimeout(() => {
                    downloadPdfBtn.textContent = '📄 Télécharger le CV (PDF)';
                }, 3000);
            });
    });
}

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Détecte le thème préféré du système
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Charge le thème depuis localStorage ou utilise la préférence système
const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
html.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.setAttribute('aria-current', 'true');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ============================================
// CONTACT FORM HANDLING
// INSTRUCTIONS: Remplacez CONTACT_ENDPOINT par votre URL Formspree/FormSubmit
// ============================================
const CONTACT_ENDPOINT = 'https://formspree.io/f/xanpzqln'; // <-- Remplacez YOUR_FORM_ID
// Ou utilisez FormSubmit: 'https://formsubmit.co/your@email.com'

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Afficher un état de chargement
    formStatus.textContent = '⏳ Envoi en cours...';
    formStatus.className = 'form-status';
    formStatus.style.display = 'block';
    
    try {
        // Option 1: Utiliser fetch avec Formspree/FormSubmit
        const response = await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            formStatus.textContent = '✅ Message envoyé avec succès !';
            formStatus.className = 'form-status success';
            contactForm.reset();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        // Fallback: utiliser mailto si le service externe échoue
        formStatus.textContent = '⚠️ Service indisponible. Redirection vers votre client email...';
        formStatus.className = 'form-status error';
        
        setTimeout(() => {
            const subject = encodeURIComponent('Contact depuis votre CV');
            const body = encodeURIComponent(`Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
            window.location.href = `mailto:matiswostry.pro@gmail.com?subject=${subject}&body=${body}`;
        }, 2000);
    }
});

// ============================================
// SMOOTH SCROLL POLYFILL (pour anciens navigateurs)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PRINT HELPER (pour bouton PDF)
// ============================================
// Le bouton "Télécharger le CV (PDF)" utilise window.print()
// Pour exporter en PDF:
// 1. Cliquez sur le bouton
// 2. Dans la boîte de dialogue d'impression, choisissez "Enregistrer au format PDF"
// 3. Ajustez les marges si nécessaire
// Le style @media print est déjà optimisé pour l'impression A4