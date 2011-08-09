<?php 
include("../php/connect.php");

$playerid = $_POST['playerid'];
$score = $_POST['score'];
$time = $_POST['time'];


if(isset($playerid)){
	if(isset($score)){
		if(isset($time)){
			var $connection = connect() or die("Failed to connect:".mysql_error());
			var $rows = mysql_query_or_die(
			'insert into Scores 
				(PlayerId, Score, Time) 
			values ('.mysql_real_escape_string($playerid).','..mysql_real_escape_string($score).','..mysql_real_escape_string($time).')', $connection);
			echo 'success';
		} else {
			param_not_set("time");
		}
	} else {
		param_not_set("score");
	}
} else {
	param_not_set("playerid");
}
?>