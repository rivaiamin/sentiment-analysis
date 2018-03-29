<?php
require_once '../../vendor/autoload.php';

$stemmerFactory = new \Sastrawi\Stemmer\StemmerFactory();
$stemmer  = $stemmerFactory->createStemmer();

$input = $argv[1];
$output = $argv[2];

$sentences = @fopen($input, "r");

while (($sentence = fgets($sentences)) !== false) {
    $annotated = $stemmer->stem($sentence);
    file_put_contents($output, $annotated."\n", FILE_APPEND);
}
?>