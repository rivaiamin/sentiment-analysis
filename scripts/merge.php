<?php
// Merge all dataset in directory to one file

$log_directory = $argv[1];
$output = $argv[2];

$i=0;
foreach(glob($log_directory.'/*.jsonl') as $file) {
    $data = json_decode(file_get_contents($file));
    foreach ($data->results as $tweet) {
        if ($tweet->lang == 'in' and $tweet->user->verified == false and $tweet->retweeted == false) {
            $tweets[] = [
                'id' => $tweet->id,
                'text' => $tweet->text,
                'user_id' => $tweet->user->id,
                'user_name' => $tweet->user->name,
                //'retweeeted' => $tweet->retweeted,
                //'favorite_count' => $tweet->favorite_count,
                'created_at' => $tweet->created_at,
                //'geo' => $tweet->geo,
                'source' => $tweet->source,
                //'user_mentions' => []
            ];
            /* if ($tweet->entities->user_mentions != []) {
                foreach ($tweet->entities->user_mentions as $mention) {
                    $tweets[$i]['user_mentions'][] = $mention->name;
                }
            } */
            $i++;
        }
    }
}

file_put_contents($output, json_encode($tweets));
print_r("Jumlah tweet: ".$i."\n");