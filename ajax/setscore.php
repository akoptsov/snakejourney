<?php 
include("../php/connect.php");

$playerid = $_POST['playerid'];
$score = $_POST['score'];
$time=$_POST['time'];

if(isset($playerid) && isset($score) && isset($time)){
	var $connection = connect() or die("Failed to connect:".mysql_error());
	var $rows = mysql_query(
	'insert into Scores 
		(PlayerId, Score, Time) 
	values ('.mysql_real_escape_string($playerid).','..mysql_real_escape_string($score).','..mysql_real_escape_string($time).')', $connection) 
		or die('Insert failure:'.mysql_error());
	echo 'success';
} die ("Requested POST parameter \"name\" hasn't been set")
?>