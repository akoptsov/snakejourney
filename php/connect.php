<?php 
include("..\config.php");

function param_not_set($param, $method="POST"){
	header("HTTP/1.0 500 Internal Server Error");
	die("Requested ".$method." parameter \"".$param."\" is not set");
}

function mysql_query_or_die($query, $connection){
	
	$result = mysql_query($query, $connection);
	if(!$result){
		 header("HTTP/1.0 500 Internal Server Error");
		 die("Error in query \"".$query."\", error text:".mysql_error());
	}
	return $result; 
}

function connect(){
	global $sql_server;
	global $sql_login;
	global $sql_password;
	global $sql_database;
	//echo "<p>\$sql_server: $sql_server, \$sql_login:$sql_login, \$sql_password:$sql_password, \$sql_database: $sql_database</p>";
	if(isset($sql_server)){
		if(isset($sql_login) && isset($sql_password))
		{
			$connection = mysql_connect($sql_server, $sql_login, $sql_password) or die("Failed to connect to sql: ".mysql_error());
			if(isset($sql_database)){
				$database = mysql_select_db($sql_database, $connection);
				if(!$database){
					$database = (createdb($connection) and mysql_select_db($sql_database, $connection)) or die("Failed to select db: ".mysql_error());
				}
				return $connection;
			}
			else {
				mysql_close($connection) or die("Failed to close DB connection: ".mysql_error());
				die("\$sql_database is not defined. Check \"config.php\"");
			}
		} else die("\$sql_login or \$sql_password is not defined. Check \"config.php\"");
	} else die("\$sql_server not defined. Check \"config.php\"");
}

function createdb($connection){
	global $sql_database;
	$db_query = "create database ".$sql_database."";
	if(!mysql_query($db_query, $connection)) die("Failed to execute \"".$db_query."\"");
	
	$db = mysql_select_db($sql_database, $connection) or die("Failed to select \"".$sql_database."\" after creation: ".mysql_error());
	
	$player="CREATE TABLE IF NOT EXISTS `Player` (
		`Id` int(11) NOT NULL AUTO_INCREMENT,
		`Name` varchar(128) NOT NULL,
		`Password` varchar(128) DEFAULT NULL,
		PRIMARY KEY (`Id`)
	) ENGINE=InnoDB DEFAULT CHARSET=cp1251 AUTO_INCREMENT=1 ;";
	
	$score = "CREATE TABLE IF NOT EXISTS `Score` (
		`PlayerId` int(11) NOT NULL,
		`Score` int(11) NOT NULL,
		`Time` int(11) NOT NULL,
		`When` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		KEY `PlayerId` (`PlayerId`)
	) ENGINE=InnoDB DEFAULT CHARSET=cp1251;";
	
	$score_constr = "ALTER TABLE `Score`
	ADD CONSTRAINT `score_ibfk_1` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION;";
	
	$progress = "CREATE TABLE IF NOT EXISTS `Progress` (
		`PlayerId` int(11) NOT NULL,
		`Level` int(11) NOT NULL DEFAULT '0',
		KEY `PlayerId` (`PlayerId`)
	) ENGINE=InnoDB DEFAULT CHARSET=cp1251;";
	
	$progress_constr = "ALTER TABLE `Progress`
	ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION;";
	
	$result = (mysql_query($player, $connection) 
		and mysql_query($score, $connection) and mysql_query($score_constr, $connection) 
		and mysql_query($progress, $connection) and mysql_query($progress_constr, $connection)) or die("Failed to create DB structure!");
	return $result;
}

function teardowndb($connection){
	global $sql_database;
	$drop_query = "drop database ".$sql_database."";
	if(!mysql_query($drop_query, $connection)) die("Failed to execute \"".$drop_query."\"");
}
?>