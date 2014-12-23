<?php
require_once 'lib/WideImage.php';

$opacity = $_POST['opacity'];
$deltaX = $_POST['deltaX'];
$deltaY = $_POST['deltaY'];
$image = WideImage::load($_POST['image']);
$watermark = WideImage::load($_POST['watermark']);

$result = '../images/result.jpg';

$new = $image->merge($watermark, 'left + ' . $deltaX, 'top+' . $deltaY, $opacity);

$new -> saveToFile($result);

unlink($image);
unlink($watermark);

exit;