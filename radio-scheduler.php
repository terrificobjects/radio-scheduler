<?php
/**
 * Plugin Name: Radio Scheduler
 * Description: A plugin to schedule radio events using the npm FullCalendar react library.
 * Version: 0.0.2
 * Author: Terrific Objects
 * Text Domain: radio-scheduler
 */

 // When we first activate the plugin, create database table
register_activation_hook(__FILE__, 'create_events_table');
function create_events_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'to_events_scheduler';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
        ID mediumint(9) NOT NULL AUTO_INCREMENT,
        DateCreated datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        UserID mediumint(9) NOT NULL,
        EventName tinytext NOT NULL,
        EventDate date NOT NULL,
        EventStartTime time NOT NULL,
        EventEndTime time NOT NULL,
        EventArtist tinytext,
        EventGenre tinytext,
        EventURL varchar(255),
        EventStation tinytext,
        EventMeta1 text,
        EventMeta2 text,
        EventMeta3 text,
        PRIMARY KEY  (ID)
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Let's add our admin menu here
add_action('admin_menu', 'add_schedule_menu');

function add_schedule_menu() {
    // Gotta use __return_null as a placeholder for the menu page callback
    add_menu_page('Schedule', 'Schedule', 'manage_options', 'schedule', '__return_null', 'dashicons-calendar-alt', 6);
    
    // Schedules submenu page
    add_submenu_page('schedule', 'Schedules', 'Schedules', 'manage_options', 'schedules', 'schedules_page_display');
}

// Still need to output FullCalendar and SweetAlert2 on the Schedules page
function schedules_page_display() {

}

function radio_scheduler_block_assets() {
    // Enqueue the block's editor script
    wp_enqueue_script(
        'radio-scheduler-block-editor',
        plugins_url('build/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    // Enqueue FullCalendar for both editor and frontend
    wp_enqueue_script(
        'fullcalendar-global',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.14/index.global.min.js',
        array(),
        '6.1.14',
        true
    );

    // Enqueue our block's frontend script
    wp_enqueue_script(
        'radio-scheduler-block-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/frontend.js'),
        true
    );
}
add_action('enqueue_block_assets', 'radio_scheduler_block_assets');
