<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

add_action('rest_api_init', function () {
    register_rest_route('radio-scheduler/v1', '/events', array(
        'methods' => 'GET',
        'callback' => 'fetch_radio_scheduler_events',
        'permission_callback' => '__return_true',
    ));
});

// Let's fetch some database stuff
function fetch_radio_scheduler_events() {
    global $wpdb;

    $query = "
        SELECT * FROM {$wpdb->prefix}to_events_scheduler
        WHERE (EventMeta1 IS NULL OR EventMeta1 NOT IN ('cancelled', 'deleted'))
    ";    

    $results = $wpdb->get_results($query);

    // Log
    if ($wpdb->last_error) {
        error_log('SQL Error: ' . $wpdb->last_error);
    }

    // Log
    error_log('Raw query results: ' . json_encode($results, true));

    $events = array_map(function ($result) {
        return [
            'title' => $result->EventName,
            'date'  => $result->EventDate,
            'EventColor' => $result->EventColor,
        ];
    }, $results);

    // Log
    error_log('Formatted events: ' . print_r($events, true));

    return new WP_REST_Response($events, 200);
}