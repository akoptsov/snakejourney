<?php 
include("../php/connect.php");

$name = $_POST['name'];
$level = $_POST['level']

if(isset($name)){
	if(isset($level))
	{
		$connection = connect() or die("Failed to connect:".mysql_error());
		$players = mysql_query_or_die("select Id from Player where Name like '".mysql_real_escape_string($name)."'", $connection);
		if($player = mysql_fetch_assoc($id)){
			mysql_query_or_die("delete from Progress where PlayerId=".$player["Id"], $connection);
			mysql_query_or_die("insert into Progress (PlayerId, Level) values (".$player["Id"].",".mysql_real_escape_string($level).")", $connection);
		} 
	} else {
		 param_not_set("level");
	}
} else {
	param_not_set("name");
}
?>