<?php

/**
 * This class is used to have the version number of Roundcube Mél Webmail
 *
 * @author PNE Messagerie/Apitech
 */
class Version {
  /**
   * Version number
   */
  const VERSION = '24.5';
  
  /**
   * Build
   */
  const BUILD = '20240527132852';
}

// Afficher le numéro de version si demandé
if (isset($_GET['version'])) {
  echo "Version : " . Version::VERSION . " | Build : " . Version::BUILD;
}