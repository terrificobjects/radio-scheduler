<?php

// Handle AJAX request to create an event
function radio_scheduler_create_event() {
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'to_events_scheduler';

    $data = $_POST['data'];

    $wpdb->insert(
        $table_name,
        array(
            'DateCreated'   => current_time('mysql'),
            'UserID'        => get_current_user_id(),
            'EventName'     => sanitize_text_field($data['eventName']),
            'EventDate'     => sanitize_text_field($data['start']),
            'EventStartTime'=> sanitize_text_field($data['start']),
            'EventEndTime'  => sanitize_text_field($data['end']),
            'EventArtist'   => sanitize_text_field($data['eventArtist']),
            'EventGenre'    => sanitize_text_field($data['eventGenre']),
            'EventURL'      => esc_url_raw($data['eventURL']),
            'EventStation'  => sanitize_text_field($data['eventStation']),
        )
    );

    wp_send_json_success();
}
add_action('wp_ajax_radio_scheduler_create_event', 'radio_scheduler_create_event');

// Handle AJAX request to fetch events
function radio_scheduler_get_events() {
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'to_events_scheduler';

    $results = $wpdb->get_results("SELECT * FROM $table_name");

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
