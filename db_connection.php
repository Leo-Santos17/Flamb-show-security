<?php
// Configuração do banco de dados
$db_host = 'http://172.18.1.68/';     // Endereço do servidor MySQL
$db_name = 'security_flamb'; // Nome do banco de dados
$db_user = 'adminTesteFlam';          // Usuário do MySQL
$db_pass = '123';              // Senha do MySQL

// Criar conexão
try {
    $conn = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    // Configurar PDO para lançar exceções em caso de erro
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Configurar para retornar resultados como arrays associativos
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Em produção, você pode querer registrar o erro em um arquivo de log
    // ao invés de exibir diretamente
    die("Erro de conexão: " . $e->getMessage());
}
?>