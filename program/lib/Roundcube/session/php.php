<?php

/**
 +-----------------------------------------------------------------------+
 | This file is part of the Roundcube Webmail client                     |
 |                                                                       |
 | Copyright (C) The Roundcube Dev Team                                  |
 | Copyright (C) Kolab Systems AG                                        |
 |                                                                       |
 | Licensed under the GNU General Public License version 3 or            |
 | any later version with exceptions for skins & plugins.                |
 | See the README file for a full license statement.                     |
 |                                                                       |
 | PURPOSE:                                                              |
 |   Provide database supported session management                       |
 +-----------------------------------------------------------------------+
 | Author: Thomas Bruederli <roundcube@gmail.com>                        |
 | Author: Aleksander Machniak <alec@alec.pl>                            |
 | Author: Cor Bosman <cor@roundcu.be>                                   |
 +-----------------------------------------------------------------------+
*/

/**
 * Class to provide native php session storage
 *
 * @package    Framework
 * @subpackage Core
 */
class rcube_session_php extends rcube_session
{
    /**
     * Native php sessions don't need a save handler.
     * We do need to define abstract function implementations but they are not used.
     */

    public function open($save_path, $session_name) {}
    public function close() {}
    public function destroy($key) {}
    public function read($key) {}
    public function write($key, $vars) {}
    public function update($key, $newvars, $oldvars) {}

    /**
     * Object constructor
     *
     * @param rcube_config $config Configuration
     */
    public function __construct($config)
    {
        parent::__construct($config);
    }

    /**
     * Wrapper for session_write_close()
     */
    public function write_close()
    {
        if (!isset($_SESSION['__MTIME']) 
                || (time() - $_SESSION['__MTIME']) > ($this->lifetime / 10)) {
            $_SESSION['__IP'] = $this->ip;
            $_SESSION['__MTIME'] = time();
        }

        parent::write_close();
    }

    /**
     * Wrapper for session_start()
     */
    public function start()
    {
        parent::start();

        $this->key     = session_id();
        $this->ip      = $_SESSION['__IP'] ?? null;
        // PAMELA - IP check : une session anonyme sans IP prend l'IP courante ;
        // une session authentifiée sans IP reste rejetée par check_auth()
        if (empty($this->ip) && empty($_SESSION['user_id'])) {
            $this->ip = rcube_utils::remote_addr();
        }
        $this->changed = $_SESSION['__MTIME'] ?? null;
    }

    /**
     * PAMELA - IP check : l'IP de référence est celle qui s'authentifie,
     * y compris quand le login ne passe pas par kill_session()
     * (valid forcé par mel_ldap_auth / roundcube_auth)
     *
     * @param bool $destroy If enabled the current session will be destroyed
     *
     * @return bool True on success, False on failure
     */
    public function regenerate_id($destroy = true)
    {
        $this->ip = rcube_utils::remote_addr();
        // force l'écriture de __IP au write_close()
        unset($_SESSION['__MTIME']);

        return parent::regenerate_id($destroy);
    }
}
