BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "users" (
                                        "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "email"	TEXT,
                                        "name"	TEXT,
                                        "salt"	TEXT,
                                        "password"	TEXT,
                                        "admin" INTEGER
);

CREATE TABLE IF NOT EXISTS "pages" (
                                        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "title" TEXT,
                                        "authorId" INTEGER,
                                        "creationDate" DATE,
                                        "publicationDate" DATE
);

CREATE TABLE IF NOT EXISTS "blocks" (
                                        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "blockType" TEXT,
                                        "pageId" INTEGER,
                                        "content" TEXT,
                                        "order" INTEGER
);

CREATE TABLE IF NOT EXISTS "images" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "url" TEXT
);

CREATE TABLE IF NOT EXISTS "title" (
    "title" TEXT PRIMARY KEY
);

/* password='prova' per tutti gli utenti */
INSERT INTO users VALUES (1,'riccardo@test.com','Riccardo', 'uyrbh75689gtobhr', '1000c66ce7d62b1119fe9c599c127819fdd516ff91adc703161531f71964f476', 1);
INSERT INTO users VALUES (2,'stefano@test.com','Stefano',   '478fgmde306hnlff', '4ac68149d953a9cbea196d74b0d685d52da62b16510f68b45f7636ea9fc1a45f', 0);
INSERT INTO users VALUES (3,'simone@test.com','Simone',   '40hjnfetupnqzunr', '95309c38cfda3f5183ed1c65bf40e91e7870a4b4c8453bd0fcbc3e8e4cc375c1', 1);
INSERT INTO users VALUES (4,'lorenzo@test.com','Lorenzo',   '846hcnkytnavc06c', '1f97a02f1ff1f3f5d8b0710b98ef8920364a5b3a8a465cc4a6ea37f72014efbd', 0);
INSERT INTO users VALUES (5,'chiara@test.com','Chiara',   'jvnatf950jkmvcru', '3177b2f789fb18135ed2e32f4e15f44e20d49356e66439dcb02ef23b6af00618', 0);

INSERT INTO pages VALUES (1, 'Titolo1', 1, '2023-06-06', '2023-06-09');
INSERT INTO pages VALUES (2, 'Titolo2', 2, '2023-06-06', '2023-06-09');
INSERT INTO pages VALUES (3, 'Titolo3', 3, '2023-06-06', '2024-06-09');

INSERT INTO blocks VALUES (1, 'header', 1, 'header pagina 1', 1);
INSERT INTO blocks VALUES (2, 'immagine', 1, 'http://localhost:3001/images/chatting.webp', 2);
INSERT INTO blocks VALUES (3, 'header', 2, 'header pagina 2', 1);
INSERT INTO blocks VALUES (4, 'paragrafo', 2, 'paragrafo pagina 2', 2);
INSERT INTO blocks VALUES (5, 'header', 3, 'header pagina 3', 1);
INSERT INTO blocks VALUES (6, 'immagine', 3, 'http://localhost:3001/images/ok.webp', 2);

INSERT INTO images VALUES (1, 'http://localhost:3001/images/chatting.webp');
INSERT INTO images VALUES (2, 'http://localhost:3001/images/ok.webp');
INSERT INTO images VALUES (3, 'http://localhost:3001/images/pepog.webp');
INSERT INTO images VALUES (4, 'http://localhost:3001/images/hackerman.webp');

INSERT INTO title VALUES ('Content Management system');

COMMIT;