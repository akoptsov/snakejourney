<?php 
include("../php/connect.php");

$name = $_POST['name'];

if(isset($name)){
	$connection = connect() or die("Failed to connect:".mysql_error());
	$rows = mysql_query('insert into Player (Name) values ('.mysql_real_escape_string($name).')', $connection) or die('Insert failure:'.mysql_error());
	$id = mysql_insert_id($connection);
	echo $id;
} die ("Requested POST parameter \"name\" hasn't been set");
?>