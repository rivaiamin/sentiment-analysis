<?php
$input = $argv[1];
$output = $argv[2];
unlink($output);

$tweets = json_decode(@file_get_contents($input));
foreach ($tweets as $tweet) {
    $text = $tweet->full_text;
    
    // remove multiple whitespace
    $text = preg_replace('/\s+/', ' ',$text);
    
    //remove link and retweet
    $regex = "@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?).*$)@";
    $text = preg_replace($regex, ' ', $text);
    
    file_put_contents($output, $text."\n", FILE_APPEND);
}

print_r("Jumlah text: ".count($tweets)."\n");
?>