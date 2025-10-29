<?php
header('Content-Type: application/json; charset=utf-8');
// same-origin; als je vanaf andere origin wil aanroepen, voeg CORS headers toe.

$DBFILE = __DIR__ . '/tasks.sql';

try {
    $pdo = new PDO('sqlite:' . $DBFILE);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Maak tabel indien nodig
    $pdo->exec("CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        priority TEXT DEFAULT 'normaal',
        due TEXT NULL
    )");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function getJsonInput() {
    $raw = file_get_contents("php://input");
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

try {
    if ($method === 'GET') {
        // return all tasks
        $stmt = $pdo->query("SELECT id, text, done, priority, due FROM tasks ORDER BY id DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
        exit;
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        if (empty($data['text'])) { http_response_code(400); echo json_encode(['error'=>'Missing text']); exit; }
        $stmt = $pdo->prepare("INSERT INTO tasks (text, done, priority, due) VALUES (:text, 0, :priority, :due)");
        $stmt->execute([
            ':text' => $data['text'],
            ':priority' => !empty($data['priority']) ? $data['priority'] : 'normaal',
            ':due' => !empty($data['due']) ? $data['due'] : null
        ]);
        $id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT id, text, done, priority, due FROM tasks WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($row);
        exit;
    }

    if ($method === 'PUT') {
        $data = getJsonInput();
        if (empty($data['id'])) { http_response_code(400); echo json_encode(['error'=>'Missing id']); exit; }
        $fields = [];
        $params = [':id' => $data['id']];
        if (isset($data['text'])) { $fields[] = "text = :text"; $params[':text'] = $data['text']; }
        if (isset($data['done'])) { $fields[] = "done = :done"; $params[':done'] = $data['done'] ? 1 : 0; }
        if (array_key_exists('priority', $data)) { $fields[] = "priority = :priority"; $params[':priority'] = $data['priority']; }
        if (array_key_exists('due', $data)) { $fields[] = "due = :due"; $params[':due'] = $data['due'] !== null ? $data['due'] : null; }
        if (empty($fields)) { http_response_code(400); echo json_encode(['error'=>'No fields to update']); exit; }
        $sql = "UPDATE tasks SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        // id via query param ?id=123 of via JSON body
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            $data = getJsonInput();
            $id = isset($data['id']) ? $data['id'] : null;
        }
        if (!$id) { http_response_code(400); echo json_encode(['error'=>'Missing id']); exit; }
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true]);
        exit;
    }

    // andere methodes niet ondersteund
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
