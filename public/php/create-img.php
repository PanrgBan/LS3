<?php
require_once 'lib/WideImage.php';

$data = json_decode($_POST['data']);

$opacity = $data -> opacity;
$deltaX = $data -> deltaX;
$deltaY = $data -> deltaY;
$image = WideImage::load($data -> image);
$watermark = WideImage::load($data -> watermark);

$new = $image->merge($watermark, 'left + ' . $deltaX, 'top+' . $deltaY, '100');

$new -> saveToFile('../images/result.jpg');

exit;