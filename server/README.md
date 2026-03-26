# Mock server of banana front

# TODO
- Pour les familles, il faut enregistrer une liste de membres de la famille qui sont des users (relation many to many avec un email)
- Ajouter un index sur l'email des users
- On verra plus tard pour envoyer des mails. Mais quand on créé une famille, si un user existe on rajoute à la famille, sinon on créé (mais pas dans keycloak, ce sera quand le user se sera register)
- Un flag isAdmin
- Chaque membre de la famille peut avoir plusieurs rôles PARENT, GRAND_PARENT, CHILD, UNCLE, AUNT, SISTER, BROTHER
- il faut rajouter le créateur de la famille en base. ça sert juste d'audit

-> quand on va partager un truc, on pourra partager à la famille mais exclure des rôles.


- Faudrait rajouter des created_date et updated_date sur toutes les tables et avoir un truc auto qui met à jour dans les repos sqlx