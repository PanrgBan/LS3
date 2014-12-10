<?php

$typeOfPic = $_FILES['userfile']['type'];

if ($typeOfPic  != "image/jpeg" && $typeOfPic  != "image/png" && $typeOfPic  != "image/gif") {
    echo 'Error';
    return false;
}



$uploaddir = '../images/';
$uploadfile = $uploaddir . ($_FILES['userfile']['name']);
move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile);