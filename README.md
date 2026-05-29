# Library API

API REST de gestion de bibliothèque développée avec Express.js.

## Installation

```bash
npm install
```

## Lancer le serveur

```bash
npm start
```

Le serveur démarre sur le port 3000 par défaut (configurable via la variable d'environnement `PORT`).

## Routes disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/books | Liste tous les livres (filtre: `?available=true`) |
| GET | /api/books/:id | Détail d'un livre |
| POST | /api/books | Ajouter un livre |
| PUT | /api/books/:id | Modifier un livre |
| DELETE | /api/books/:id | Supprimer un livre |
| POST | /api/books/:id/borrow | Emprunter un livre |
| POST | /api/books/:id/return | Retourner un livre |

## Format des requêtes

### Créer un livre (POST /api/books)
```json
{
  "title": "Le Petit Prince",
  "author": "Antoine de Saint-Exupéry",
  "isbn": "9782070612758",
  "year": 1943
}
```

### Emprunter un livre (POST /api/books/:id/borrow)
```json
{
  "borrower": "Jean Dupont"
}
```

## Format des réponses

Succès :
```json
{ "success": true, "data": { ... } }
```

Erreur :
```json
{ "success": false, "error": "message d'erreur" }
```
