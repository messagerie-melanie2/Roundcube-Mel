ALTER TABLE "session" DROP COLUMN created;

UPDATE system SET value = '2016081200' WHERE name = 'roundcube-version';
