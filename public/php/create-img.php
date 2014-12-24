<?php
require_once 'lib/WideImage.php';

$result = '../images/result.jpg';

$opacity = $_POST['opacity'];
$deltaX = $_POST['deltaX'];
$deltaY = $_POST['deltaY'];
$tiling = $_POST['tiling'];
$image = WideImage::load($_POST['image']);
$watermark = WideImage::load($_POST['watermark']);
$sizeImg = getimagesize($_POST['image']);
$sizeWt = getimagesize($_POST['watermark']);
$marginX = $_POST['marginX'];
$marginY = $_POST['marginY'];
$lengthX = $marginY;
$lengthY = $marginX;
$i = 0;
$j = 0;

if($tiling) {
    while ($lengthY < $sizeImg[1]) {
        while ($lengthX < $sizeImg[0]) {
            $lengthX = $lengthX + $sizeWt[0] + $marginX;
            $j++;
            $new = $image->merge($watermark, 'left  + ' . $lengthX, 'top  +' . $lengthY, $opacity);
        }
        $lengthY = $lengthY + $sizeWt[1] + $marginY;
        $lengthX = $marginX;
        $i++;
//        TODO нужен метод для повторного наложения вотермарка
    }

    $new -> crop(0, 0, $sizeImg[0], $sizeImg[1]);
} else {
    $new = $image->merge($watermark, 'left + ' . $deltaX, 'top+' . $deltaY, $opacity);
}



$new -> saveToFile($result);

exit;