<?php
session_start();
$BancoDeDados = new PDO("mysql:host=localhost;dbname=pit_julio", "root", "");

if (isset($_POST['enviar-empresario'])) {
    $EmailComercial = $_POST['emailEmpresa'];
    $Cnpj = $_POST['cnpj'];
    $NomeEmpresa = $_POST['empresa'];
    $TelefoneComercial = $_POST['telefoneComercial'];
    $Senha = $_POST['senha'];
    $SenhaConfirmacao = $_POST['senhaEmpresario'];

    $INSERT = $BancoDeDados->prepare("INSERT INTO empresas VALUES(null, :nome, :email, :telefone_comercial, :cnpj, :SenhaEmpresa)");

    if ($Senha == $SenhaConfirmacao) {

        $INSERT->bindParam(':nome', $NomeEmpresa);
        $INSERT->bindParam(':email', $EmailComercial);
        $INSERT->bindParam(':telefone_comercial', $TelefoneComercial);
        $INSERT->bindParam(':cnpj', $Cnpj);
        $INSERT->bindParam(':SenhaEmpresa', $Senha);


        if ($INSERT->execute()) {
            $_SESSION['msg'] = "<div class='alert alert-success' role='alert'> Dados cadastratos com sucesso <br>
                                 <a href='../login.html'>Clique aqui para fazer login</a></div>";
            header("Location: exibicoes.php");
        } else {
            $_SESSION['msg'] = "<div class='alert alert-danger' role='alert'> Erro no cadastro </div>";
            header("Location: exibicoes.php");
        }

    }
    
    else{
        $_SESSION['msg'] = "<div class='alert alert-danger' role='alert'> Digite senhas iguais<br> 
                            <a href='../Cadastro.html'>Voltar para cadastro</a></div>";
            header("Location: exibicoes.php");
    }


}

?>