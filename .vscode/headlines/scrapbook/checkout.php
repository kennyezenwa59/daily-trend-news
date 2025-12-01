<?php
header('Content-Type: application/json');

try {
// Connect to SQLite database
$db = new PDO('sqlite:database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create tables if not exist
$db->exec("
CREATE TABLE IF NOT EXISTS orders (
id INTEGER PRIMARY KEY AUTOINCREMENT,
order_id TEXT UNIQUE,
total_price REAL,
created_at TEXT
);
");
$db->exec("
CREATE TABLE IF NOT EXISTS order_items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
order_id TEXT,
product_id TEXT,
name TEXT,
price REAL,
quantity INTEGER
);
");

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['orderId']) || !isset($data['items'])) {
echo json_encode(['success' => false, 'message' => 'Invalid data']);
exit;
}

$orderId = $data['orderId'];
$items = $data['items'];

// Calculate total
$totalPrice = 0;
foreach ($items as $item) {
$totalPrice += $item['price'] * $item['quantity'];
}

// Insert order
$stmt = $db->prepare("INSERT INTO orders (order_id, total_price, created_at) VALUES (?, ?, datetime('now'))");
$stmt->execute([$orderId, $totalPrice]);

// Insert order items
$stmtItem = $db->prepare("INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)");
foreach ($items as $item) {
$stmtItem->execute([$orderId, $item['id'], $item['name'], $item['price'], $item['quantity']]);
}

echo json_encode(['success' => true]);
} catch (Exception $e) {
echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
