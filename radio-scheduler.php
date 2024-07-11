<?php
/**
 * Plugin Name: Radio Scheduler
 * Description: A plugin to schedule radio events using the npm FullCalendar react library.
 * Version: 0.0.2
 * Author: Terrific Objects
 * Text Domain: radio-scheduler
 */

// Include all of our Ajax handlers
require_once plugin_dir_path(__FILE__) . 'ajax-handlers.php';
require_once plugin_dir_path(__FILE__) . 'fetch-events.php';
require_once plugin_dir_path(__FILE__) . 'event-manager.php';

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
    // Add main menu item
    add_menu_page('Events', 'Events', 'manage_options', 'events', 'events_page_display', 'dashicons-calendar-alt', 6);

    // Add sub-menu item
    add_submenu_page('events', 'Schedules', 'Schedules', 'manage_options', 'schedules', 'schedules_page_display');
}

function events_page_display() {
    ?>
    <div id="event-list"></div>
    <?php
}

function schedules_page_display() {
    ?>
    <div id="calendar"></div>
    <?php
}

function radio_scheduler_enqueue_admin_scripts($hook_suffix) {
    if ($hook_suffix !== 'toplevel_page_events' && $hook_suffix !== 'events_page_schedules') {
        return;
    }

    // Enqueue FullCalendar and SweetAlert2 for admin
    wp_enqueue_script(
        'fullcalendar-global',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.14/index.global.min.js',
        array(),
        '6.1.14',
        true
    );

    wp_enqueue_script(
        'sweetalert2',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js',
        array(),
        '11.1.9',
        true
    );

    wp_enqueue_style(
        'sweetalert2-style',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css',
        array(),
        '11.1.9'
    );

    wp_enqueue_script(
        'radio-scheduler-admin',
        plugins_url('admin.js', __FILE__),
        array('jquery'),
        filemtime(plugin_dir_path(__FILE__) . 'admin.js'),
        true
    );

    wp_enqueue_script(
        'radio-scheduler-event-manager',
        plugins_url('event-manager.js', __FILE__),
        array('jquery'),
        filemtime(plugin_dir_path(__FILE__) . 'event-manager.js'),
        true
    );

    wp_localize_script('radio-scheduler-admin', 'radioSchedulerAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('radio_scheduler_nonce')
    ));

    wp_localize_script('radio-scheduler-event-manager', 'radioSchedulerAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('radio_scheduler_nonce')
    ));
}
add_action('admin_enqueue_scripts', 'radio_scheduler_enqueue_admin_scripts');

function radio_scheduler_block_assets() {
    // Enqueue a block's editor script
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

    // Enqueue block's frontend script
    wp_enqueue_script(
        'radio-scheduler-block-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/frontend.js'),
        true
    );
}
add_action('enqueue_block_assets', 'radio_scheduler_block_assets');
