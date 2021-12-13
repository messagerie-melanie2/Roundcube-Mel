ALTER TABLE session ALTER COLUMN ip TYPE character varying(41);

UPDATE system SET value = '2016100900' WHERE name = 'roundcube-version';
