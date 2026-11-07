# Portfolio CV - Matis Wostry

Je suis Matis Wostry, développeur web full-stack junior.

Ce portfolio est mon CV en ligne : j'y présente mon parcours, mes projets, mes compétences et un moyen simple de me contacter.

## Prise de parole

Je recherche une alternance d'un an à Genève à partir de septembre 2027. Je suis motivé, rigoureux, et j'aime construire des solutions web utiles, propres et évolutives.

## Aperçu

- Site statique en HTML, CSS, JavaScript (sans framework).
- Contenu géré depuis [Portfolio Matis](https://github.com/Matis-Wostry/portfolio-matis) : le site est généré au déploiement, sans appel à l'API au chargement.
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
├── index.html          gabarit et dernier rendu : le contenu est entre les marqueurs <!-- content:x -->
├── content/
│ └── snapshot.json   copie du dernier contenu publié
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

Il se lance à chaque push sur la branche main, et quand on clique sur Publier dans Portfolio Matis :

1. Le dépôt et le générateur de Portfolio Matis sont récupérés.
2. Le générateur lit le dernier contenu publié sur `https://api.matis-wostry.com/public/snapshot`, avec ses captures, et produit le site dans `dist/`. Si l'API est injoignable, le workflow s'arrête là et le site en ligne ne change pas.
3. Seul `dist/` est envoyé par rsync : ni `.git`, ni `.github`, ni ce README ne sont sur le serveur.
4. Reload de Caddy dans le conteneur Docker.
5. `index.html` et `content/snapshot.json` sont enregistrés dans le dépôt, par un commit `[skip ci]`.

Le texte des sections se modifie dans Portfolio Matis, pas dans `index.html` : ce qui est écrit entre les marqueurs est remplacé à chaque déploiement. Le reste du HTML, le style et le script se modifient ici, comme avant.

## Générer en local

Depuis un clone de Portfolio Matis, sans API, à partir de la copie du contenu :

```bash
node packages/site-classique/src/cli.ts --site ../classique --snapshot ../classique/content/snapshot.json --out ../classique/dist
```

Ou depuis une API qui tourne en local, après avoir publié : `--api http://localhost:3000`. Le site généré est dans `dist/`.

Secrets GitHub attendus :

- SSH_PRIVATE_KEY
- SSH_KNOWN_HOSTS
- SSH_PORT
- SSH_TARGET
- SSH_LOGIN

## Auteur

Matis Wostry

- Site : https://matis-wostry.com/
- Mes dépôts Git : https://git.matis-wostry.com
- LinkedIn : https://linkedin.com/in/matis-wostry

<!-- test auto-deploy 2026-09-20T15:19:55Z -->
