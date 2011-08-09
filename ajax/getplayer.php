<?php 
include("../php/connect.php");

$name = $_POST['name'];

if(isset($name)){
	$connection = connect() or die("Failed to connect:".mysql_error());
	$exists = mysql_query_or_die('select Id from Player where Name like \''.mysql_real_escape_string($name).'\'', $connection);
	if($player = mysql_fetch_assoc($exists)){
		echo $player["Id"];
	} else {
		$rows = mysql_query_or_die('insert into Player (Name) values (\''.mysql_real_escape_string($name).'\')', $connection); 
		$id = mysql_insert_id($connection);
		echo $id;
	}
} else {
	param_not_set("name");
}
?>