ALTER TABLE "users" ADD failed_login timestamp with time zone DEFAULT NULL;
ALTER TABLE "users" ADD failed_login_counter integer DEFAULT NULL;

UPDATE system SET value = '2015111100' WHERE name = 'roundcube-version';
