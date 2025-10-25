<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];

    }
}

if (isset($_POST['atualizar'])) {
    // Receber os novos valores dos campos
    $id = $_POST['atleta'];
    $motivo = $_POST['data'];
    $local = $_POST['esporte de atuacao'];
    $bairro = $_POST['email'];
    $referencia = $_POST['telefone'];
    $descricao = $_POST['senha'];

    // Consulta SQL para atualizar os dados do problema com base no ID
    $sql = "UPDATE pit_julio SET motivo = :motivo, localizacao = :local,  = :,  = :,  = :descricao WHERE id = :id";
    $stmt = $banco->prepare($sql);
    $stmt->bindParam(':', $id, PDO::PARAM_INT);
    $stmt->bindParam(':', $motivo, PDO::PARAM_STR);
    $stmt->bindParam(':', $local, PDO::PARAM_STR);
    $stmt->bindParam(':', $bairro, PDO::PARAM_STR);
    $stmt->bindParam(':', $referencia, PDO::PARAM_STR);
    $stmt->bindParam(':', $descricao, PDO::PARAM_STR);

    if ($stmt->execute()) {
        header("Location: pagina_inicial.php"); // Redirecionar após a atualização
        exit;
    } else {
        echo "Erro ao atualizar o problema com ID $id.";
    }
}

?>