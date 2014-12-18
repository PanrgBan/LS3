<?php
require_once 'lib/wideimage.php';

$width =  650;
$height = 535;
$inputName = key($_FILES) ;



$uploadFile = ($_FILES[$inputName]['tmp_name']);
$uploadName = ($_FILES[$inputName]['name']);
$filePath = ('../images/' . $uploadName);

$size = getimagesize($uploadFile);

WideImage::loadFromFile($uploadFile)->saveToFile($filePath);

echo $size[0] . "|" . $size[1] . "|" . $filePath;
exit;