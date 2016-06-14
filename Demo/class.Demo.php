<?php
/**
 * class.Demo.php
 *  
 */

  class DemoClass extends PMPlugin {
    function __construct() {
      set_include_path(
        PATH_PLUGINS . 'Demo' . PATH_SEPARATOR .
        get_include_path()
      );
    }

    function setup()
    {
    }

    function getFieldsForPageSetup()
    {
    }

    function updateFieldsForPageSetup()
    {
    }

  }
?>