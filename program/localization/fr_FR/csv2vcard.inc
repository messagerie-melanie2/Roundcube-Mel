<?php

/*
 +-----------------------------------------------------------------------+
 | localization/<lang>/csv2vcard.inc                                     |
 |                                                                       |
 | Localization file of the Roundcube Webmail client                     |
 | Copyright (C) 2005-2013, The Roundcube Dev Team                       |
 |                                                                       |
 | Licensed under the GNU General Public License version 3 or            |
 | any later version with exceptions for skins & plugins.                |
 | See the README file for a full license statement.                     |
 |                                                                       |
 +-----------------------------------------------------------------------+
 | Author: Aleksander Machniak <alec@alec.pl>                            |
 +-----------------------------------------------------------------------+
*/
$map = array();
$map['anniversary'] = "Anniversaire de mariage ou fête";
// PAMELA - Typo
$map['assistants_name'] = "Nom de l'assistant(e)";
$map['assistants_phone'] = "Téléphone de l'assistant(e)";
$map['birthday'] = "Anniversaire";
$map['business_city'] = "Ville (bureau)";
$map['business_countryregion'] = "Pays/Région (bureau)";
$map['business_fax'] = "Télécopie (bureau)";
$map['business_phone'] = "Téléphone (bureau)";
$map['business_phone_2'] = "Téléphone 2 (bureau)";
$map['business_postal_code'] = "Code postal (bureau)";
$map['business_state'] = "Dép/Région (bureau)";
$map['business_street'] = "Rue (bureau)";
$map['car_phone'] = "Téléphone (voiture)";
$map['categories'] = "Catégories";
$map['company'] = "Société";
$map['department'] = "Service";
$map['email_address'] = "Adresse de messagerie";
$map['first_name'] = "Prénom";
$map['gender'] = "Sexe";
$map['home_city'] = "Ville (domicile)";
$map['home_countryregion'] = "Pays/Région (domicile)";
$map['home_fax'] = "Télécopie (domicile)";
$map['home_phone'] = "Téléphone (domicile)";
$map['home_phone_2'] = "Téléphone 2 (domicile)";
$map['home_postal_code'] = "Code postal (domicile)";
$map['home_state'] = "Dép/Région (domicile)";
$map['home_street'] = "Rue (domicile)";
$map['job_title'] = "Profession";
$map['last_name'] = "Nom";
$map['managers_name'] = "Manager's Name";
$map['middle_name'] = "Deuxième prénom";
$map['mobile_phone'] = "Tél. mobile";
$map['notes'] = "Notes";
$map['other_city'] = "Ville (autre)";
$map['other_countryregion'] = "Pays/Région (autre)";
$map['other_fax'] = "Télécopie (autre)";
$map['other_phone'] = "Téléphone (autre)";
$map['other_postal_code'] = "Code postal (autre)";
$map['other_state'] = "Dép/Région (autre)";
$map['other_street'] = "Rue (autre)";
$map['pager'] = "Récepteur de radiomessagerie";
$map['primary_phone'] = "Téléphone principal";
$map['spouse'] = "Conjoint(e)";
$map['suffix'] = "Suffixe";
$map['title'] = "Titre";
$map['web_page'] = "Page Web";
$map['birth_day'] = "Jour";
$map['birth_month'] = "Mois";
$map['birth_year'] = "Année de naissance";
$map['display_name'] = "Nom à afficher";
$map['fax_number'] = "Fax";
$map['home_address'] = "Adresse privée";
$map['home_country'] = "Région";
$map['home_zipcode'] = "Code postal";
$map['mobile_number'] = "Portable";
$map['nickname'] = "Surnom";
$map['organization'] = "Société";
$map['pager_number'] = "Pager";
$map['primary_email'] = "Adresse électronique principale";
$map['secondary_email'] = "Adresse électronique secondaire";
$map['web_page_1'] = "Site Web 1";
$map['web_page_2'] = "Site Web 2";
$map['work_phone'] = "Tél. professionnel";
$map['work_address'] = "Adresse professionnelle";
$map['work_country'] = "Région";
$map['work_zipcode'] = "Code postal";
$map['_home_city'] = "Ville";

// Champs manquants - 0005948: Améliorer l'import csv des contacts
$map['city'] = "Ville";
$map['countryregion'] = "Pays/Région";
$map['fax'] = "Télécopie";
$map['phone'] = "Téléphone";
$map['postal_code'] = "Code postal";
$map['state'] = "Dép/Région";
$map['street'] = "Rue";
$map['address'] = "Adresse";

$map['work_city'] = "Ville (travail)";
$map['work_countryregion'] = "Pays/Région (travail)";
$map['work_fax'] = "Télécopie (travail)";
$map['work_phone'] = "Téléphone (travail)";
$map['work_postal_code'] = "Code postal (travail)";
$map['work_state'] = "Dép/Région (travail)";
$map['work_street'] = "Rue (travail)";

// Export Roundcube - 0005948: Améliorer l'import csv des contacts
$map['full_name'] = "Nom complet"; // equivalent display_name
$map['name_prefix'] = "Préfixe";
$map['name_suffix'] = "Suffixe";
$map['home_email'] = "E-mail domicile"; // equivalent email_address
$map['work_email'] = "E-mail travail"; // equivalent primary_email
$map['other_email'] = "E-mail autre"; // equivalent secondary_email

$map['home_address_street'] = "Adresse domicile rue"; // equivalent home_street
$map['home_address_city'] = "Adresse domicile ville"; // equivalent home_city
$map['home_address_postal_code'] = "Adresse domicile code postal"; // equivalent home_postal_code
$map['home_address_region'] = "Adresse domicile région"; // equivalent home_countryregion
$map['home_address_country'] = "Adresse domicile pays"; // equivalent home_countryregion

$map['work_address_street'] = "Adresse travail rue"; // equivalent work_street
$map['work_address_city'] = "Adresse travail ville"; // equivalent work_city
$map['work_address_postal_code'] = "Adresse travail code postal"; // equivalent work_postal_code
$map['work_address_region'] = "Adresse travail région"; // equivalent work_countryregion
$map['work_address_country'] = "Adresse travail pays"; // equivalent work_countryregion

$map['other_address_street'] = "Adresse autre rue"; // equivalent other_street
$map['other_address_city'] = "Adresse autre ville"; // equivalent other_city
$map['other_address_postal_code'] = "Adresse autre code postal"; // equivalent other_postal_code
$map['other_address_region'] = "Adresse autre région"; // equivalent other_countryregion
$map['other_address_country'] = "Adresse autre pays"; // equivalent other_countryregion

$map['_home_phone'] = "Téléphone maison"; // equivalent home_phone
$map['_work_phone'] = "Téléphone travail"; // equivalent work_phone
$map['_other_phone'] = "Téléphone autre"; // equivalent other_phone

$map['mobile'] = "Mobile";

$map['other_phone_2'] = "Autre téléphone"; // equivalent other_phone
$map['_home_fax'] = "Fax maison"; // equivalent home_fax
$map['_work_fax'] = "Fax travail"; // equivalent work_fax

$map['structure'] = "Structure";
$map['function'] = "Fonction";
$map['manager'] = "Manageur";
$map['groups'] = "Groupes";
$map['room'] = "Bureau";

$map['home_website'] = "Page web domicile";
$map['work_website'] = "Page web travail";

// Export Pauline - 0005948: Améliorer l'import csv des contacts
$map['unity'] = "Unité";
$map['_email'] = "Messagerie";
$map['_room'] = "Pièce";
$map['description'] = "Description";
$map['_function_manager'] = "Fonction hiérarchique";
$map['_function_jobtitle'] = "Fonction métier";
$map['_missions'] = "Missions";
