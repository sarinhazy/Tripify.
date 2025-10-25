<?php
require_once "conexao.php";
require_once __DIR__ . '/vendor/autoload.php';
use TCPDF;

// Cria o PDF
$pdf = new TCPDF();
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Tripify');
$pdf->SetTitle('Itinerário e Custos da Viagem');
$pdf->SetMargins(15, 25, 15);
$pdf->AddPage();

// Logo do Tripify (adicione uma imagem 'logo.png' na pasta do projeto)
if(file_exists('logo.png')) {
    $pdf->Image('logo.png', 15, 10, 30);
}
$pdf->SetFont('helvetica', 'B', 16);
$pdf->Cell(0, 15, '🌍 Tripify - Itinerário e Custos', 0, 1, 'C');
$pdf->Ln(5);

// Data de geração
$pdf->SetFont('helvetica', '', 11);
$pdf->Cell(0, 6, "Data de geração: " . date('d/m/Y H:i'), 0, 1, 'R');
$pdf->Ln(5);

// Buscar participantes e despesas
$participantes = $pdo->query("SELECT * FROM participantes")->fetchAll(PDO::FETCH_ASSOC);
$despesas = $pdo->query("
    SELECT d.*, p.nome AS pagador_nome 
    FROM despesas d
    JOIN participantes p ON d.pagador_id = p.id
    ORDER BY d.data_registro DESC
")->fetchAll(PDO::FETCH_ASSOC);

// Resumo por categoria
$categorias = $pdo->query("
    SELECT categoria, SUM(valor) AS total
    FROM despesas
    GROUP BY categoria
")->fetchAll(PDO::FETCH_ASSOC);

$totalViagem = 0;
foreach($categorias as $cat) $totalViagem += $cat['total'];

$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, '📊 Resumo da Viagem', 0, 1);
$pdf->SetFont('helvetica', '', 11);

foreach ($categorias as $cat) {
    $pdf->Cell(0, 6, $cat['categoria'] . ": R$ " . number_format($cat['total'], 2, ',', '.'), 0, 1);
}
$pdf->Cell(0, 6, "💰 Total gasto na viagem: R$ " . number_format($totalViagem, 2, ',', '.'), 0, 1);
$pdf->Ln(5);

// Lista detalhada de despesas
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, '🧾 Despesas Detalhadas', 0, 1);
$pdf->SetFont('helvetica', '', 11);

foreach ($despesas as $d) {
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->Cell(0, 7, strtoupper($d['categoria']) . " - R$ " . number_format($d['valor'], 2, ',', '.') . " (Pagador: " . $d['pagador_nome'] . ")", 0, 1);
    $pdf->SetFont('helvetica', '', 10);

    $stmt = $pdo->prepare("
        SELECT pd.*, p.nome 
        FROM participantes_despesas pd
        JOIN participantes p ON p.id = pd.participante_id
        WHERE pd.despesa_id = ?
    ");
    $stmt->execute([$d['id']]);
    $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(80, 7, "Participante", 1, 0, 'C', 1);
    $pdf->Cell(30, 7, "Peso", 1, 0, 'C', 1);
    $pdf->Cell(40, 7, "Valor Devido", 1, 1, 'C', 1);

    $totalPesos = array_sum(array_column($lista, 'peso'));
    foreach ($lista as $lp) {
        $valorParte = ($lp['peso'] / $totalPesos) * $d['valor'];
        $pdf->Cell(80, 6, $lp['nome'], 1);
        $pdf->Cell(30, 6, $lp['peso'], 1, 0, 'C');
        $pdf->Cell(40, 6, "R$ " . number_format($valorParte, 2, ',', '.'), 1, 1, 'C');
    }
    $pdf->Ln(3);
}

// Saldos finais
$pdf->Ln(5);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, '💰 Saldo Final de Cada Participante', 0, 1);
$pdf->SetFont('helvetica', '', 11);

$saldos = [];
foreach ($participantes as $p) $saldos[$p['id']] = 0;

foreach ($despesas as $d) {
    $stmt = $pdo->prepare("
        SELECT pd.*, p.nome 
        FROM participantes_despesas pd 
        JOIN participantes p ON p.id = pd.participante_id
        WHERE pd.despesa_id = ?
    ");
    $stmt->execute([$d['id']]);
    $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $total_pesos = array_sum(array_column($lista, 'peso'));

    foreach ($lista as $lp) {
        $parte = ($lp['peso'] / $total_pesos) * $d['valor'];
        $saldos[$lp['participante_id']] -= $parte;
    }
    $saldos[$d['pagador_id']] += $d['valor'];
}

$pdf->SetFillColor(245, 245, 245);
foreach ($participantes as $p) {
    $saldo = number_format($saldos[$p['id']], 2, ',', '.');
    $pdf->Cell(100, 7, $p['nome'], 1, 0, 'L', 1);
    $pdf->Cell(50, 7, "R$ $saldo", 1, 1, 'C', 1);
}

// Baixa o PDF
$pdf->Output('Tripify_Itinerario.pdf', 'D');
?>
