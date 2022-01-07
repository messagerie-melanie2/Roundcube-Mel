<?php

/**
 +-----------------------------------------------------------------------+
 | This file is part of the Roundcube Webmail client                     |
 |                                                                       |
 | Copyright (C) The Roundcube Dev Team                                  |
 |                                                                       |
 | Licensed under the GNU General Public License version 3 or            |
 | any later version with exceptions for skins & plugins.                |
 | See the README file for a full license statement.                     |
 |                                                                       |
 | PURPOSE:                                                              |
 |   Copy the submitted messages to a specific mailbox                   |
 +-----------------------------------------------------------------------+
 | Author: Aleksander Machniak <alec@alec.pl>                            |
 +-----------------------------------------------------------------------+
*/

class rcmail_action_mail_copy extends rcmail_action_mail_index
{
    // only process ajax requests
    protected static $mode = self::MODE_AJAX;

    /**
     * Request handler.
     *
     * @param array $args Arguments from the previous step(s)
     */
    public function run($args = [])
    {
        $rcmail = rcmail::get_instance();

        // copy messages
        if (empty($_POST['_uid']) || !isset($_POST['_target_mbox']) || !strlen($_POST['_target_mbox'])) {
            $rcmail->output->show_message('internalerror', 'error');
        }

        $uids    = self::get_uids(null, null, $multifolder, rcube_utils::INPUT_POST);
        $target  = rcube_utils::get_input_value('_target_mbox', rcube_utils::INPUT_POST, true);

        // PAMELA - Gérer la corbeille individuelle
        $data = $rcmail->plugins->exec_hook('mel_copy_message',
            array('target' => $target, 'continue' => true, 'copied' => 0, 'sources' => array()));

        $sources = $data['sources'];
        $copied  = $data['copied'];

        if ($data['continue']) {
            $target = $data['target'];

            foreach ($uids as $mbox => $uids) {
                if ($mbox === $target) {
                    $copied++;
                }
                else {
                    $copied += (int) $rcmail->storage->copy_message($uids, $target, $mbox);
                    $sources[] = $mbox;
                }
            }
        }

        if (!$copied) {
            self::display_server_error('errorcopying');
        }
        else {
            $rcmail->output->show_message('messagecopied', 'confirmation');

            self::send_unread_count($target, true);

            $rcmail->output->command('set_quota', self::quota_content(null, $multifolder ? $sources[0] : 'INBOX'));
        }

        $rcmail->output->send();
    }
}
