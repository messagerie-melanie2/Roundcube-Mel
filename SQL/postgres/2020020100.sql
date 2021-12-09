ALTER TABLE "dictionary" ALTER COLUMN "language" TYPE varchar(16);
ALTER TABLE "users" ALTER COLUMN "language" TYPE varchar(16);

UPDATE system SET value = '2020020100' WHERE name = 'roundcube-version';
