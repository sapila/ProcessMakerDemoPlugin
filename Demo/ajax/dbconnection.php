<?php
require_once 'dbconfig.php';

$con = mysql_connect($server, $dbuser, $dbpassword) or die('erre[]');
mysql_select_db($database, $con);

?>