<?php
require_once 'lib/wideimage.php';

$width =  650;
$height = 535;
$inputName = key($_FILES) ;

$uploadFile = ($_FILES[$inputName]['tmp_name']);
$filePath = '../images/';

$size = getimagesize($uploadFile);

if (file_exists($filePath . 'first.jpg')) {
    WideImage::loadFromFile($uploadFile)->saveToFile($filePath.'second.jpg');
    $filePath = $filePath . 'second.jpg';
} else {
    WideImage::loadFromFile($uploadFile)->saveToFile($filePath.'first.jpg');
    $filePath = $filePath . 'first.jpg';
}



echo $size[0] . "|" . $size[1] . "|" . $filePath;
exit;