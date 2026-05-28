<?php

/*
 * +-----------------------------------------------------------------------+
 * | Local configuration for the Roundcube Webmail installation. |
 * | |
 * | This is a sample configuration file only containing the minumum |
 * | setup required for a functional installation. Copy more options |
 * | from defaults.inc.php to this file to override the defaults. |
 * | | 
 * | This file is part of the Roundcube Webmail client | 
 * | Copyright (C) 2005-2013, The Roundcube Dev Team |
 * | |
 * | Licensed under the GNU General Public License version 3 or |
 * | any later version with exceptions for skins & plugins. |
 * | See the README file for a full license statement. |
 * +-----------------------------------------------------------------------+
 */
$config = [];

// Database connection string (DSN) for read+write operations
// Format (compatible with PEAR MDB2): db_provider://user:password@host/database
// Currently supported db_providers: mysql, pgsql, sqlite, mssql or sqlsrv
// For examples see http://pear.php.net/manual/en/package.database.mdb2.intro-dsn.php
// NOTE: for SQLite use absolute path: 'sqlite:////full/path/to/sqlite.db?mode=0646'
$config['db_dsnw'] = $_ENV['RC_DB_DSNW'];

// use persistent db-connections
// beware this will not "always" work as expected
// see: http://www.php.net/manual/en/features.persistent-connections.php
$config['db_persistent'] = $_ENV['RC_DB_PERSISTENT'] ?? true;

// The mail host chosen to perform the log-in.
// Leave blank to show a textbox at login, give a list of hosts
// to display a pulldown menu or set one host as string.
// To use SSL/TLS connection, enter hostname with prefix ssl:// or tls://
// Supported replacement variables:
// %n - hostname ($_SERVER['SERVER_NAME'])
// %t - hostname without the first part
// %d - domain (http hostname $_SERVER['HTTP_HOST'] without the first part)
// %s - domain name after the '@' from e-mail address provided at login screen
// For example %n = mail.domain.tld, %t = domain.tld
$config['default_host'] = $_ENV['RC_DEFAULT_HOST'];

// By default IMAP capabilities are readed after connection to IMAP server
// In some cases, e.g. when using IMAP proxy, there's a need to refresh the list
// after login. Set to True if you've got this case.
$config['imap_force_caps'] = $_ENV['RC_IMAP_FORCE_CAPS'] ?? false;

// By default list of subscribed folders is determined using LIST-EXTENDED
// extension if available. Some servers (dovecot 1.x) returns wrong results
// for shared namespaces in this case. http://trac.roundcube.net/ticket/1486225
// Enable this option to force LSUB command usage instead.
// Deprecated: Use imap_disabled_caps = array('LIST-EXTENDED')
$config['imap_force_lsub'] = $_ENV['RC_IMAP_FORCE_LSUB'] ?? false;

// Some server configurations (e.g. Courier) doesn't list folders in all namespaces
// Enable this option to force listing of folders in all namespaces
$config['imap_force_ns'] = $_ENV['RC_IMAP_FORCE_NS'] ?? false;

// IMAP socket context options
// See http://php.net/manual/en/context.ssl.php
// The example below enables server certificate validation
//$config['imap_conn_options'] = array(
//  'ssl'         => array(
//     'verify_peer'  => true,
//     'verify_depth' => 3,
//     'cafile'       => '/etc/openssl/certs/ca.crt',
//   ),
// );
$config['imap_conn_options'] = array(
    'ssl' => array(
        'verify_peer'  => $_ENV['RC_IMAP_CONN_OPTIONS_SSL_VERIFY_PEER'] ?? false,
    ),
);

// Password character set.
// If your authentication backend supports it, use "UTF-8".
// Otherwise, use the appropriate character set.
// Defaults to ISO-8859-1 for backward compatibility.
$config['password_charset'] = $_ENV['RC_PASSWORD_CHARSET'] ?? 'UTF-8';

// SMTP server host (for sending mails).
// To use SSL/TLS connection, enter hostname with prefix ssl:// or tls://
// If left blank, the PHP mail() function is used
// Supported replacement variables:
// %h - user's IMAP hostname
// %n - hostname ($_SERVER['SERVER_NAME'])
// %t - hostname without the first part
// %d - domain (http hostname $_SERVER['HTTP_HOST'] without the first part)
// %z - IMAP domain (IMAP hostname without the first part)
// For example %n = mail.domain.tld, %t = domain.tld
$config['smtp_server'] = $_ENV['RC_SMTP_SERVER'];

// SMTP port (default is 25; use 587 for STARTTLS or 465 for the
// deprecated SSL over SMTP (aka SMTPS))
$config['smtp_port'] = $_ENV['RC_SMTP_PORT'] ?? 25;

// SMTP username (if required) if you use %u as the username Roundcube
// will use the current username for login
$config['smtp_user'] = $_ENV['RC_SMTP_USER'] ?? '%u';

// SMTP password (if required) if you use %p as the password Roundcube
// will use the current user's password for login
$config['smtp_pass'] = $_ENV['RC_SMTP_PASS'] ?? '%p';

// SMTP HELO host
// Hostname to give to the remote server for SMTP 'HELO' or 'EHLO' messages
// Leave this blank and you will get the server variable 'server_name' or
// localhost if that isn't defined.
$config['smtp_helo_host'] = $_ENV['RC_SMTP_HELO_HOST'] ?? '';

// provide an URL where a user can get support for this Roundcube installation
// PLEASE DO NOT LINK TO THE ROUNDCUBE.NET WEBSITE HERE!
$config['support_url'] = $_ENV['RC_SUPPORT_URL'];

// replace Roundcube logo with this image
// specify an URL relative to the document root of this Roundcube installation
// an array can be used to specify different logos for specific template files, '*' for default logo
// for example array("*" => "/images/roundcube_logo.png", "messageprint" => "/images/roundcube_logo_print.png")
$config['skin_logo'] = [
    '[favicon]' => '/images/taskbar-logo.png',
];


// add this user-agent to message headers when sending
$rcmail_config['useragent'] = $_ENV['RC_USERAGENT'] ?? 'Bnum/' . RCMAIL_VERSION;

// use this name to compose page titles
$rcmail_config['product_name'] = $_ENV['RC_PRODUCT_NAME'] ?? 'Bnum';

// List of supported subject prefixes for a message reply
// This list is used to clean the subject when replying or sorting messages
$config['subject_reply_prefixes'] = $_ENV['RC_SUBJECT_REPLY_PREFIXES'] ?? ['Re:'];

// List of supported subject prefixes for a message forward
// This list is used to clean the subject when forwarding or sorting messages
$config['subject_forward_prefixes'] = $_ENV['RC_SUBJECT_FORWARD_PREFIXES'] ?? ['Fwd:', 'Fw:', 'Tr:'];

// Prefix to use in subject when replying to a message
$config['response_prefix'] = $_ENV['RC_RESPONSE_PREFIX'] ?? 'Re:';

// Prefix to use in subject when forwarding a message
$config['forward_prefix'] = $_ENV['RC_FORWARD_PREFIX'] ?? 'Tr:';

// this key is used to encrypt the users imap password which is stored
// in the session record (and the client cookie if remember password is enabled).
// please provide a string of exactly 24 chars.
// YOUR KEY MUST BE DIFFERENT THAN THE SAMPLE VALUE FOR SECURITY REASONS
$config['des_key'] = $_ENV['RC_DES_KEY'];

// Gestion des plugins pour le Courrielleur
if (isset($_GET['_courrielleur'])) {
	// List of active plugins (in plugins/ directory)
	$config['plugins'] = $_ENV['RC_COURRIELLEUR_PLUGINS'];
}
else {
    // List of active plugins (in plugins/ directory)
    $config['plugins'] = $_ENV['RC_PLUGINS'];
}

// Add it to the plugins list in config.inc.php to enable the user option
// set the global preference
$config['use_subscriptions'] = $_ENV['RC_USE_SUBSCRIPTIONS'] ?? false; // or false

// open message compose form in new window
$config['compose_extwin'] = $_ENV['RC_COMPOSE_EXTWIN'] ?? true;

// skin name: folder from skins/
$config['skin'] = 'mel_elastic';

// system error reporting, sum of: 1 = log; 4 = show, 8 = trace
$config['debug_level'] = $_ENV['RC_DEBUG_LEVEL'] ?? 1;

// log driver:  'syslog', 'stdout' or 'file'.
$config['log_driver'] = $_ENV['RC_LOG_DRIVER'] ?? 'file';

// use this folder to store log files (must be writeable for apache user)
// This is used by the 'file' log driver.
$config['log_dir'] = $_ENV['RC_LOG_DIR'] ?? '/var/log/roundcube/bnum';

// Log sent messages to <log_dir>/sendmail.log or to syslog
$config['smtp_log'] = $_ENV['RC_SMTP_LOG'] ?? false;

// Log successful/failed logins to <log_dir>/userlogins or to syslog
$config['log_logins'] = $_ENV['RC_LOG_LOGINS'] ?? false;

// Log session authentication errors to <log_dir>/session or to syslog
$config['log_session'] = $_ENV['RC_LOG_SESSION'] ?? false;

// Log SQL queries to <log_dir>/sql or to syslog
$config['sql_debug'] = $_ENV['RC_SQL_DEBUG'] ?? false;

// Log IMAP conversation to <log_dir>/imap or to syslog
$config['imap_debug'] = $_ENV['RC_IMAP_DEBUG'] ?? false;

// Log LDAP conversation to <log_dir>/ldap or to syslog
$config['ldap_debug'] = $_ENV['RC_LDAP_DEBUG'] ?? false;

// Log SMTP conversation to <log_dir>/smtp or to syslog
$config['smtp_debug'] = $_ENV['RC_SMTP_DEBUG'] ?? false;

// Session lifetime in minutes
$rcmail_config['session_lifetime'] = $_ENV['RC_SESSION_LIFETIME'] ?? 8 * 60;

// Maximum length (in bytes) of logon username and password.
$config['login_username_maxlen'] = $_ENV['RC_LOGIN_USERNAME_MAXLEN'] ?? 1024;
$config['login_password_maxlen'] = $_ENV['RC_LOGIN_PASSWORD_MAXLEN'] ?? 2048;

// Session name. Default: 'roundcube_sessid'
$rcmail_config['session_name'] = 'roundcube_sessid';

// Session authentication cookie name. Default: 'roundcube_sessauth'
$rcmail_config['session_auth_name'] = 'roundcube_sessauth';

// Backend to use for session storage. Can either be 'db' (default), 'memcache' or 'php'
// If set to 'memcache', a list of servers need to be specified in 'memcache_hosts'
// Make sure the Memcache extension (http://pecl.php.net/package/memcache) version >= 2.0.0 is installed
// Setting this value to 'php' will use the default session save handler configured in PHP
$config['session_storage'] = $_ENV['RC_SESSION_STORAGE'] ?? 'php';

// Use these hosts for accessing memcached
// Define any number of hosts in the form of hostname:port or unix:///path/to/socket.file
$config['memcache_hosts'] = $_ENV['RC_MEMCACHE_HOSTS']; // e.g. array( 'localhost:11211', '192.168.1.12:11211', 'unix:///var/tmp/memcached.sock' );

// Value in seconds which will be used for connecting to the daemon
// See http://php.net/manual/en/memcache.addserver.php
$config['memcache_timeout'] = $_ENV['RC_MEMCACHE_TIMEOUT'] ?? 5;

// Mark as read when viewing a message (delay in seconds)
// Set to -1 if messages should not be marked as read
$config['mail_read_time'] = $_ENV['RC_MAIL_READ_TIME'] ?? -1;

// Maximum number of recipients per message. Default: 0 (no limit)
$rcmail_config['max_recipients'] = $_ENV['RC_MAX_RECIPIENTS'] ?? 300;

// Use this charset as fallback for message decoding
$config['default_charset'] = $_ENV['RC_DEFAULT_CHARSET'] ?? 'UTF-8';

// the default locale setting (leave empty for auto-detection)
// RFC1766 formatted language name like en_US, de_DE, de_CH, fr_FR, pt_BR
$config['language'] = $_ENV['RC_LANGUAGE'] ?? 'fr_FR';

// Set identities access level:
// 0 - many identities with possibility to edit all params
// 1 - many identities with possibility to edit all params but not email address
// 2 - one identity with possibility to edit all params
// 3 - one identity with possibility to edit all params but not email address
// 4 - one identity with possibility to edit only signature
$rcmail_config['identities_level'] = $_ENV['RC_IDENTITIES_LEVEL'] ?? 3;

// use this format for date display (date or strftime format)
$rcmail_config['date_format'] = $_ENV['RC_DATE_FORMAT'] ?? 'd/m/Y';

// use this format for detailed date/time formatting (derived from date_format and time_format)
$rcmail_config['date_long'] = $_ENV['RC_DATE_LONG'] ?? 'd/m/Y H:i';

// store draft message is this mailbox
// leave blank if draft messages should not be stored
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['drafts_mbox'] = $_ENV['RC_DRAFTS_MBOX'] ?? 'Brouillons';

// store spam messages in this mailbox
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['junk_mbox'] = $_ENV['RC_JUNK_MBOX'] ?? 'Indésirables';

// store sent message is this mailbox
// leave blank if sent messages should not be stored
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['sent_mbox'] = $_ENV['RC_SENT_MBOX'] ?? 'Éléments envoyés';

// move messages to this folder when deleting them
// leave blank if they should be deleted directly
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['trash_mbox'] = $_ENV['RC_TRASH_MBOX'] ?? 'Corbeille';

// store models message is this mailbox
// leave blank if models messages should not be stored
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['models_mbox'] = $_ENV['RC_MODELS_MBOX'] ?? 'Modèles';

// display these folders separately in the mailbox list.
// these folders will also be displayed with localized names
// NOTE: Use folder names with namespace prefix (INBOX. on Courier-IMAP)
$rcmail_config['default_folders'] = $_ENV['RC_DEFAULT_FOLDERS'] ?? [
    'INBOX',
    'drafts',
    'models',
    'sent',
    'junk',
    'trash'
];

// default messages sort column. Use empty value for default server's sorting,
// or 'arrival', 'date', 'subject', 'from', 'to', 'fromto', 'size', 'cc'
$config['message_sort_col'] = $_ENV['RC_MESSAGE_SORT_COL'] ?? 'arrival';

// default messages sort order
$config['message_sort_order'] = $_ENV['RC_MESSAGE_SORT_ORDER'] ?? 'DESC';

// These cols are shown in the message list. Available cols are:
// subject, from, to, fromto, cc, replyto, date, size, status, flag, attachment, 'priority'
$config['list_cols'] = $_ENV['RC_LIST_COLS'] ?? ['status', 'fromto', 'subject', 'attachment', 'labels', 'date', 'priority'];

// This indicates which type of address book to use. Possible choises:
// 'sql' (default), 'ldap' and ''.
// If set to 'ldap' then it will look at using the first writable LDAP
// address book as the primary address book and it will not display the
// SQL address book in the 'Address Book' view.
// If set to '' then no address book will be displayed or only the
// addressbook which is created by a plugin (like CardDAV).
$rcmail_config['address_book_type'] = $_ENV['RC_ADDRESS_BOOK_TYPE'] ?? '';

// sort contacts by this col (preferably either one of name, firstname, surname)
$config['addressbook_sort_col'] = $_ENV['RC_ADDRESSBOOK_SORT_COL'] ?? 'name';

// Contact mode. If your contacts are mostly business, switch it to 'business'.
// This will prioritize form fields related to 'work' (instead of 'home').
// Default: 'private'.
$config['contact_form_mode'] = $_ENV['RC_CONTACT_FORM_MODE'] ?? 'business';

/*
 * Config ldap directory
 */
$rcmail_config['ldap_public'] = $_ENV['RC_LDAP_PUBLIC'] ?? []; 

// An ordered array of the ids of the addressbooks that should be searched
// when populating address autocomplete fields server-side. ex: array('sql','Verisign');
$rcmail_config['autocomplete_addressbooks'] = $_ENV['RC_AUTOCOMPLETE_ADDRESSBOOKS'] ?? [
    'sql',
    'amande'
];

// The minimum number of characters required to be typed in an autocomplete field
// before address books will be searched. Most useful for LDAP directories that
// may need to do lengthy results building given overly-broad searches
$rcmail_config['autocomplete_min_length'] = $_ENV['RC_AUTOCOMPLETE_MIN_LENGTH'] ?? 3;

// Number of parallel autocomplete requests.
// If there's more than one address book, n parallel (async) requests will be created,
// where each request will search in one address book. By default (0), all address
// books are searched in one request.
$rcmail_config['autocomplete_threads'] = $_ENV['RC_AUTOCOMPLETE_THREADS'] ?? 2;

// Max. numer of entries in autocomplete popup. Default: 15.
$rcmail_config['autocomplete_max'] = $_ENV['RC_AUTOCOMPLETE_MAX'] ?? 50;

// Clean duplicates in automcomplete list. Default: false
$config['autocomplete_clean_duplicates'] = $_ENV['RC_AUTOCOMPLETE_CLEAN_DUPLICATES'] ?? true;

// show address fields in this order
// available placeholders: {street}, {locality}, {zipcode}, {country}, {region}
$rcmail_config['address_template'] = $_ENV['RC_ADDRESS_TEMPLATE'] ?? '{street}<br/>{locality} {zipcode}<br/>{country} {region}';

// Matching mode for addressbook search (including autocompletion)
// 0 - partial (*abc*), default
// 1 - strict (abc)
// 2 - prefix (abc*)
// Note: For LDAP sources fuzzy_search must be enabled to use 'partial' or 'prefix' mode
$rcmail_config['addressbook_search_mode'] = $_ENV['RC_ADDRESSBOOK_SEARCH_MODE'] ?? 2;

// Default fields configuration for mail search.
// The array can contain a per-folder list of header fields which should be considered when searching
// The entry with key '*' stands for all folders which do not have a specific list set.
// Supported fields: subject, from, to, cc, bcc, body, text.
// Please note that folder names should to be in sync with $config['*_mbox'] options
$config['search_mods'] = $_ENV['RC_SEARCH_MODS'] ?? [
    '*'                             => ['subject' => 1, 'from' => 1 ],
    'Brouillons'                    => ['subject' => 1, 'to' => 1],
    '&AMk-l&AOk-ments envoy&AOk-s'  => ['subject' => 1, 'to' => 1],
    'Mod&AOg-les'                   => ['subject' => 1, 'to' => 1],
];//array('*' => array('subject'=>1, 'from'=>1));  // Example: ['*' => ['subject'=>1, 'from'=>1], 'Sent' => ['subject'=>1, 'to'=>1]];

// Defaults of the addressbook search field configuration.
$config ['addressbook_search_mods'] = $_ENV['RC_ADDRESSBOOK_SEARCH_MODS'] ?? [
    'name' => 1,
    'email' => 1
]; // Example: array('name'=>1, 'firstname'=>1, 'surname'=>1, 'email'=>1, '*'=>1);

// Mark as read when viewing a message (delay in seconds)
// Set to -1 if messages should not be marked as read
$config['mail_read_time'] = $_ENV['RC_MAIL_READ_TIME'] ?? 5;

// Encoding of long/non-ascii attachment names:
// 0 - Full RFC 2231 compatible
// 1 - RFC 2047 for 'name' and RFC 2231 for 'filename' parameter (Thunderbird's default)
// 2 - Full 2047 compatible
$rcmail_config['mime_param_folding'] = $_ENV['RC_MIME_PARAM_FOLDING'] ?? 0;

// Set true if deleted messages should not be displayed
// This will make the application run slower
$rcmail_config['skip_deleted'] = $_ENV['RC_SKIP_DELETED'] ?? true;

// Default interval for auto-refresh requests (in seconds)
// These are requests for system state updates e.g. checking for new messages, etc.
// Setting it to 0 disables the feature.
$rcmail_config['refresh_interval'] = $_ENV['RC_REFRESH_INTERVAL'] ?? 10 * 60;

// Message size limit. Note that SMTP server(s) may use a different value.
// This limit is verified when user attaches files to a composed message.
// Size in bytes (possible unit suffix: K, M, G)
$config['max_message_size'] = $_ENV['RC_MAX_MESSAGE_SIZE'] ?? '25M';

// open message compose form in new window
$config['compose_extwin'] = $_ENV['RC_COMPOSE_EXTWIN'] ?? false;

// Use session to store user emails list in cache (true/false)
$config['user_list_emails_cache'] = $_ENV['RC_USER_LIST_EMAILS_CACHE'] ?? true;

// Use session to store rcube_user info in cache (true/false)
$config['rcube_user_cache'] = $_ENV['RC_RCUBE_USER_CACHE'] ?? true;

// Type of IMAP indexes cache. Supported values: 'db', 'apc' and 'memcache'.
$config['imap_cache'] = $_ENV['RC_IMAP_CACHE'] ?? 'memcache';

// Lifetime of IMAP indexes cache. Possible units: s, m, h, d, w
$config['imap_cache_ttl'] = $_ENV['RC_IMAP_CACHE_TTL'] ?? '30d';

// Enables messages cache. Only 'db' cache is supported.
$config['messages_cache'] = $_ENV['RC_MESSAGES_CACHE'] ?? '';

// Lifetime of messages cache. Possible units: s, m, h, d, w
$config['messages_cache_ttl'] = $_ENV['RC_MESSAGES_CACHE_TTL'] ?? '20d';

// Maximum cached message size in kilobytes.
// Note: On MySQL this should be less than (max_allowed_packet - 30%)
$config['messages_cache_threshold'] = $_ENV['RC_MESSAGES_CACHE_THRESHOLD'] ?? 150;

// don't let users set pagesize to more than this value if set
$config['max_pagesize'] = $_ENV['RC_MAX_PAGESIZE'] ?? 2000;

// Maximum number of recipients per message exluding Bcc header.
// This is a soft limit, which means we only display a warning to the user.
// Default: 5
$config['max_disclosed_recipients'] = $_ENV['RC_MAX_DISCLOSED_RECIPIENTS'] ?? 300;

// Set the spell checking engine.
$config['spellcheck_engine'] = $_ENV['RC_SPELLCHECK_ENGINE'] ?? 'enchant';

// These languages can be selected for spell checking
// and should match the list of installed apsell dictionaries
$config['spellcheck_languages'] = $_ENV['RC_SPELLCHECK_ENGINE'] ?? ['fr'];

// Makes that words with all letters capitalized will be ignored (e.g. GOOGLE)
$config['spellcheck_ignore_caps'] = $_ENV['RC_SPELLCHECK_IGNORE_CAPS'] ?? false;

// Makes that words with numbers will be ignored (e.g. g00gle)
$config['spellcheck_ignore_nums'] = $_ENV['RC_SPELLCHECK_IGNORE_NUMS'] ?? true;

// Makes that words with symbols will be ignored (e.g. g@@gle)
$config['spellcheck_ignore_syms'] = $_ENV['RC_SPELLCHECK_IGNORE_SYMS'] ?? true;

// use this folder to store temp files (must be writeable for apache user)
$config['temp_dir'] = $_ENV['RC_TEMP_DIR'] ?? '/m2/temp';

// expire files in temp_dir after 48 hours
// possible units: s, m, h, d, w
$config['temp_dir_ttl'] = $_ENV['RC_TEMP_DIR_TTL'] ?? '1h';

// Enables display of email address with name instead of a name (and address in title)
$config['message_show_email'] = $_ENV['RC_MESSAGE_SHOW_EMAIL'] ?? true;

// show up to X items in messages list view
$config['mail_pagesize'] = $_ENV['RC_MAIL_PAGESIZE'] ?? 100;

// show up to X items in contacts list view
$config['addressbook_pagesize'] = $_ENV['RC_ADDRESSBOOK_PAGESIZE'] ?? 2000;

// Default messages listing mode. One of 'threads' or 'list'.
$config['default_list_mode'] = $_ENV['RC_DEFAULT_LIST_MODE'] ?? 'list';

// When replying:
// -1 - don't cite the original message
// 0 - place cursor below the original message
// 1 - place cursor above original message (top posting)
$config['reply_mode'] = $_ENV['RC_REPLY_MODE'] ?? 1;

// don't allow these settings to be overriden by the user
$config['dont_override'] = $_ENV['RC_DONT_OVERRIDE'] ?? [
    'skin',
    'use_infinite_scroll',
    'preview_pane',
    'addressbook_pagesize',
    'mail_pagesize',
    'drafts_mbox',
    'junk_mbox',
    'trash_mbox',
    'sent_mbox',
    'default_folders',
    'show_real_foldernames',
	'use_subscriptions',
  	'search_mods',
	// MANTIS 0008186: Masquer les options non nécessaires
	'read_when_deleted',
	'flag_for_deletion',
	'skip_deleted',
	'delete_junk',
	'logout_expunge',
	'mime_param_folding',
	'force_7bit',
	'compose_save_localstorage',
	'default_charset',
];

// Some servers do not support folders with both folders and messages inside
// If your server supports that use true, if it does not, use false.
// By default it will be determined automatically (once per user session).
$config['imap_dual_use_folders'] = $_ENV['RC_IMAP_DUAL_USE_FOLDERS'] ?? true;