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
  const VERSION = '22.3';
  
  /**
   * Build
   */
  const BUILD = '20220316153552';
}

// Afficher le numéro de version si demandé
if (isset($_GET['version'])) {
  echo "Version : " . Version::VERSION . " | Build : " . Version::BUILD;
}