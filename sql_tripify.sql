CREATE DATABASE tripify_db;
USE tripify_db;

CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100),
    valor DECIMAL(10,2),
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    pagador_id INT,
    FOREIGN KEY (pagador_id) REFERENCES participantes(id)
);

CREATE TABLE participantes_despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    despesa_id INT,
    participante_id INT,
    peso DECIMAL(5,2) DEFAULT 1,
    FOREIGN KEY (despesa_id) REFERENCES despesas(id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
);


CREATE TABLE viagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_inicio DATE,
    data_fim DATE
);


ALTER TABLE despesas ADD viagem_id INT;
ALTER TABLE despesas ADD CONSTRAINT fk_viagem FOREIGN KEY (viagem_id) REFERENCES viagens(id);
