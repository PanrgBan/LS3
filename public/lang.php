<?php
session_start();

if($_GET["lang"]){
	switch ($_GET["lang"]) {
	    case "rus":
	        $_SESSION = array(); //Очищаем сессию
	        break;
	    case "eng":
	        $_SESSION["lang-eng"] = true; // создаем сессию для английского языка
	        break;
	    default:
	        $_SESSION = array(); //Очищаем сессию
	        break;
	}
	header("Location: /");
}
/*function switchLang ($lang){
	switch ($lang) {
	    case "rus":
	        echo "русский";
	        break;
	    case "eng":
	        echo "английскй";
	        break;
	    default:
	        echo "хрен просышь";
	        break;
	}
}*/

/*switchLang($_GET["lang"]);*/

function t($word){
	if($_SESSION["lang-eng"]){
		include '/lang/eng.php';
	}else{
		include '/lang/ru.php';
	}
	return $lang[$word];
}