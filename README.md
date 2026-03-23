# Triangle de Référence

Application web interactive pour visualiser le triangle de référence des pronoms personnels (JE, TOI, IL/ELLE).

Conçue pour aider à comprendre visuellement le déplacement de référence entre trois personnes dans une conversation : qui parle, de qui on parle, et à qui on parle.

## Fonctionnalités

- **Flux étape par étape** : Choisis qui parle → de qui → à qui
- **Triangle interactif** : Visualisation SVG avec flèches et badges de pronoms
- **Vue linéaire** : Représentation en ligne droite de la phrase
- **Auto-référence** : Support du cas « je parle de moi-même »
- **Pronoms genrés** : IL / ELLE selon la personne

## Tech

- React 18 + Vite 5
- Tailwind CSS 3
- Déployé automatiquement via GitHub Pages

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Le build produit un dossier `dist/` prêt pour l'hébergement statique.

## Déploiement

Le déploiement est automatique via GitHub Actions. Chaque `git push` sur `main` déclenche un build et un déploiement sur GitHub Pages.
