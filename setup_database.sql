-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS security_demo;
USE security_demo;

-- Criar tabela para armazenar os dados de acesso
CREATE TABLE IF NOT EXISTS access_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    user_agent TEXT NOT NULL,
    language VARCHAR(20),
    platform VARCHAR(50),
    screen_size VARCHAR(20),
    ip_address VARCHAR(45),
    battery_level VARCHAR(20),
    battery_charging VARCHAR(5),
    referrer TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar índices para melhorar performance de consultas
CREATE INDEX idx_session_id ON access_data (session_id);
CREATE INDEX idx_timestamp ON access_data (timestamp);