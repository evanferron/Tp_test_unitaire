# Suppression d'un livre

La suppression d'un livre ne fonctionnait pas. Lorsqu'on demandait à supprimer un livre, celui-ci restait présent dans la liste comme si rien ne s'était passé.

La cause était une erreur dans la façon dont le livre était retiré de la liste : au lieu d'indiquer sa position dans la liste, on passait directement l'objet livre lui-même, ce que la fonction ne sait pas interpréter.

Une fois corrigé, la suppression retire bien le bon livre de la liste.

# Emprunt d'un livre

Quand un utilisateur empruntait un livre, le livre n'était pas marqué comme indisponible. Il restait visible comme disponible pour d'autres emprunteurs, ce qui pouvait mener à des emprunts multiples du même exemplaire.

Le champ indiquant la disponibilité du livre n'était tout simplement pas mis à jour lors de l'emprunt. Il a suffi de l'inclure dans la mise à jour pour que le livre passe correctement à "non disponible" dès qu'il est emprunté.

# Route de recherche inaccessible

La fonctionnalité de recherche de livres retournait systématiquement une erreur 404, comme si la route n'existait pas.

Le problème venait de l'ordre de déclaration des routes. La route qui permet d'accéder à un livre par son identifiant (`/books/:id`) était déclarée avant la route de recherche (`/books/search`). Express interprétait alors le mot "search" comme un identifiant de livre et tentait de trouver un livre portant ce nom, sans succès.

En plaçant la route de recherche avant la route par identifiant, Express reconnaît maintenant correctement les deux adresses.

# Couverture de tests incomplète sur la recherche

Les tests de couverture révélaient qu'une partie du code de recherche n'était jamais exécutée, même en faisant tourner l'ensemble des tests.

La raison était que l'expression permettant de gérer une recherche vide (`q || ""`) était écrite deux fois dans le filtre de recherche — une fois pour le titre, une fois pour l'auteur. Or, quand la recherche est vide, la condition sur le titre est toujours vraie (une chaîne vide est contenue dans n'importe quel texte), ce qui empêche la condition sur l'auteur d'être jamais évaluée avec une recherche vide. Cette branche du code devenait donc inatteignable par construction.

La solution a été d'extraire cette expression dans une variable calculée une seule fois avant le filtre, ce qui a rendu le code à la fois plus lisible et entièrement couvert par les tests.

# Bonus

Dans books.model.test.js il y a un test mis en commentaire, il est mis en commentaire car ici on est dans une simulation de BDD et donc des actions qui dans un cadre de vrai requêtes vers une BDD ne serait possible, ici sont possible
