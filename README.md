# Je réussis ma transition - Site Web

## Structure du projet

Le site a été refactorisé en composants modulaires pour une meilleure maintenabilité.

### Structure des fichiers

```
├── index.html                 # Fichier principal (simplifié)
├── style.css                  # Styles CSS
├── script.js                  # Script JavaScript principal
├── components/                # Dossier des composants
│   ├── loader.js             # Script de chargement des composants
│   ├── header.html           # Navigation et en-tête
│   ├── hero.html             # Section héro
│   ├── intro.html            # Section d'introduction
│   ├── about.html            # Section "À propos"
│   ├── services.html         # Section services/accompagnements
│   ├── testimonials.html     # Section témoignages
│   ├── faq.html              # Section FAQ
│   ├── newsletter.html       # Section newsletter
│   └── footer.html           # Pied de page
└── assets/                    # Ressources (images, etc.)
```

## Avantages de cette structure

✅ **Maintenabilité** : Chaque section est dans un fichier séparé, plus facile à modifier
✅ **Réutilisabilité** : Les composants peuvent être réutilisés dans d'autres pages
✅ **Organisation** : Structure claire et logique
✅ **Collaboration** : Plusieurs personnes peuvent travailler sur différents composants
✅ **Performance** : Chargement asynchrone des composants

## Comment ça fonctionne ?

1. Le fichier `index.html` contient uniquement des placeholders (div avec id)
2. Le script `components/loader.js` charge automatiquement tous les composants HTML
3. Une fois tous les composants chargés, le script principal `script.js` s'initialise
4. Toutes les interactions et animations fonctionnent normalement

## Lancer le site en local

Pour tester le site localement, vous devez utiliser un serveur web (les fichiers ne peuvent pas être chargés directement avec file://).

### Option 1 : Avec Python

```bash
python3 -m http.server 8000
```

Puis ouvrez : http://localhost:8000

### Option 2 : Avec Node.js

```bash
npx http-server -p 8000
```

Puis ouvrez : http://localhost:8000

### Option 3 : Avec l'extension VS Code "Live Server"

Clic droit sur `index.html` → "Open with Live Server"

## Modifier un composant

Pour modifier une section spécifique :

1. Ouvrez le fichier correspondant dans `components/`
2. Modifiez le HTML
3. Sauvegardez
4. Rafraîchissez votre navigateur

Pas besoin de toucher au fichier `index.html` principal !

## Notes importantes

⚠️ **CORS** : Le site doit être servi via un serveur HTTP (pas en file:// local) pour que les composants se chargent correctement.

💡 **Ordre de chargement** : Les composants sont chargés dans l'ordre défini dans `components/loader.js`

🎨 **Styles** : Tous les styles restent dans `style.css` et s'appliquent automatiquement aux composants
