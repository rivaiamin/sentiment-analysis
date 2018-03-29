<?php

require_once '../../vendor/autoload.php';

$stemmerFactory = new \Sastrawi\Stemmer\StemmerFactory();
$stopwordFactory = new \Sastrawi\StopWordRemover\StopWordRemoverFactory();
$stemmer  = $stemmerFactory->createStemmer();
$stopword  = $stopwordFactory->createStopWordRemover();

$input = $argv[1];
$output = $argv[2];

unlink($output);
unlink("log/generate-corpus.txt");

$negation_file = @file_get_contents("list/negation.txt");
$positive_file = @file_get_contents("list/positive.txt");
$negative_file = @file_get_contents("list/negative.txt");
$negations = preg_split('/\R/', $negation_file);
$positives = preg_split('/\R/', $positive_file);
$negatives = preg_split('/\R/', $negative_file);

$num_sentence = 0;
$num_negation = 0;
$num_positive = 0;
$num_negative = 0;
$sentences = @fopen($input, "r");

while (($sentence = fgets($sentences)) !== false) {
    // remove empty sentence
    if ($sentence == "\n") continue;
    if ($sentence == " \n") continue;
    
    $annotated = strtolower($stopword->remove($sentence));
    $log_text = "";
    $num_sentence++;

    $found = 0;
    for ($i=0; $i<count($negations); $i++) {
        $annotated = str_replace(" ".$negations[$i]." ", " ".$negations[$i]."|negation ", $annotated, $count);
        $found += $count;
        if ($count > 0) echo($log_text .= "#$num_sentence negation ".$negations[$i]."\n");
    }
    $num_negation += $found;
    
    $found = 0;
    for ($i=0; $i<count($positives); $i++) {
        $annotated = str_replace(" ".$positives[$i]." ", " ".$positives[$i]."|positive ", $annotated, $count);
        $found += $count;
        if ($count > 0) echo($log_text .= "#$num_sentence positive ".$positives[$i]."\n");
    }
    $num_positive += $found;

    $found = 0;
    for ($i=0; $i<count($negatives); $i++) {
        $annotated = str_replace(" ".$negatives[$i]." ", " ".$negatives[$i]."|negative ", $annotated, $count);
        $found += $count;
        if ($count > 0) echo($log_text .= "#$num_sentence negative ".$negatives[$i]."\n");
    }
    $num_negative += $found;
    
    file_put_contents($output, $annotated, FILE_APPEND);
    file_put_contents("log/generate-corpus.txt", $log_text, FILE_APPEND);
}

if (!feof($sentences)) {
    echo "Error: unexpected fgets() fail\n";
}

$result = "\nTotal Negation Found: $num_negation / $num_sentence \n";
$result .= "Total Positive Found: $num_positive / $num_sentence \n";
$result .= "Total Negative Found: $num_negative / $num_sentence \n";
file_put_contents("log/generate-corpus.txt", $result, FILE_APPEND);
fclose($sentences);
echo($result);
