// ============================================
// PDF GENERATION (html2pdf.js)
// ============================================
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async function() {
        // Désactiver le bouton pendant la génération
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.textContent = '⏳ Génération du PDF...';
        
        // Ajouter la classe pour les styles PDF
        document.body.classList.add('pdf-generating');
        
        // Attendre que les styles soient appliqués
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Cloner le main pour manipulation sans affecter la page
        const element = document.querySelector('main').cloneNode(true);
        
        // Supprimer les éléments indésirables du clone
        const elementsToRemove = element.querySelectorAll('.hero-cta, .btn, .project-links, .contact-form');
        elementsToRemove.forEach(el => el.remove());
        
        // Options de configuration du PDF optimisées
        const options = {
            margin: [10, 15, 10, 15], // Marges augmentées [haut, droite, bas, gauche] en mm
            filename: 'CV-Wostry-Matis.pdf',
            image: { 
                type: 'jpeg', 
                quality: 1 // Qualité maximale
            },
            html2canvas: { 
                scale: 2.5, // Réduit légèrement pour éviter débordement
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff',
                removeContainer: true,
                imageTimeout: 0,
                scrollY: 0,
                scrollX: 0,
                windowWidth: 1000, // Réduit pour éviter débordement
                x: 0,
                y: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true,
                precision: 16
            },
            pagebreak: { 
                mode: ['avoid-all', 'css'],
                avoid: ['section', '.timeline-item', '.project-item', '.education-item']
            }
        };
        
        try {
            // Générer et télécharger le PDF
            await html2pdf()
                .set(options)
                .from(element)
                .save();
            
            // Réactiver le bouton après génération
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.textContent = '✅ PDF téléchargé !';
            document.body.classList.remove('pdf-generating');
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                downloadPdfBtn.textContent = '📄 Télécharger le CV (PDF)';
            }, 3000);
            
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.textContent = '❌ Erreur - Réessayer';
            document.body.classList.remove('pdf-generating');
            
            // Réinitialiser le texte après 3 secondes
            setTimeout(() => {
                downloadPdfBtn.textContent = '📄 Télécharger le CV (PDF)';
            }, 3000);
        }
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
// MENU TOGGLE (amélioré pour animation + accessibilité)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.querySelector('.hamburger input[type="checkbox"]');
  const navOrdi  = document.querySelector('.nav-ordi');
  if (!checkbox || !navOrdi) return;

  const setOpenState = (isOpen) => {
    navOrdi.classList.toggle('is-visible', isOpen);
    checkbox.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // empêche le scroll de fond quand menu ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  // synchronise l'état initial (utile si persisté)
  setOpenState(!!checkbox.checked);

  // ouvre/ferme au clic
  checkbox.addEventListener('change', () => {
    setOpenState(checkbox.checked);
  });

  // ferme le menu quand on clique sur un lien (pratique sur mobile)
  navOrdi.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      checkbox.checked = false;
      setOpenState(false);
    });
  });

  // ferme le menu si on touche en dehors (pour UX mobile)
  document.addEventListener('click', (e) => {
    if (!navOrdi.contains(e.target) && !e.target.closest('.hamburger')) {
      if (checkbox.checked) {
        checkbox.checked = false;
        setOpenState(false);
      }
    }
  });
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