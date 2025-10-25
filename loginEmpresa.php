<?php
session_start();
$BancoDeDados = new PDO("mysql:host=localhost;dbname=pit_julio", "root", "");

if(isset($_POST['enviar-Empresa'])){

    $Email = $_POST['emailEmpresa'];
    $Senha = $_POST['senhaEmpresa'];
    $SELECT = $BancoDeDados->prepare("SELECT * FROM empresas WHERE email = :email AND senhaEmpresa = :SenhaEmpresa");
    $SELECT->bindParam(':email', $Email);
    $SELECT->bindParam(':SenhaEmpresa', $Senha);
    $SELECT->execute();
    $LinhaRetornada = $SELECT->fetch(PDO::FETCH_ASSOC);
    $EmailRetornado = $LinhaRetornada['email'];
    
    
    if($EmailRetornado == $Email){
        $_SESSION['msg'] = "<div class='alert alert-success' role='alert'> Seja bem vindo Empresa <a href='../Pagina_Inicial_Empresa/inicio_Empresa.html'>Link Para Acessar o Site</a></div>";
            header("Location: exibicoes.php");
    }

    else{
        $_SESSION['msg'] = "<div class='alert alert-danger' role='alert'> Email ou senha incorretos</div>";
            header("Location: exibicoes.php");
    }
}

