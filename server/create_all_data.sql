BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "users" (
                                        "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "username"	TEXT,
                                        "name"	TEXT,
                                        "salt"	TEXT,
                                        "password"	TEXT
);

CREATE TABLE IF NOT EXISTS "pages" (
                                        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "authorId" INTEGER,
                                        "creationDate" DATE,
                                        "publicationDate" DATE
);

CREATE TABLE IF NOT EXISTS "blocks" (
                                        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                                        "blockType" TEXT,
                                        "pageId" INTEGER,
                                        "content" TEXT
);

INSERT INTO users VALUES (1,'riccardo@test.com','Riccardo', '123348dusd437840', 'bddfdc9b092918a7f65297b4ba534dfe306ed4d5d72708349ddadb99b1c526fb'); /* password='pwd' */
INSERT INTO users VALUES (2,'stefano@test.com','Stefano',   '7732qweydg3sd637', '498a8d846eb4efebffc56fc0de16d18905714cf12edf548b8ed7a4afca0f7c1c');
INSERT INTO users VALUES (3,'simone@test.com','Simone',   'wgb32sge2sh7hse7', '09a79c91c41073e7372774fcb114b492b2b42f5e948c61d775ad4f628df0e160');
INSERT INTO users VALUES (4,'lorenzo@test.com','Lorenzo',   'safd6523tdwt82et', '330f9bd2d0472e3ca8f11d147d01ea210954425a17573d0f6b8240ed503959f8');
INSERT INTO users VALUES (5,'chiara@test.com','Chiara',   'ad37JHUW38wj2833', 'bbbcbac88d988bce98cc13e4c9308306d621d9e278ca62aaee2d156f898a41dd');

INSERT INTO pages VALUES (1, 1, '2023-06-06', '2023-06-10');
INSERT INTO pages VALUES (2, 2, '2023-06-06', '2023-06-10');

INSERT INTO blocks VALUES (1, 'header', 1, 'header pagina 1');
INSERT INTO blocks VALUES (2, 'immagine', 1, 'images/chatting.webp');
INSERT INTO blocks VALUES (3, 'header', 2, 'header pagina 2');
INSERT INTO blocks VALUES (4, 'paragrafo', 2, 'paragrafo pagina 2');

COMMIT;