<?php 
include("../php/connect.php");

$connection = connect() or die("Failed to connect:".mysql_error());
$players = mysql_query_or_die('select Id, Name from Player', $connection);
$result = array();
while($player = mysql_fetch_assoc($players)){
	$result[] = $player;
} 
echo json_encode($result);
?>