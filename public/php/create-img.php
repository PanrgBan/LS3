<?php
require_once 'lib/WideImage.php';

//$data = json_decode($_GET['data']);

$opacity = $_GET['opacity'];//$data -> opacity;
$deltaX = $_GET['deltaX'];//$data -> deltaX;
$deltaY = $_GET['deltaY'];//$data -> deltaY;
$image = WideImage::load($_GET['image']);//$data -> image);
$watermark = WideImage::load($_GET['watermark']);//$data -> watermark);

$result = '../images/result.jpg';

$new = $image->merge($watermark, 'left + ' . $deltaX, 'top+' . $deltaY, $opacity * 100);

$new -> saveToFile($result);

echo ($result) ;

exit;