<?php
// Configurar headers para permitir CORS e indicar resposta JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir arquivo de conexão
require_once 'db_connection.php';

// Verificar se é uma requisição DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Preparar query SQL para excluir todos os registros
        $query = "TRUNCATE TABLE access_data";
        $stmt = $conn->prepare($query);
        
        // Executar a query
        if ($stmt->execute()) {
            http_response_code(200); // OK
            echo json_encode([
                "message" => "Todos os dados foram excluídos com sucesso"
            ]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "Erro ao excluir os dados"]);
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "message" => "Erro de banco de dados",
            "error" => $e->getMessage()
        ]);
    }
} else {
    // Não é um método DELETE
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método não permitido"]);
}
?>