<?php
class Sentiment {

    public function __construct() {
        $this->label = [
            '00' => 'neutral',
            '01' => 'negative',
            '10' => 'positive',
            '11' => 'mixed'
        ];
    } 

    public function get() {
        echo "Hello Sentiment";
    }

    public function check() {
        
        $request = Flight::request();
        
        $text = $request->data->full_text;
        $sentiment = shell_exec('java -cp opennlp.custom.jar com.rivaiamin.ml.SentimentCheck "'.$text.'"');
        
        $response = [
            'code' => 0,
            'message' => 'Sentiment Check Succeed', 
            'data' => ['sentiment' => $sentiment, 'sentiment_label' => $this->label["$sentiment"], 'text'=>$text ]
        ];

        Flight::json($response);

    }

    public function crawl() {
        //$query = 'twurl "/1.1/tweets/search/'.$sandbox.'/dev.json?query='.$keyword.'&fromDate='.$from.'&toDate='.$to.$n.'"';
    }

}