ALTER TABLE "users" ALTER COLUMN "preferences" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT NULL;

UPDATE system SET value = '2020122900' WHERE name = 'roundcube-version';
