-- =====================================================
-- StarSales Database Schema - Oracle Database
-- Oracle 11g+
-- =====================================================

-- =====================================================
-- Drop objetos existentes (para permitir reexecução)
-- =====================================================
-- Nota: Erros de "objeto não existe" serão ignorados

DECLARE
    v_sql VARCHAR2(1000);
    v_object_not_exists EXCEPTION;
    PRAGMA EXCEPTION_INIT(v_object_not_exists, -942);
    v_sequence_not_exists EXCEPTION;
    PRAGMA EXCEPTION_INIT(v_sequence_not_exists, -2289);
BEGIN
    -- Drop views
    BEGIN
        EXECUTE IMMEDIATE 'DROP VIEW v_clientes_top';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP VIEW v_vendas_por_regiao';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP VIEW v_produtos_mais_vendidos';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP VIEW v_vendas_completas';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    -- Drop tables (ordem reversa devido a FKs)
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE venda_produtos CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE vendas CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE produtos CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE categorias CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE clientes CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE usuarios CASCADE CONSTRAINTS';
    EXCEPTION
        WHEN v_object_not_exists THEN NULL;
    END;
    
    -- Drop sequences
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE seq_venda_produtos';
    EXCEPTION
        WHEN v_sequence_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE seq_vendas';
    EXCEPTION
        WHEN v_sequence_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE seq_produtos';
    EXCEPTION
        WHEN v_sequence_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE seq_categorias';
    EXCEPTION
        WHEN v_sequence_not_exists THEN NULL;
    END;
    
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE seq_clientes';
    EXCEPTION
        WHEN v_sequence_not_exists THEN NULL;
    END;
END;

-- =====================================================
-- Sequências (para auto-increment)
-- =====================================================
CREATE SEQUENCE seq_clientes START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_categorias START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_produtos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_vendas START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_venda_produtos START WITH 1 INCREMENT BY 1;

-- =====================================================
-- Tabela: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id VARCHAR2(36) PRIMARY KEY,
    nome VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nota: índice em 'email' criado automaticamente pela constraint UNIQUE

-- =====================================================
-- Tabela: clientes
-- =====================================================
CREATE TABLE clientes (
    id_cliente NUMBER PRIMARY KEY,
    nome VARCHAR2(255) NOT NULL,
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    idade NUMBER NOT NULL CHECK (idade >= 0 AND idade <= 150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_sexo ON clientes(sexo);

-- Trigger para auto-increment
CREATE OR REPLACE TRIGGER trg_clientes_id
BEFORE INSERT ON clientes
FOR EACH ROW
BEGIN
    IF :NEW.id_cliente IS NULL THEN
        SELECT seq_clientes.NEXTVAL INTO :NEW.id_cliente FROM dual;
    END IF;
END;

-- =====================================================
-- Tabela: categorias
-- =====================================================
CREATE TABLE categorias (
    id_categoria NUMBER PRIMARY KEY,
    nome_categoria VARCHAR2(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para auto-increment
CREATE OR REPLACE TRIGGER trg_categorias_id
BEFORE INSERT ON categorias
FOR EACH ROW
BEGIN
    IF :NEW.id_categoria IS NULL THEN
        SELECT seq_categorias.NEXTVAL INTO :NEW.id_categoria FROM dual;
    END IF;
END;

-- =====================================================
-- Tabela: produtos
-- =====================================================
CREATE TABLE produtos (
    id_produto NUMBER PRIMARY KEY,
    cd_produto VARCHAR2(50) NOT NULL UNIQUE,
    nome VARCHAR2(255) NOT NULL,
    preco_unitario NUMBER(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    id_categoria NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produtos_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categorias(id_categoria)
);

-- Índices
CREATE INDEX idx_produtos_categoria ON produtos(id_categoria);
CREATE INDEX idx_produtos_nome ON produtos(nome);
-- Nota: índice em 'cd_produto' criado automaticamente pela constraint UNIQUE

-- Trigger para auto-increment
CREATE OR REPLACE TRIGGER trg_produtos_id
BEFORE INSERT ON produtos
FOR EACH ROW
BEGIN
    IF :NEW.id_produto IS NULL THEN
        SELECT seq_produtos.NEXTVAL INTO :NEW.id_produto FROM dual;
    END IF;
END;

-- =====================================================
-- Tabela: vendas
-- =====================================================
CREATE TABLE vendas (
    id_venda NUMBER PRIMARY KEY,
    id_usuario VARCHAR2(36) NOT NULL,
    id_cliente NUMBER NOT NULL,
    nome_cliente VARCHAR2(255) NOT NULL,
    sexo_cliente CHAR(1) NOT NULL CHECK (sexo_cliente IN ('M', 'F')),
    idade_cliente NUMBER NOT NULL,
    regiao_venda VARCHAR2(50) NOT NULL CHECK (regiao_venda IN ('Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul')),
    data_venda TIMESTAMP NOT NULL,
    total NUMBER(10, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendas_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id),
    CONSTRAINT fk_vendas_cliente FOREIGN KEY (id_cliente) 
        REFERENCES clientes(id_cliente)
);

-- Índices
CREATE INDEX idx_vendas_usuario ON vendas(id_usuario);
CREATE INDEX idx_vendas_cliente ON vendas(id_cliente);
CREATE INDEX idx_vendas_data ON vendas(data_venda);
CREATE INDEX idx_vendas_regiao ON vendas(regiao_venda);
CREATE INDEX idx_vendas_data_usuario ON vendas(data_venda, id_usuario);

-- Trigger para auto-increment
CREATE OR REPLACE TRIGGER trg_vendas_id
BEFORE INSERT ON vendas
FOR EACH ROW
BEGIN
    IF :NEW.id_venda IS NULL THEN
        SELECT seq_vendas.NEXTVAL INTO :NEW.id_venda FROM dual;
    END IF;
END;

-- =====================================================
-- Tabela: venda_produtos
-- =====================================================
CREATE TABLE venda_produtos (
    id_venda_produto NUMBER PRIMARY KEY,
    id_venda NUMBER NOT NULL,
    id_produto NUMBER NOT NULL,
    nome_produto VARCHAR2(255) NOT NULL,
    quantidade NUMBER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMBER(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    id_categoria NUMBER NOT NULL,
    subtotal NUMBER(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venda_produtos_venda FOREIGN KEY (id_venda) 
        REFERENCES vendas(id_venda) ON DELETE CASCADE,
    CONSTRAINT fk_venda_produtos_produto FOREIGN KEY (id_produto) 
        REFERENCES produtos(id_produto),
    CONSTRAINT uk_venda_produto UNIQUE (id_venda, id_produto)
);

-- Índices
CREATE INDEX idx_venda_produtos_venda ON venda_produtos(id_venda);
CREATE INDEX idx_venda_produtos_produto ON venda_produtos(id_produto);
CREATE INDEX idx_venda_produtos_categoria ON venda_produtos(id_categoria);

-- Trigger para auto-increment
CREATE OR REPLACE TRIGGER trg_venda_produtos_id
BEFORE INSERT ON venda_produtos
FOR EACH ROW
BEGIN
    IF :NEW.id_venda_produto IS NULL THEN
        SELECT seq_venda_produtos.NEXTVAL INTO :NEW.id_venda_produto FROM dual;
    END IF;
END;

-- =====================================================
-- Triggers para updated_at
-- =====================================================

CREATE OR REPLACE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER trg_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER trg_categorias_updated_at
BEFORE UPDATE ON categorias
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER trg_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER trg_vendas_updated_at
BEFORE UPDATE ON vendas
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;

-- =====================================================
-- Seeds de Dados Iniciais
-- =====================================================

-- Categorias
INSERT INTO categorias (nome_categoria) VALUES ('Eletrônicos');
INSERT INTO categorias (nome_categoria) VALUES ('Alimentos');
INSERT INTO categorias (nome_categoria) VALUES ('Roupas');
INSERT INTO categorias (nome_categoria) VALUES ('Móveis');
INSERT INTO categorias (nome_categoria) VALUES ('Livros');

-- Produtos
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('EL001', 'Smartphone', 1500.00, 1);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('EL002', 'Notebook', 2500.00, 1);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('AL001', 'Café Premium', 45.00, 2);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('AL002', 'Chá Especial', 35.00, 2);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('RO001', 'Camisa Social', 120.00, 3);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('RO002', 'Calça Jeans', 150.00, 3);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('MO001', 'Cadeira Escritório', 800.00, 4);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('MO002', 'Mesa Escritório', 1200.00, 4);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('LI001', 'Livro Técnico', 65.00, 5);
INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria) VALUES ('LI002', 'Romance', 45.00, 5);

-- Clientes
INSERT INTO clientes (nome, sexo, idade) VALUES ('João Silva', 'M', 35);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Maria Santos', 'F', 28);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Pedro Oliveira', 'M', 42);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Ana Costa', 'F', 31);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Carlos Souza', 'M', 45);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Julia Lima', 'F', 26);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Roberto Alves', 'M', 38);
INSERT INTO clientes (nome, sexo, idade) VALUES ('Patricia Rocha', 'F', 33);

-- Usuário ADMIN
-- Senha: admin123 (já hasheada com bcrypt)
INSERT INTO usuarios (id, nome, email, password, created_at, updated_at) 
VALUES ('ADMIN-USER-ID-001', 'Administrador', 'admin@admin.com', '$2b$10$DSxfBLkxbOjPp0Q5axFSFOlrbODEyhqubU1A9WWDIFlx4M2r3JeLS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;

-- =====================================================
-- Vendas de Exemplo para usuário ADMIN
-- Dados diversificados ao longo de 12 meses
-- =====================================================

-- Janeiro 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 1, 'João Silva', 'M', 35, 'Sudeste', TO_TIMESTAMP('2025-01-05 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 3150.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (1, 1, 'Smartphone', 2, 1500.00, 1, 3000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (1, 3, 'Café Premium', 3, 45.00, 2, 135.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (1, 10, 'Romance', 1, 65.00, 5, 65.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 2, 'Maria Santos', 'F', 28, 'Sul', TO_TIMESTAMP('2025-01-12 14:20:00', 'YYYY-MM-DD HH24:MI:SS'), 270.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (2, 5, 'Camisa Social', 2, 120.00, 3, 240.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (2, 4, 'Chá Especial', 1, 35.00, 2, 35.00);

-- Fevereiro 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 3, 'Pedro Oliveira', 'M', 42, 'Nordeste', TO_TIMESTAMP('2025-02-08 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 4200.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (3, 2, 'Notebook', 1, 2500.00, 1, 2500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (3, 7, 'Cadeira Escritório', 2, 800.00, 4, 1600.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (3, 9, 'Livro Técnico', 2, 65.00, 5, 130.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 4, 'Ana Costa', 'F', 31, 'Centro-Oeste', TO_TIMESTAMP('2025-02-14 16:45:00', 'YYYY-MM-DD HH24:MI:SS'), 1950.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (4, 8, 'Mesa Escritório', 1, 1200.00, 4, 1200.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (4, 6, 'Calça Jeans', 5, 150.00, 3, 750.00);

-- Março 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 5, 'Carlos Souza', 'M', 45, 'Sudeste', TO_TIMESTAMP('2025-03-03 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1800.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (5, 1, 'Smartphone', 1, 1500.00, 1, 1500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (5, 5, 'Camisa Social', 2, 120.00, 3, 240.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (5, 3, 'Café Premium', 1, 45.00, 2, 45.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 6, 'Julia Lima', 'F', 26, 'Sul', TO_TIMESTAMP('2025-03-20 13:30:00', 'YYYY-MM-DD HH24:MI:SS'), 395.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (6, 6, 'Calça Jeans', 2, 150.00, 3, 300.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (6, 10, 'Romance', 2, 45.00, 5, 90.00);

-- Abril 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 7, 'Roberto Alves', 'M', 38, 'Norte', TO_TIMESTAMP('2025-04-10 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 5500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (7, 2, 'Notebook', 2, 2500.00, 1, 5000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (7, 1, 'Smartphone', 1, 1500.00, 1, 1500.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 8, 'Patricia Rocha', 'F', 33, 'Sudeste', TO_TIMESTAMP('2025-04-22 15:15:00', 'YYYY-MM-DD HH24:MI:SS'), 2135.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (8, 7, 'Cadeira Escritório', 2, 800.00, 4, 1600.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (8, 5, 'Camisa Social', 3, 120.00, 3, 360.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (8, 3, 'Café Premium', 4, 45.00, 2, 180.00);

-- Maio 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 1, 'João Silva', 'M', 35, 'Sudeste', TO_TIMESTAMP('2025-05-05 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 1680.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (9, 8, 'Mesa Escritório', 1, 1200.00, 4, 1200.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (9, 6, 'Calça Jeans', 3, 150.00, 3, 450.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (9, 4, 'Chá Especial', 1, 35.00, 2, 35.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 2, 'Maria Santos', 'F', 28, 'Sul', TO_TIMESTAMP('2025-05-18 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3240.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (10, 1, 'Smartphone', 2, 1500.00, 1, 3000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (10, 5, 'Camisa Social', 2, 120.00, 3, 240.00);

-- Junho 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 3, 'Pedro Oliveira', 'M', 42, 'Nordeste', TO_TIMESTAMP('2025-06-07 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 950.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (11, 7, 'Cadeira Escritório', 1, 800.00, 4, 800.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (11, 6, 'Calça Jeans', 1, 150.00, 3, 150.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 4, 'Ana Costa', 'F', 31, 'Centro-Oeste', TO_TIMESTAMP('2025-06-25 16:20:00', 'YYYY-MM-DD HH24:MI:SS'), 2800.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (12, 2, 'Notebook', 1, 2500.00, 1, 2500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (12, 9, 'Livro Técnico', 3, 65.00, 5, 195.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (12, 3, 'Café Premium', 2, 45.00, 2, 90.00);

-- Julho 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 5, 'Carlos Souza', 'M', 45, 'Sudeste', TO_TIMESTAMP('2025-07-02 10:10:00', 'YYYY-MM-DD HH24:MI:SS'), 4200.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (13, 2, 'Notebook', 1, 2500.00, 1, 2500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (13, 8, 'Mesa Escritório', 1, 1200.00, 4, 1200.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (13, 5, 'Camisa Social', 4, 120.00, 3, 480.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 6, 'Julia Lima', 'F', 26, 'Sul', TO_TIMESTAMP('2025-07-19 13:50:00', 'YYYY-MM-DD HH24:MI:SS'), 510.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (14, 5, 'Camisa Social', 3, 120.00, 3, 360.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (14, 6, 'Calça Jeans', 1, 150.00, 3, 150.00);

-- Agosto 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 7, 'Roberto Alves', 'M', 38, 'Norte', TO_TIMESTAMP('2025-08-08 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3295.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (15, 1, 'Smartphone', 2, 1500.00, 1, 3000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (15, 9, 'Livro Técnico', 3, 65.00, 5, 195.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (15, 3, 'Café Premium', 2, 45.00, 2, 90.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 8, 'Patricia Rocha', 'F', 33, 'Sudeste', TO_TIMESTAMP('2025-08-21 15:30:00', 'YYYY-MM-DD HH24:MI:SS'), 1950.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (16, 7, 'Cadeira Escritório', 2, 800.00, 4, 1600.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (16, 10, 'Romance', 8, 45.00, 5, 360.00);

-- Setembro 2025 - Vendas
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 1, 'João Silva', 'M', 35, 'Sudeste', TO_TIMESTAMP('2025-09-05 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 5700.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (17, 2, 'Notebook', 2, 2500.00, 1, 5000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (17, 5, 'Camisa Social', 5, 120.00, 3, 600.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (17, 3, 'Café Premium', 2, 45.00, 2, 90.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 2, 'Maria Santos', 'F', 28, 'Sul', TO_TIMESTAMP('2025-09-18 14:25:00', 'YYYY-MM-DD HH24:MI:SS'), 2450.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (18, 8, 'Mesa Escritório', 2, 1200.00, 4, 2400.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (18, 4, 'Chá Especial', 1, 35.00, 2, 35.00);

-- Outubro 2025 - Vendas (mais vendas neste mês)
INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 3, 'Pedro Oliveira', 'M', 42, 'Nordeste', TO_TIMESTAMP('2025-10-03 10:20:00', 'YYYY-MM-DD HH24:MI:SS'), 3750.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (19, 1, 'Smartphone', 2, 1500.00, 1, 3000.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (19, 6, 'Calça Jeans', 5, 150.00, 3, 750.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 4, 'Ana Costa', 'F', 31, 'Centro-Oeste', TO_TIMESTAMP('2025-10-10 11:45:00', 'YYYY-MM-DD HH24:MI:SS'), 4100.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (20, 2, 'Notebook', 1, 2500.00, 1, 2500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (20, 7, 'Cadeira Escritório', 2, 800.00, 4, 1600.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 5, 'Carlos Souza', 'M', 45, 'Sudeste', TO_TIMESTAMP('2025-10-15 16:10:00', 'YYYY-MM-DD HH24:MI:SS'), 1860.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (21, 1, 'Smartphone', 1, 1500.00, 1, 1500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (21, 5, 'Camisa Social', 3, 120.00, 3, 360.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 6, 'Julia Lima', 'F', 26, 'Sul', TO_TIMESTAMP('2025-10-20 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), 2900.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (22, 2, 'Notebook', 1, 2500.00, 1, 2500.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (22, 6, 'Calça Jeans', 2, 150.00, 3, 300.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (22, 3, 'Café Premium', 2, 45.00, 2, 90.00);

INSERT INTO vendas (id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente, regiao_venda, data_venda, total)
VALUES ('ADMIN-USER-ID-001', 7, 'Roberto Alves', 'M', 38, 'Norte', TO_TIMESTAMP('2025-10-23 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 1850.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (23, 7, 'Cadeira Escritório', 2, 800.00, 4, 1600.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (23, 9, 'Livro Técnico', 3, 65.00, 5, 195.00);
INSERT INTO venda_produtos (id_venda, id_produto, nome_produto, quantidade, preco_unitario, id_categoria, subtotal)
VALUES (23, 4, 'Chá Especial', 2, 35.00, 2, 70.00);

COMMIT;

-- =====================================================
-- Views úteis para Analytics
-- =====================================================

CREATE OR REPLACE VIEW v_vendas_completas AS
SELECT 
    v.id_venda,
    v.id_usuario,
    v.id_cliente,
    v.nome_cliente,
    v.sexo_cliente,
    v.idade_cliente,
    v.regiao_venda,
    v.data_venda,
    v.total,
    (SELECT COUNT(*) FROM venda_produtos vp WHERE vp.id_venda = v.id_venda) as qtd_produtos,
    v.created_at
FROM vendas v;

CREATE OR REPLACE VIEW v_produtos_mais_vendidos AS
SELECT 
    p.id_produto,
    p.nome,
    p.cd_produto,
    c.nome_categoria as categoria,
    NVL(SUM(vp.quantidade), 0) as quantidade_vendida,
    NVL(SUM(vp.subtotal), 0) as total_vendido,
    COUNT(DISTINCT vp.id_venda) as numero_vendas
FROM produtos p
LEFT JOIN venda_produtos vp ON p.id_produto = vp.id_produto
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
GROUP BY p.id_produto, p.nome, p.cd_produto, c.nome_categoria
ORDER BY total_vendido DESC;

CREATE OR REPLACE VIEW v_vendas_por_regiao AS
SELECT 
    regiao_venda as regiao,
    COUNT(*) as quantidade_vendas,
    SUM(total) as total_vendido,
    AVG(total) as ticket_medio
FROM vendas
GROUP BY regiao_venda
ORDER BY total_vendido DESC;

CREATE OR REPLACE VIEW v_clientes_top AS
SELECT 
    c.id_cliente,
    c.nome,
    c.sexo,
    c.idade,
    COUNT(v.id_venda) as numero_compras,
    NVL(SUM(v.total), 0) as total_gasto,
    NVL(AVG(v.total), 0) as ticket_medio,
    MAX(v.data_venda) as ultima_compra
FROM clientes c
LEFT JOIN vendas v ON c.id_cliente = v.id_cliente
GROUP BY c.id_cliente, c.nome, c.sexo, c.idade
ORDER BY total_gasto DESC;

-- =====================================================
-- Verificação
-- =====================================================

SELECT 'Schema criado com sucesso!' AS status FROM dual;

