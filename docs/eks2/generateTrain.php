<?php
$sentences = @fopen("preprocessing/corpus-sa.txt", "r");

$num_mixed=0;
$num_netral=0;
$num_positive=0;
$num_negative=0;
unlink("preprocessing/train-sa.txt");
while (($sentence = fgets($sentences)) !== false) {
    $tokens = explode(" ", $sentence);
    $negate_next = false;
    $positive = 0;
    $negative = 0;
    $resentence = "";
    foreach ($tokens as $token) {
        $sentiments = explode('|', $token);
        if (count($sentiments)>1) {
            switch ($sentiments[1]) {
                case 'negation':
                    $negate_next = true;
                    break;
                case 'positive':
                    if ($negate_next == true) $negative++;
                    else $positive++;
                    $negate_next = false;
                    break;
                case 'negative':
                    if ($negate_next == true) $positive++;
                    else $negative++;
                    $negate_next = false;
                    break;
            }
            $resentence .= $sentiments[0]." ";
        } else {
            $negate_next = false;
            $resentence .= $token." ";
        }
    }
    
    if ($negative == 0 && $positive == 0) {
        $label = '00';
        $num_netral++;
    } else if ($negative == $positive) {
        $label = '11';
        $num_mixed++;
    } else if ($positive < $negative) {
        $label = '01';
        $num_negative++;
    } else if ($positive > $negative) {
        $label = '10';
        $num_positive++;
    }
    
    $annotated = $label." ".$resentence;
    file_put_contents("preprocessing/train-sa.txt", $annotated, FILE_APPEND);
}

echo "Mixed: ".$num_mixed."\n";
echo "Positive: ".$num_positive."\n";
echo "Negative: ".$num_negative."\n";
echo "Neutral: ".$num_netral."\n";
fclose($sentences);