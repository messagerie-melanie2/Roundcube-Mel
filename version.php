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
  const VERSION = '23.9.1';
  
  /**
   * Build
   */
  const BUILD = '20231012110500';
}

// Afficher le numéro de version si demandé
if (isset($_GET['version'])) {
  echo "Version : " . Version::VERSION . " | Build : " . Version::BUILD;
}