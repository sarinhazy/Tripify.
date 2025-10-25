<?php
require_once "conexao.php";

// ==== Adicionar participante ====
if (isset($_POST['add_participante'])) {
    $stmt = $pdo->prepare("INSERT INTO participantes (nome) VALUES (:nome)");
    $stmt->execute(['nome' => $_POST['nome']]);
}

// ==== Adicionar despesa ====
if (isset($_POST['add_despesa'])) {
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO despesas (categoria, valor, pagador_id) VALUES (:c, :v, :p)");
        $stmt->execute([
            'c' => $_POST['categoria'],
            'v' => $_POST['valor'],
            'p' => $_POST['pagador']
        ]);
        $despesa_id = $pdo->lastInsertId();

        foreach ($_POST['participantes'] as $id_part) {
            $peso = $_POST['pesos'][$id_part] ?? 1;
            $stmt = $pdo->prepare("INSERT INTO participantes_despesas (despesa_id, participante_id, peso) VALUES (:d, :p, :w)");
            $stmt->execute(['d' => $despesa_id, 'p' => $id_part, 'w' => $peso]);
        }

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        echo "<div class='alert alert-danger'>Erro ao salvar despesa: {$e->getMessage()}</div>";
    }
}

// ==== Buscar dados ====
$participantes = $pdo->query("SELECT * FROM participantes")->fetchAll(PDO::FETCH_ASSOC);

// Calcular saldos
$saldos = [];
foreach ($participantes as $p) $saldos[$p['id']] = 0;

$despesas = $pdo->query("
    SELECT d.*, p.nome AS pagador_nome 
    FROM despesas d
    JOIN participantes p ON d.pagador_id = p.id
    ORDER BY d.data_registro DESC
")->fetchAll(PDO::FETCH_ASSOC);

foreach ($despesas as $d) {
    $part = $pdo->prepare("
        SELECT pd.*, p.nome 
        FROM participantes_despesas pd 
        JOIN participantes p ON p.id = pd.participante_id
        WHERE pd.despesa_id = ?
    ");
    $part->execute([$d['id']]);
    $lista = $part->fetchAll(PDO::FETCH_ASSOC);

    $total_pesos = array_sum(array_column($lista, 'peso'));
    foreach ($lista as $lp) {
        $parte = ($lp['peso'] / $total_pesos) * $d['valor'];
        $saldos[$lp['participante_id']] -= $parte;
    }
    $saldos[$d['pagador_id']] += $d['valor'];
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Tripify - Divisão de Custos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8fbff; }
        .container { max-width: 900px; margin-top: 40px; }
        .card { border-radius: 12px; }
        .tripify-title { color: #0077b6; }
        .saldo-positivo { color: green; font-weight: 600; }
        .saldo-negativo { color: #c62828; font-weight: 600; }
    </style>
</head>
<body>
<div class="container">
    <h1 class="text-center tripify-title mb-4">🌍 Tripify - Divisão de Custos Inteligente</h1>

    <!-- Adicionar participante -->
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">Adicionar Participante</div>
        <div class="card-body">
            <form method="POST" class="row g-3">
                <div class="col-md-10">
                    <input type="text" name="nome" class="form-control" placeholder="Nome do participante" required>
                </div>
                <div class="col-md-2 d-grid">
                    <button type="submit" name="add_participante" class="btn btn-primary">Adicionar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Registrar despesa -->
    <div class="card mb-4">
        <div class="card-header bg-info text-white">Registrar Nova Despesa</div>
        <div class="card-body">
            <form method="POST">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <input type="text" name="categoria" class="form-control" placeholder="Categoria (ex: Transporte)" required>
                    </div>
                    <div class="col-md-6">
                        <input type="number" step="0.01" name="valor" class="form-control" placeholder="Valor (R$)" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Pagador:</label>
                    <select name="pagador" class="form-select">
                        <?php foreach ($participantes as $p): ?>
                            <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['nome']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <h6>Participantes e Pesos:</h6>
                <?php foreach ($participantes as $p): ?>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" name="participantes[]" value="<?= $p['id'] ?>">
                        <label class="form-check-label"><?= htmlspecialchars($p['nome']) ?></label>
                        <input type="number" step="0.1" name="pesos[<?= $p['id'] ?>]" class="form-control form-control-sm d-inline-block ms-2" style="width:80px;" placeholder="Peso">
                    </div>
                <?php endforeach; ?>

                <div class="mt-3 text-end">
                    <button type="submit" name="add_despesa" class="btn btn-info text-white">Salvar Despesa</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Histórico de despesas -->
    <div class="card mb-4">
        <div class="card-header bg-secondary text-white">Histórico de Despesas</div>
        <div class="card-body">
            <table class="table table-striped">
                <thead class="table-light">
                    <tr>
                        <th>Data</th>
                        <th>Categoria</th>
                        <th>Valor (R$)</th>
                        <th>Pagador</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($despesas)): ?>
                        <tr><td colspan="4" class="text-center text-muted">Nenhuma despesa registrada ainda.</td></tr>
                    <?php else: ?>
                        <?php foreach ($despesas as $d): ?>
                            <tr>
                                <td><?= date('d/m/Y H:i', strtotime($d['data_registro'])) ?></td>
                                <td><?= htmlspecialchars($d['categoria']) ?></td>
                                <td><?= number_format($d['valor'], 2, ',', '.') ?></td>
                                <td><?= htmlspecialchars($d['pagador_nome']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card mb-4">
    <div class="card-header bg-warning text-white">Criar Nova Viagem</div>
    <div class="card-body">
        <form method="POST" class="row g-3">
            <div class="col-md-6">
                <input type="text" name="viagem_nome" class="form-control" placeholder="Nome da viagem" required>
            </div>
            <div class="col-md-3">
                <input type="date" name="data_inicio" class="form-control" required>
            </div>
            <div class="col-md-3">
                <input type="date" name="data_fim" class="form-control" required>
            </div>
            <div class="col-12 d-grid">
                <button type="submit" name="add_viagem" class="btn btn-warning">Criar Viagem</button>
            </div>
        </form>
    </div>
</div>


    <!-- Saldos -->
    <div class="card">
        <div class="card-header bg-success text-white">💰 Saldos Finais</div>
        <div class="card-body">
            <?php foreach ($participantes as $p): ?>
                <?php
                $saldo = $saldos[$p['id']];
                $classe = $saldo >= 0 ? "saldo-positivo" : "saldo-negativo";
                $valor = number_format($saldo, 2, ',', '.');
                ?>
                <p><strong><?= htmlspecialchars($p['nome']) ?>:</strong> <span class="<?= $classe ?>">R$ <?= $valor ?></span></p>
            <?php endforeach; ?>
        </div>
    </div>
    <div class="box">
    <h2>📥 Exportar Itinerário</h2>
    <form action="gerar_pdf.php" method="post">
        <button type="submit">Baixar Itinerário em PDF</button>
    </form>
</div>
</div>
</body>
</html>
