<?php

    function proper_url($path = '') {
        $appUrl = $_ENV['APP_URL'];  // Get the base URL from the environment variable
        
        // If no path is provided, return the base URL (domain only)
        if (empty($path)) 
            return rtrim($appUrl, '/');  // Ensure no trailing slash

        // If a path is provided, concatenate with the base URL
        return rtrim($appUrl, '/') . '/' . ltrim($path, '/');
    }

?>