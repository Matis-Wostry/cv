# Portfolio CV - Matis Wostry

Je suis Matis Wostry, développeur web full-stack junior.

Ce portfolio est mon CV en ligne : j'y présente mon parcours, mes projets, mes compétences et un moyen simple de me contacter.

## Prise de parole

Je recherche une alternance de 2 ans à Genève à partir de septembre 2026. Je suis motivé, rigoureux, et j'aime construire des solutions web utiles, propres et évolutives.

## Aperçu

- Site statique en HTML, CSS, JavaScript (sans framework).
- Design responsive desktop/mobile.
- Navigation avec ancrages et section active au scroll.
- Animations d'apparition au scroll (IntersectionObserver).
- Thème clair/sombre avec sauvegarde en localStorage.
- Téléchargement du CV PDF statique.
- Formulaire de contact connecté à Formspree (+ fallback mailto).
- Déploiement continu via GitHub Actions vers un serveur personnel.

## Stack technique

- HTML5
- CSS3 (variables CSS, responsive, animations)
- JavaScript Vanilla (DOM, fetch API, observers)
- html2pdf.js (prévu pour génération PDF dynamique) 
- GitHub Actions + rsync + SSH pour le déploiement

## Structure du projet

.
├── index.html
├── style/
│ └── style.css
├── script/
│ └── script.js
├── assets/
│ └── cv/
│   └── CV_Matis_Wostry.pdf
└── .github/
└── workflows/
└── deploy.yml

## Déploiement continu (CI/CD)

Le workflow GitHub Actions est défini dans .github/workflows/deploy.yml.

À chaque push sur la branche main :

1. Le dépôt est récupéré.
2. Connexion SSH au serveur.
3. Synchronisation des fichiers via rsync.
4. Reload de Caddy dans le conteneur Docker.

Secrets GitHub attendus :

- SSH_PRIVATE_KEY
- SSH_KNOWN_HOSTS
- SSH_PORT
- SSH_TARGET
- SSH_LOGIN

## Auteur

Matis Wostry

- Site : https://matis-wostry.com/
- GitHub : https://github.com/wostry
- LinkedIn : https://linkedin.com/in/matis-wostry
