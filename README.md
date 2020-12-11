# Projet Technologies Web 2020: Messenger

Bienvenue sur le repository privé de ce projet Web 2020.
Veuillez lire les instructions ci-dessous afin de comprendre le fonctionnement de cette mesagerie.

## Membres:
- SOARES Alexandre
- Paul Caudal

## Comment éxecuter le projet ?
- Depuis /front-end: ```react-script start```
- Depuis /back-end: ```node bin/start```
- Il est possible que vous ayez besoin de reset la base de données. Pour cela, supprimer simplement tous les fichiers contenus dans /db (ou méthode DELETE à http://localhost:3001/admin/celar)

## Identifiants
Le site requiert un username ainsi qu'un mot de passe pour se connecter. 4 comptes sont déjà pré-configurés:
| Username      | Password      |
| ------------- |:-------------:|
| SoaAlex       | 1234          |
| Paul          | 1234          |
| Kévin         | 1234          |
| David         | 1234          |


# Spécificités techniques
## Modèle de base de données
Le projet utilise leveldb, une base de donnes key value.

### User
Clé: username (correspond à son ID UNIQUE, on ne peut pas avoir le même username que quelqu'un d'autre)
- email
- password (crypté grâce à la librairie bcrypt)
- avatar (URL)
- language
- gender

### Channels
Clé: channelID
- name
- users (array contenant les users membres de ce channel)

### Messages
Clé: channelID  + creation
- author
- content
- channelID

## Front
Le front est en react à l'adresse: http://localhost:3000.
Les différentes pages sont:
- ```/login```
- ```/register```
- ```/welcome```
- ```/account```

## Back
Le back est en node.js à l'adresse: http://localhost:3001.
L'API comprends les 4 méthodes GET, POST, PUT, DELETE pour
- ```/users```
- ```/channels```
- ```/messages```
- Ainsi qu'un décodeur de JWT Token et un /admin/clear pour reset la BDD (EN ENVIRONNEMENT DE DEVELOPPEMENT UNIQUEMENT)

## Login
Une fois un compte créé, il est stocké en BDD dans /users avec ses identifiants (mot de passe crypté avec bcrypt).
La connexion se fait sur /login. Si les identifiants sont corrects, le serveur retourne un JWT Token contenant les informations utilisateur.
Le Token est stocké dans un cookie ```authorization```

## JWT Token
La clé est stocké sur le back-end uniquement, et utilise la librairie jsonwebtoken pour le créé. Le Token décodé contient:
- ```username```
- ```URL avatar```
- ```expireIn```: 24H


# Barème
## Développement
| Spécificité                                                                          | Points | Validation |
|--------------------------------------------------------------------------------------|--------|------------|
| Formulaire de Sign in, création du compte \(moyen\)                                  | 4      | OUI        |
| Ecran de bienvenue, de login, d'accueil sur l'espace privé \(simple\)                | 2      | OUI        |
| Création de nouveau channels \(dur\)                                                 | 6      | OUI        |
| Associer la création de channels avec l'identité de l'utilisateur en cours \(moyen\) | 4      | OUI        |
| Restreindre l'accès aux channels et aux messages \(moyen\)                           | 4      | OUI        |
| Ajout d'utilisateurs à un channel \(dur\)                                            | 6      | OUI        |
| Modification des messages \(simple\)                                                 | 2      | OUI        |
| Suppression des messages \(simple\)                                                  | 2      | OUI        |
| Préférence de compte \(moyen\)                                                       | 4      | OUI        |
| Affichage du Gravatar \(facile\)                                                     | 2      | OUI        |
| Sélection d'un avatar \(moyen\)                                                      | 4      | OUI        |
| Avatar personnel \(dur\)                                                             | 6      | NON        |

## Gestion de projet
| Spécificité                                                                                             | Points |
|---------------------------------------------------------------------------------------------------------|--------|
| Respect des conventions de nommage                                                                      | 2      |
| Structure des projets simple, compréhensible et stable, organisation des dossiers, services, composants | 4      |
| Qualité globale du code \(indentation, clarté, …\) 4                                                    | 4      |
| Apparence globale de l'application web 4                                                                | 4      |

## Bonus
| Spécificité bonus | Validation |
|-------------------|------------|
| DarkMode          | OUI        |

# Bugs connus
## Critique
- Il reste encore quelques URLs qui ne requiert pas un token valide pour l'accès aux données. La plupart sont cependant sécurisées.
- Blindages des PUT dans la BDD.

## Moderé
- Les channels n'affichent pas imédiatement les avatars des autres participants que soit même. Le hook contenant les avatars ne se met à jour qu'une fois un message envoyé où après avoir cliqué sur un composant forçant un rerender.

## Faible
- La page /account (manage account ou account settings) n'affiche pas en placeholder/value l'état actuel des attributs d'un utilisateur bien qu'ils aient correctement été récuperé depuis la BDD. Il s'agit encore d'un problème de hook qui n'est pas à jour au moment du render.
- Le bouton Edit message n'affiche pas en placeholder/value l'ancien message à cause d'un hook pas à jour au moment du render.
