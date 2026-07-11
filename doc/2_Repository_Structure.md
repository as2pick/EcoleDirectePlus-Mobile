---
id: 02_repository_structure
title: Repository Structure
sidebar_label: 02. Repository Structure
---

# 02. Structure du Depot

Ce document definit l'organisation des fichiers et dossiers de l'application Ecole Directe Plus. Tout contributeur doit respecter cette arborescence pour maintenir le projet homogene et lisible.

---

## Architecture Globale

Le projet est structure selon une architecture hybride combinant des modules centraux et des modules par fonctionnalite (features). Tout le code source applicatif se trouve dans le dossier `src/`.

```text
ecole-directe-plus/
├── assets/             # Ressources statiques (fonts, images, lottie)
├── docs/               # Fichiers de documentation numerotes (ce dossier)
├── ios/ & android/     # Dossiers natifs generes par Expo
├── src/                # Code source de l'application
└── tsconfig.json       # Configuration TypeScript du projet

```

---

## Organisation du dossier `src/`

Pour eviter la surcharge des repertoires globaux, le code est separe entre les elements globaux (partages) et les modules specifiques (features).

### 1. Composants Globaux (`src/components/`)

Contient uniquement les composants graphiques generiques et reutilisables dans l'ensemble de l'application, classes par categorie :

- `core/` : Composants de base et abstractions de structure (Layouts bruts, Text).
- `display/` : Elements visuels simples (Gradients, separateurs, titres).
- `feedback/` : Indicateurs de chargement, spinners, Overlays.
- `form/` : Elements d'interaction et de formulaire (CheckBox, Inputs).
- `layout/` : Structures de conteneurs complexes (ScrollViews, BottomSheet, Onboarding).
- `modal/` : Fenetres contextuelles globales.
- `svg/` : Icones, badges et logos geres sous forme de composants vectoriels.

### 2. Modules Applicatifs (`src/features/`)

Chaque grande fonctionnalite d'Ecole Directe (Notes, Devoirs, Emploi du temps, Messagerie) regroupe sa propre logique metier dans un sous-dossier de feature dedie. Un dossier de feature comprend :

- `components/` : Composants graphiques exclusifs a ce module (ex: `HomeworkCard.jsx`).
- `context/` : Etats partages du module (React Context).
- `hooks/` : Logique metier isolee (ex: `useSimulation.js`).
- `utils/` : Fonctions d'aide specifiques au domaine de la feature.

### 3. Dossiers Communs (`src/`)

- `constants/` : Configurations de l'API Ecole Directe, codes d'erreur et variables globales de l'appareil.
- `hooks/` : Hooks React globaux partages par plusieurs modules (gestion du reseau, du theme ou des stores Zustand comme `useUserStore.ts`).
- `router/` : Configuration de la navigation React Navigation / Expo Router (navigateurs d'authentification et gestion des onglets clients).
- `screens/` : Pages principales de l'application appelees directement par le routeur. Elles agissent comme des conteneurs de haut niveau.
- `services/` : Couche reseau gerant les requetes HTTP brutes et l'authentification (`authService.js`).
- `types/` : Fichiers de definitions de types TypeScript globaux (`.ts`).
- `utils/` : Fonctions pures utilitaires partagees (calculs de moyennes globales, formatage de dates, cryptographie).

---

## Regles de Nommage et Extensions

### 1. Extensions des fichiers

Dans le cadre de la transition vers du code entierement type et securise, les regles suivantes sont appliquees :

- `.tsx` : Obligatoire pour tout nouveau fichier contenant du JSX (Composants graphiques, Screens).
- `.ts` : Obligatoire pour toute logique pure (Hooks, Utils, Services, Types).
- _Note : Les fichiers `.js` et `.jsx` existants doivent etre migres vers TypeScript lors de chaque modification majeure effectuee sur ces derniers._

### 2. Casse des fichiers

- `PascalCase` : Applique aux composants graphiques et aux ecrans (ex: `HomeScreen.tsx`, `LoadingSpinner.tsx`).
- `camelCase` : Applique aux fichiers de logique, hooks, services et utilitaires (ex: `useHomeworks.ts`, `date.ts`).

