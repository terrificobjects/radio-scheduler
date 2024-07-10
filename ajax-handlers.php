<?php
// Ensure this file is not accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Handle the request to create an event
function radio_scheduler_create_event() {
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'to_events_scheduler';

    $data = $_POST['data'];
    $event_date = DateTime::createFromFormat('m/d/Y', sanitize_text_field($data['eventDate']));

    if ($event_date) {
        $wpdb->insert(
            $table_name,
            array(
                'DateCreated'   => current_time('mysql'),
                'UserID'        => get_current_user_id(),
                'EventName'     => sanitize_text_field($data['eventName']),
                'EventDate'     => $event_date->format('Y-m-d'),
                'EventStartTime'=> sanitize_text_field(explode('T', $data['start'])[1]),
                'EventEndTime'  => sanitize_text_field(explode('T', $data['end'])[1]),
                'EventArtist'   => sanitize_text_field($data['eventArtist']),
                'EventGenre'    => sanitize_text_field($data['eventGenre']),
                'EventURL'      => esc_url_raw($data['eventURL']),
                'EventStation'  => sanitize_text_field($data['eventStation']),
            )
        );

        wp_send_json_success();
    } else {
        wp_send_json_error('Invalid date format');
    }
}
add_action('wp_ajax_radio_scheduler_create_event', 'radio_scheduler_create_event');

// Handle the request to fetch all events for calendar
function radio_scheduler_get_events() {
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'to_events_scheduler';

    $start_date = sanitize_text_field($_GET['start']);
    $end_date = sanitize_text_field($_GET['end']);

    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE EventDate BETWEEN %s AND %s",
        $start_date, $end_date
    ));

    $events = array();

    foreach ($results as $row) {
        $events[] = array(
            'title' => $row->EventName,
            'start' => $row->EventDate . 'T' . $row->EventStartTime,
            'end' => $row->EventDate . 'T' . $row->EventEndTime
        );
    }

    wp_send_json_success($events);
}
add_action('wp_ajax_radio_scheduler_get_events', 'radio_scheduler_get_events');
