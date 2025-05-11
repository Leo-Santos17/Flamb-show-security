<?php
// Configurar headers para permitir CORS e indicar resposta CSV
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/csv; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Content-Disposition: attachment; filename=dados_demonstracao_seguranca.csv");

// Incluir arquivo de conexão
require_once 'db_connection.php';

// Verificar se é uma requisição GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Preparar query SQL para buscar todos os registros
        $query = "SELECT * FROM access_data ORDER BY timestamp DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        // Criar arquivo CSV
        $output = fopen('php://output', 'w');
        
        // Adicionar BOM para correta interpretação de UTF-8
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Adicionar cabeçalho CSV
        fputcsv($output, [
            'Data/Hora', 
            'Session ID', 
            'Dispositivo', 
            'Sistema', 
            'Navegador', 
            'IP', 
            'Bateria', 
            'Carregando', 
            'Idioma', 
            'Resolução', 
            'Referência', 
            'Latitude', 
            'Longitude'
        ]);
        
        // Funções auxiliares para detectar dispositivo e sistema
        function detectOS($userAgent) {
            if (strpos($userAgent, "Win") !== false) return "Windows";
            if (strpos($userAgent, "Mac") !== false) return "MacOS";
            if (strpos($userAgent, "Linux") !== false) return "Linux";
            if (strpos($userAgent, "Android") !== false) return "Android";
            if (strpos($userAgent, "like Mac") !== false) return "iOS";
            return "Outro";
        }
        
        function detectBrowser($userAgent) {
            if (strpos($userAgent, "Firefox") !== false) return "Firefox";
            if (strpos($userAgent, "SamsungBrowser") !== false) return "Samsung Browser";
            if (strpos($userAgent, "Opera") !== false || strpos($userAgent, "OPR") !== false) return "Opera";
            if (strpos($userAgent, "Edge") !== false) return "Edge";
            if (strpos($userAgent, "Chrome") !== false) return "Chrome";
            if (strpos($userAgent, "Safari") !== false) return "Safari";
            return "Outro";
        }
        
        function detectDevice($userAgent) {
            if (strpos($userAgent, "Mobile") !== false) {
                if (strpos($userAgent, "iPhone") !== false) return "iPhone";
                if (strpos($userAgent, "iPad") !== false) return "iPad";
                if (strpos($userAgent, "Android") !== false) {
                    // Tenta pegar modelo Android
                    preg_match('/Android [0-9.]+; ([^;)]+)/', $userAgent, $matches);
                    if (isset($matches[1])) return "Android ({$matches[1]})";
                    return "Android";
                }
                return "Dispositivo Móvel";
            }
            return "Desktop/Notebook";
        }
        
        // Adicionar dados ao CSV
        while ($row = $stmt->fetch()) {
            $os = detectOS($row['user_agent']);
            $browser = detectBrowser($row['user_agent']);
            $device = detectDevice($row['user_agent']);
            
            fputcsv($output, [
                $row['timestamp'],
                $row['session_id'],
                $device,
                $os,
                $browser,
                $row['ip_address'],
                $row['battery_level'],
                $row['battery_charging'],
                $row['language'],
                $row['screen_size'],
                $row['referrer'],
                $row['latitude'],
                $row['longitude']
            ]);
        }
        
        fclose($output);
        
    } catch (PDOException $e) {
        // Em caso de erro, retornar mensagem de erro em JSON
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "message" => "Erro de banco de dados",
            "error" => $e->getMessage()
        ]);
    }
} else {
    // Não é um método GET
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Método não permitido"]);
}
?>