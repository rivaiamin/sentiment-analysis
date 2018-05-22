<?php
$sandbox = $argv[1];
$keyword = $argv[2];
$from = $argv[3];
$to = $argv[4];
$next = @$argv[5];   

for ($i=0;$i<100;$i++) {
    $filename = "dataset/".$keyword.'-'.time().'-'.$i.'.jsonl';
    
    if (!empty($next)) $n = '&next='.$next; 
    else $n = '';
    
    $query = 'twurl "/1.1/tweets/search/'.$sandbox.'/dev.json?query='.$keyword.'&fromDate='.$from.'&toDate='.$to.$n.'"';

    $crawl = json_decode(shell_exec($query));
    
    if (!property_exists($crawl, 'next')) break;

    $next = $crawl->next;

    file_put_contents($filename, json_encode($crawl));
    print_r("Out: " .$filename." next: ".$crawl->next." \n");
}
