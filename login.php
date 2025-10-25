<?php
session_start();
$BancoDeDados = new PDO("mysql:host=localhost;dbname=pit_julio", "root", "");

if(isset($_POST['enviar'])){

    $Email = $_POST['email'];
    $Senha = $_POST['senha'];
    $SELECT = $BancoDeDados->prepare("SELECT * FROM atleta WHERE email = :email AND senha = :senha");
    $SELECT->bindParam(':email', $Email);
    $SELECT->bindParam(':senha', $Senha);
    $SELECT->execute();
    $LinhaRetornada = $SELECT->fetch(PDO::FETCH_ASSOC);
    $EmailRetornado = $LinhaRetornada['email'];
    
    
    if($EmailRetornado == $Email){
        $_SESSION['msg'] = "<div class='alert alert-success' role='alert'> Login feito com sucesso <a href='../Pagina_Inicial_Estacao/inicio.html'>Link Para Acessar o Site</a></div>";
            header("Location: exibicoes.php");
    }

    else{
        $_SESSION['msg'] = "<div class='alert alert-danger' role='alert'> Email ou senha incorretos</div>";
            header("Location: exibicoes.php");
    }
}

