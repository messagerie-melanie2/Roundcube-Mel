<?php

/**
 * This class is used to have the version number of Roundcube Mél Webmail
 *
 * @author PNE Messagerie/Apitech
 */
class Version
{
  /**
   * Version number
   */
  const VERSION = '25.6.1';

  /**
   * Build
   */
  const BUILD = '20250604104400';
}

// Afficher le numéro de version si demandé
if (isset($_GET['version'])) {
  echo "Version : " . Version::VERSION . " | Build : " . Version::BUILD;
}
