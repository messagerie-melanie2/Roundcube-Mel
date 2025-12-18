ALTER TABLE identities
ADD COLUMN signature_medium text,
ADD COLUMN html_signature_medium integer DEFAULT 0 NOT NULL,
ADD COLUMN signature_simple text,
ADD COLUMN html_signature_simple integer DEFAULT 0 NOT NULL;