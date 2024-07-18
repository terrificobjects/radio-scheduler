<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

add_action('wp_ajax_fetch_events', 'fetch_events');
add_action('wp_ajax_update_event', 'update_event');
add_action('wp_ajax_delete_event', 'delete_event');

function fetch_events() {
    global $wpdb;
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    $results = $wpdb->get_results("
        SELECT * FROM {$wpdb->prefix}to_events_scheduler
        WHERE (EventMeta1 IS NULL OR EventMeta1 NOT IN ('cancelled', 'deleted'))
    ");

    wp_send_json_success($results);
}

function update_event() {
    global $wpdb;
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    $id = intval($_POST['id']);
    $event_data = [
        'EventName' => sanitize_text_field($_POST['EventName']),
        'EventDate' => sanitize_text_field($_POST['EventDate']),
        'EventStartTime' => sanitize_text_field($_POST['EventStartTime']),
        'EventEndTime' => sanitize_text_field($_POST['EventEndTime']),
        'EventArtist' => sanitize_text_field($_POST['EventArtist']),
        'EventGenre' => sanitize_text_field($_POST['EventGenre']),
        'EventURL' => esc_url_raw($_POST['EventURL']),
        'EventStation' => sanitize_text_field($_POST['EventStation']),
        'EventMeta1' => sanitize_text_field($_POST['EventMeta1']),
    ];

    $wpdb->update(
        "{$wpdb->prefix}to_events_scheduler",
        $event_data,
        ['ID' => $id],
        array_fill(0, count($event_data), '%s'),
        ['%d']
    );

    wp_send_json_success();
}

function delete_event() {
    global $wpdb;
    check_ajax_referer('radio_scheduler_nonce', 'nonce');

    $id = intval($_POST['id']);

    $wpdb->delete(
        "{$wpdb->prefix}to_events_scheduler",
        ['ID' => $id],
        ['%d']
    );

    wp_send_json_success();
}
