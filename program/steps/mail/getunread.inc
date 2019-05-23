<?php

/**
 +-----------------------------------------------------------------------+
 | program/steps/mail/getunread.inc                                      |
 |                                                                       |
 | This file is part of the Roundcube Webmail client                     |
 | Copyright (C) 2005-2013, The Roundcube Dev Team                       |
 |                                                                       |
 | Licensed under the GNU General Public License version 3 or            |
 | any later version with exceptions for skins & plugins.                |
 | See the README file for a full license statement.                     |
 |                                                                       |
 | PURPOSE:                                                              |
 |   Check all mailboxes for unread messages and update GUI              |
 |                                                                       |
 +-----------------------------------------------------------------------+
 | Author: Thomas Bruederli <roundcube@gmail.com>                        |
 +-----------------------------------------------------------------------+
*/

$a_folders = $RCMAIL->storage->list_folders_subscribed('', '*', 'mail');

if (!empty($a_folders)) {
    $current   = $RCMAIL->storage->get_folder();
    // PAMELA - Change the IMAP folder name with a plugin (change INBOX for shared mailboxes)
    $data = $RCMAIL->plugins->exec_hook('m2_set_folder_name',
      array('folder' => 'INBOX'));
    $inbox     = ($current == $data['folder']);
    $trash     = $RCMAIL->config->get('trash_mbox');
    $check_all = (bool)$RCMAIL->config->get('check_all_folders');

    foreach ($a_folders as $mbox) {
        $unseen_old = rcmail_get_unseen_count($mbox);

        if (!$check_all && $unseen_old !== null && $mbox != $current) {
            $unseen = $unseen_old;
        }
        else {
            $unseen = $RCMAIL->storage->count($mbox, 'UNSEEN', $unseen_old === null);
        }

        // call it always for current folder, so it can update counter
        // after possible message status change when opening a message
        // not in preview frame
        if ($unseen || $unseen_old === null || $mbox == $current) {
            // PAMELA - Change the IMAP folder name with a plugin (change INBOX for shared mailboxes)
            $OUTPUT->command('set_unread_count', $mbox, $unseen, $inbox && $mbox_row == $data['folder']);
        }

        rcmail_set_unseen_count($mbox, $unseen);

        // set trash folder state
        if ($mbox === $trash) {
            $OUTPUT->command('set_trash_count', $RCMAIL->storage->count($mbox, 'EXISTS'));
        }
    }
}

$OUTPUT->send();