Roundcube Mél Webmail 
======================

INTRODUCTION
------------
Roundcube Webmail est un client IMAP multi-langues accessible en web. 
Il propre toutes les fonctionnalités attendues d'un client e-mail, 
dont le support du MIME, des carnets d'adresses, la gestion des dossiers,
la recherche dans les messages et la vérification de l'orthographe.
Roundcube Webmail est écrit en PHP et nécessite une base de données MySQL, 
PostgreSQL ou SQLite. Il peut être enrichi grâce aux API de plugin et l'interface
utilisateur peut être personnalisée avec des thèmes en XHTML et CSS2.

Le code est principalement écrit en PHP et doit être installé sur un serveur web.
Il utilise des classes ou librairies libres de [PEAR][pear], la librairie IMAP 
de [IlohaMail][iloha], l'éditeur de texte enrichi [TinyMCE][tinymce], la librairie
[Googiespell][googiespell] pour la vérification orthographique ou l'analyseur HTML
[WASHTML][washtml] par Frederic Motte.

Le thème utilisé par défaut a été créé par FLINT / Büro für
Gestaltung, Berne, Switzerland.


MÉL
---
Cette version de [Roundcube][roundcube] apporte de nouvelles fonctionnalités,
telles que :
 - Le support des boites e-mail multiples (boites partagées)
 - Nouvelle interface avec un thème Mél créé avec NoDesign et basé sur le thème Larry
 - Un panneau de droite affichant les informations importantes pour l'utilisateur
 - Des correctifs pour certains plugins (managesieve)

Cette version fonctionne exclusivement dans un environnement Mél ou MCE 


VERSION
-------
La version actuelle du webmail Mél est la 1.4.8  
Cette version est basée sur [Roundcube][roundcube] vers 1.3.16


INSTALLATION
------------
Pour voir les instructions d'installation du webmail Roundcube sur votre serveur,
merci de vous référer au document INSTALL accessible à la racine du projet.

Si vous faite une mise à jour d'un ancien webmail Roundcube, merci de suivre les étapes
dans le document UPGRADING, également accessible à la racine du projet.


LICENSE
-------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License (**with exceptions
for skins & plugins**) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see [www.gnu.org/licenses/][gpl].

This file forms part of the Roundcube Webmail Software for which the
following exception is added: Plugins and Skins which merely make
function calls to the Roundcube Webmail Software, and for that purpose
include it by reference shall not be considered modifications of
the software.

If you wish to use this file in another project or create a modified
version that will not be part of the Roundcube Webmail Software, you
may remove the exception above and use this source code under the
original version of the license.

For more details about licensing and the exceptions for skins and plugins
see [roundcube.net/license][license]


CONTRIBUER A ROUNDCUBE
----------------------
Vous souhaitez contribuer à améliorer le webmail Roundcube ?
Ce client est un logiciel open source. Les développeurs et contributeurs
sont tous volontaires et recherchent toujours de nouvelles contributions.
Pour plus d'information, voir [roundcube.net/contribute][contrib]


CONTACTER L'EQUIPE MÉL
----------------------
Pour rapporter des bugs ou des demandes de fonctionnalités pour le webmail Mél, 
merci d'utiliser le système de suivi accessible à [Github][githubissues]


[roundcube]:	http://roundcube.net
[pear]:         http://pear.php.net
[iloha]:        http://sourceforge.net/projects/ilohamail/
[tinymce]:      http://www.tinymce.com/
[googiespell]:  http://orangoo.com/labs/GoogieSpell/
[washtml]:      http://www.ubixis.com/washtml/
[gpl]:          http://www.gnu.org/licenses/
[license]:      http://roundcube.net/license
[contrib]:      http://roundcube.net/contribute
[githubissues]: https://github.com/messagerie-melanie2/Roundcube-Mel/issues