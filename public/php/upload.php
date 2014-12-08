<?php

$uploaddir = '../images/';
$uploadfile = $uploaddir . ($_FILES['userfile']['name']);
move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile);