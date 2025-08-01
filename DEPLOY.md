# Guide de déploiement Vercel

## Prérequis

1. **Compte Vercel** : https://vercel.com/signup
2. **Vercel CLI installé** : `npm i -g vercel`
3. **Google AI API Key** : Récupérez votre clé sur https://aistudio.google.com/

## Étapes de déploiement

### 1. Préparation locale

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Build local pour vérifier
npm run build
```

### 2. Configuration de la variable d'environnement

Dans le dashboard Vercel de votre projet, ajoutez cette variable :

```
GOOGLE_AI_API_KEY=your_google_ai_api_key_from_aistudio
```

**Comment obtenir la clé :**
1. Allez sur https://aistudio.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Get API Key" → "Create API Key"
4. Sélectionnez votre projet Google Cloud
5. Copiez la clé générée

### 3. Déploiement

```bash
# Déploiement en production
npm run deploy

# Ou déploiement preview
npm run deploy-preview
```

### 4. Configuration du domaine (optionnel)

1. Aller dans Vercel Dashboard > Votre projet > Settings > Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions Vercel

## Scripts disponibles

- `npm run deploy` - Déploiement en production
- `npm run deploy-preview` - Déploiement preview
- `npm run build` - Build local
- `npm run dev` - Serveur de développement

## Architecture simplifiée

✅ **Plus d'authentification** - Application publique  
✅ **Plus de base de données** - Génération IA uniquement  
✅ **Ultra-léger** - Une seule dépendance IA  

## Notes importantes

1. **Google AI API Key** : Seule variable obligatoire
2. **Timeout** : Les fonctions API ont un timeout de 60s pour l'IA
3. **Performance** : Application ultra-rapide sans Firebase
4. **Coût** : Très économique, seulement l'API Google AI

## Troubleshooting

### Erreur de build
```bash
npm run typecheck
npm run lint
```

### Variable manquante
Vérifiez que `GOOGLE_AI_API_KEY` est définie dans Vercel Dashboard.

### Timeout API
L'IA peut prendre du temps - le timeout est configuré à 60s.

### Quota API dépassé
Vérifiez votre quota sur Google AI Studio ou activez la facturation.