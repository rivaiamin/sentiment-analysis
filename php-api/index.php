<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization');
require '../vendor/autoload.php';
require 'Sentiment.php';

use flight\Engine;
$app = new Engine();
$sentiment = new Sentiment;

$app->route('/', [$sentiment,'get']);
$app->route('/check', [$sentiment, 'check']);

$app->start();