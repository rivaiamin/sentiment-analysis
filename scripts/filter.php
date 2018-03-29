<?php
$input = $argv[1];
$output = $argv[2];
unlink($output);

$finput = @fopen($input, "r");
$i = 0;
while (($tweet = fgets($finput)) !== false) {
    $obj = json_decode($tweet);
    if ($obj->lang == 'in' and $obj->user->verified == false) {
        $tweets[$i] = [
            'id' => $obj->id,
            'full_text' => $obj->full_text,
            'user_id' => $obj->user->id,
            'user_name' => $obj->user->name,
            'retweeeted' => $obj->retweeted,
            'favorite_count' => $obj->favorite_count,
            'created_at' => $obj->created_at,
            'geo' => $obj->geo,
            'source' => $obj->source,
            'user_mentions' => []
        ];
        if ($obj->entities->user_mentions != []) {
            foreach ($obj->entities->user_mentions as $mention) {
                $tweets[$i]['user_mentions'][] = $mention->name;
            }
        }
        $i++;
    }
}
file_put_contents($output, json_encode($tweets));
print_r("Jumlah data: ".$i."\n");

fclose($finput);

?>
