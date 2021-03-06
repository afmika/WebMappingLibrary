
CREATE DATABASE SIG;
USE SIG;

CREATE TABLE Terrain (
    idterrain INT AUTO_INCREMENT PRIMARY KEY,
	nom VARCHAR(20),
	proprio VARCHAR(20),
	prix int,
	type VARCHAR(10),
	forme VARCHAR(5000)
) engine=innodb;

INSERT INTO Terrain VALUES (null, 'Zone A', 'afmika', 1200, "polygon", '[{\"x\":234,\"y\":211},{\"x\":234,\"y\":211},{\"x\":233,\"y\":99},{\"x\":233,\"y\":99},{\"x\":144,\"y\":123},{\"x\":143,\"y\":123},{\"x\":93,\"y\":224},{\"x\":91,\"y\":224},{\"x\":130,\"y\":272},{\"x\":131,\"y\":273},{\"x\":168,\"y\":320},{\"x\":169,\"y\":321},{\"x\":281,\"y\":333},{\"x\":281,\"y\":333},{\"x\":417,\"y\":270},{\"x\":417,\"y\":270},{\"x\":435,\"y\":179},{\"x\":435,\"y\":179},{\"x\":398,\"y\":101},{\"x\":398,\"y\":101},{\"x\":352,\"y\":60},{\"x\":352,\"y\":60},{\"x\":317,\"y\":40},{\"x\":317,\"y\":39},{\"x\":289,\"y\":26},{\"x\":289,\"y\":26}]');
INSERT INTO Terrain VALUES (null, 'Zone B', 'Rabe', 1300,"polygon", '[{\"x\":546,\"y\":324},{\"x\":504,\"y\":389},{\"x\":567,\"y\":428},{\"x\":608,\"y\":402},{\"x\":608,\"y\":370},{\"x\":608,\"y\":338},{\"x\":599,\"y\":314},{\"x\":584,\"y\":311},{\"x\":558,\"y\":306},{\"x\":539,\"y\":310}]');
INSERT INTO Terrain VALUES (null, 'Zone C', 'publique', 2000,"polygon",  '[{\"x\":603,\"y\":190},{\"x\":595,\"y\":245},{\"x\":632,\"y\":256},{\"x\":652,\"y\":234},{\"x\":653,\"y\":209},{\"x\":639,\"y\":193}]');
INSERT INTO Terrain VALUES (null, 'Zone D', 'aucun', 0,"polygon", '[{\"x\":598,\"y\":40},{\"x\":624,\"y\":86},{\"x\":659,\"y\":67},{\"x\":644,\"y\":40}]');
