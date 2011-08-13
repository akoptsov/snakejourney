<?php 
include("../php/connect.php");

$playerid = $_POST['playerid'];
$score = $_POST['score'];
$time = $_POST['time'];
$won = $_POST['won'];


if(isset($playerid)){
	if(isset($score)){
		if(isset($time)){
			$connection = connect() or die("Failed to connect:".mysql_error());
			$rows = mysql_query_or_die(
			'insert into Score 
				(PlayerId, Score, Time, Won) 
			values ('.mysql_real_escape_string($playerid).
					','.mysql_real_escape_string($score).
					','.mysql_real_escape_string($time).
					','.mysql_real_escape_string($won).')', $connection);
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