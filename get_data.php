<?php
// Configurar headers para permitir CORS e indicar resposta JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");

// Incluir arquivo de conexão
require_once 'db_connection.php';

// Verificar se é uma requisição GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Preparar query SQL para buscar todos os registros
        $query = "SELECT * FROM access_data ORDER BY timestamp DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        // Verificar se existem registros
        if ($stmt->rowCount() > 0) {
            // Recuperar todos os registros
            $data = $stmt->fetchAll();
            
            // Formatar os dados para o formato esperado pelo frontend
            $formattedData = [];
            
            foreach ($data as $row) {
                $locationData = null;
                
                // Se tiver latitude e longitude, formatar como objeto de localização
                if ($row['latitude'] !== null && $row['longitude'] !== null) {
                    $locationData = [
                        'latitude' => (float)$row['latitude'],
                        'longitude' => (float)$row['longitude']
                    ];
                }
                
                $formattedData[] = [
                    'id' => $row['id'],
                    'sessionId' => $row['session_id'],
                    'timestamp' => $row['timestamp'],
                    'userAgent' => $row['user_agent'],
                    'language' => $row['language'],
                    'platform' => $row['platform'],
                    'screenSize' => $row['screen_size'],
                    'ipInfo' => $row['ip_address'],
                    'batteryLevel' => $row['battery_level'],
                    'batteryCharging' => $row['battery_charging'],
                    'referrer' => $row['referrer'],
                    'location' => $locationData
                ];
            }
            
            http_response_code(200); // OK
            echo json_encode($formattedData);
        } else {
            http_response_code(200); // OK
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "message" => "Erro de banco de dados",
            "error" => $e->getMessage()
        ]);
    }
} else {
    // Não é um método GET
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método não permitido"]);
}
?>