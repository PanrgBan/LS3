<?php
require_once 'lib/WideImage.php';

$image = WideImage::load('../images/first.jpg');
$watermark = WideImage::load('../images/second.jpg');
//$left = отступ слева
//$top = отступ сверху

$new = $image->merge($watermark, 'left + 20%', 'top+30%', '100');

$new ->saveToFile('../images/result.jpg');

unlink('../images/first.jpg');
unlink('../images/second.jpg');

echo 'success!';

exit;