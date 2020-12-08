# Projet Technologies Web 2020: Messenger

Bienvenue sur le repository privé de ce projet Web 2020.
Veuillez lire les instructions ci-dessous afin de comprendre le fonctionnement de cette mesagerie.


## Membres:
- SOARES Alexandre
- Paul Caudal

## Comment éxecuter le projet ?
- Depuis /front-end: react-script start
- Depuis /back-end: node bin/start
- Il est possible que vous ayez besoin de reset la base de données. Pour cela, supprimer simplement tous les fichiers contenus dans /db

## Spécificités techniques
### Modèle de base de données
Le projet utilise leveldb, une base de donnes key value.

#### User
- username (correspond à son ID UNIQUE, on ne peut pas avoir le même username que quelqu'un d'autre)
- email
- password (crypté grâce à la librairie bcrypt)

#### Channels
- name
- ID (UNIQUE, généré par la lib uuid)
- users (array contenant les users membres de ce channel)

#### Messages
- author
- content
- ID (UNIQUE, généré par la lib uuid)
- channelID
