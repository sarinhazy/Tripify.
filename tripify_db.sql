CREATE DATABASE tripify_db;
USE tripify_db;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tripify_db`

--

-- --------------------------------------------------------


CREATE TABLE Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email varchar(100) not null
);
CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email varchar(100) not null
);
CREATE TABLE despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100),
    valor DECIMAL(10,2),
    pagador_id INT,
    FOREIGN KEY (pagador_id) REFERENCES participantes(id)
);

-- Tabela intermediária para controlar quem participou e o peso de cada um
CREATE TABLE participantes_despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    despesa_id INT,
    participante_id INT,
    peso DECIMAL(5,2) DEFAULT 1,
    FOREIGN KEY (despesa_id) REFERENCES despesas(id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
);
DROP TABLE IF EXISTS `cliente`;

CREATE TABLE IF NOT EXISTS `cliente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_nasc` varchar(10) NOT NULL,
  `interesse` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` char(15) NOT NULL,
  `senha` varchar(125) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id`, `data_nasc`, `interesse`, `email`, `telefone`, `senha`) VALUES
(18, '2004-12-22', 'gastronomia', 'analuisa@gmai.com', '(31) 98966-2382', '1234'),

--
-- Estrutura da tabela `empresa`
--

DROP TABLE IF EXISTS `Empresa`;
CREATE TABLE IF NOT EXISTS `Empresa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cnpj` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` char(15) NOT NULL,
  `senha` varchar(125) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `Empresa`
--

INSERT INTO `Empresa` (`id`, `data_nasc`,  `email`, `telefone`, `senha`) VALUES
(17, '2004-12-22', 'exemplo', 'exemplo@gmail', '(31) 98966-2382', '1234'),
(16, '0323-02-23', 'exemplo', 'exemplo@gmail', '(31) 98966-2382', '1234'),
(15, '1233-12-22', 'exemplo', 'exemplo@gmail', '(31) 98966-2382', '1234');

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--

DROP TABLE IF EXISTS `empresas`;
CREATE TABLE IF NOT EXISTS `empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone_comercial` char(15) NOT NULL,
  `cnpj` varchar(14) NOT NULL,
  `SenhaEmpresa` varchar(125) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `empresas`
--

INSERT INTO `empresas` (`id`, `nome`, `email`, `telefone_comercial`, `cnpj`, `SenhaEmpresa`) VALUES
(1, 'cleitom', 'hugao@gmail.com', '31989662382', '2324', '123'),
(3, 'addidas', 'teste@teste', '31989662382', '2332323', '1234'),
(4, 'Cedro', 'Cedro@minercedro', '31989662382', '2323232323', '1234');
COMMIT;