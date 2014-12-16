<?php
require_once 'lib/wideimage.php';

$numChars = 5;
$randStr = substr(md5(uniqid()), 0 , $numChars);

$uploadFile = ($_FILES['userfile']['tmp_name']);
$uploadName = ($_FILES['userfile']['name']);
$filePath = ('../images/' . $uploadName);


WideImage::loadFromFile($uploadFile)->resize('500')->saveToFile($filePath);

echo $filePath;