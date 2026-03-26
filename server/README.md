# Mock server of banana front

# TODO
- Faudrait rajouter des created_date et updated_date sur toutes les tables et avoir un truc auto qui met à jour dans les repos sqlx (utiliser des triggers posgresql pour les updated at)
- il faudra rajouter de la validation request
- Ajouter un index postgres sur l'email des users
- On verra plus tard pour envoyer des mails. Mais quand on créé une famille, si un user existe on rajoute à la famille, sinon on créé (mais pas dans keycloak, ce sera quand le user se sera register)
- quand on va partager un truc, on pourra partager à la famille mais exclure des rôles.