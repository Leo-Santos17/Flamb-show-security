<?php
// Configurar headers para permitir CORS e indicar resposta JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir arquivo de conexão
require_once 'db_connection.php';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Receber os dados enviados via POST
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Verificar se dados foram recebidos
    if (!$data) {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Nenhum dado recebido"]);
        exit;
    }
    
    try {
        // Preparar query SQL
        $query = "INSERT INTO access_data 
                  (session_id, timestamp, user_agent, language, platform, 
                   screen_size, ip_address, battery_level, battery_charging, 
                   referrer, latitude, longitude) 
                  VALUES 
                  (:session_id, :timestamp, :user_agent, :language, :platform, 
                   :screen_size, :ip_address, :battery_level, :battery_charging, 
                   :referrer, :latitude, :longitude)";
                   
        $stmt = $conn->prepare($query);
        
        // Extrair localização se disponível
        $latitude = null;
        $longitude = null;
        
        if (isset($data['location']) && is_array($data['location'])) {
            $latitude = $data['location']['latitude'] ?? null;
            $longitude = $data['location']['longitude'] ?? null;
        }
        
        // Binding de parâmetros
        $stmt->bindParam(':session_id', $data['sessionId']);
        $stmt->bindParam(':timestamp', $data['timestamp']);
        $stmt->bindParam(':user_agent', $data['userAgent']);
        $stmt->bindParam(':language', $data['language']);
        $stmt->bindParam(':platform', $data['platform']);
        $stmt->bindParam(':screen_size', $data['screenSize']);
        $stmt->bindParam(':ip_address', $data['ipInfo']);
        $stmt->bindParam(':battery_level', $data['batteryLevel']);
        $stmt->bindParam(':battery_charging', $data['batteryCharging'] ?? null);
        $stmt->bindParam(':referrer', $data['referrer']);
        $stmt->bindParam(':latitude', $latitude);
        $stmt->bindParam(':longitude', $longitude);
        
        // Executar a query
        if ($stmt->execute()) {
            http_response_code(201); // Created
            echo json_encode([
                "message" => "Dados salvos com sucesso",
                "id" => $conn->lastInsertId()
            ]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "Erro ao salvar os dados"]);
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "message" => "Erro de banco de dados",
            "error" => $e->getMessage()
        ]);
    }
} else {
    // Não é um método POST
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método não permitido"]);
}
?>