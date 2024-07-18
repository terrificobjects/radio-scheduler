<?php

/**
 * Plugin Name: Radio Scheduler
 * Description: A plugin to schedule radio events using the npm FullCalendar react library.
 * Version: 0.1.2
 * Author: Terrific Objects
 * Text Domain: radio-scheduler
 */

// Include all of our Ajax handlers
require_once plugin_dir_path(__FILE__) . 'includes/php/ajax-handlers.php';
require_once plugin_dir_path(__FILE__) . 'includes/php/fetch-events.php';
require_once plugin_dir_path(__FILE__) . 'includes/php/event-manager.php';

// When we first activate the plugin, create database table
register_activation_hook(__FILE__, 'create_events_table');
function create_events_table()
{
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
        EventColor varchar(8),
        EventMeta1 text,
        EventMeta2 text,
        EventMeta3 text,
        PRIMARY KEY  (ID),
        INDEX event_date_idx (EventDate),
        INDEX event_name_idx (EventName(100)),
        INDEX user_id_idx (UserID)
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Let's add our admin menu here
add_action('admin_menu', 'add_schedule_menu');

function add_schedule_menu()
{
    // Add main menu item
    add_menu_page('Events', 'Events', 'manage_options', 'events', 'events_page_display', 'dashicons-calendar-alt', 6);

    // Add sub-menu item
    add_submenu_page('events', 'Schedules', 'Schedules', 'manage_options', 'schedules', 'schedules_page_display');
}

function events_page_display()
{
?>
    <style>
        #event-list {
            display: flex;
            flex-direction: column;
        }

        .event-header {
            font-weight: bold;
            display: flex;
            border-bottom: 2px solid #000;
            padding: 10px 0;
        }

        .event-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
        }

        .event-column {
            flex: 1;
            padding: 0 5px;
            text-align: left;
            display: flex;
            align-items: center;
        }

        .event-column input,
        .event-column select {
            width: 100%;
        }

        .event-column button {
            margin-left: 5px;
        }
    </style>
    <div class="event-manager-title">
        <h1>Event Manager</h1>
    </div>
    <div id="event-list"></div>
<?php
}

function schedules_page_display()
{
?>
    <div id="calendar"></div>
<?php
}

function radio_scheduler_enqueue_admin_scripts($hook_suffix)
{
    if ($hook_suffix !== 'toplevel_page_events' && $hook_suffix !== 'events_page_schedules') {
        return;
    }

    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');

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
        plugins_url('includes/js/admin.js', __FILE__),
        array('jquery'),
        filemtime(plugin_dir_path(__FILE__) . 'includes/js/admin.js'),
        true
    );

    wp_enqueue_script(
        'radio-scheduler-event-manager',
        plugins_url('includes/js/event-manager.js', __FILE__),
        array('jquery'),
        filemtime(plugin_dir_path(__FILE__) . 'includes/js/event-manager.js'),
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

function radio_scheduler_block_assets()
{
    // Enqueue a block's editor script
    wp_enqueue_script(
        'radio-scheduler-block-editor',
        plugins_url('build/radio-scheduler/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'build/radio-scheduler/index.js')
    );

    // Enqueue block's frontend script
    wp_enqueue_script(
        'radio-scheduler-block-frontend',
        plugins_url('build/radio-scheduler/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/radio-scheduler/frontend.js'),
        true
    );

    // Enqueue a block's editor script
    wp_enqueue_script(
        'radio-station-embed-block-editor',
        plugins_url('build/radio-station-embed/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'build/radio-station-embed/index.js')
    );
    
    // Enqueue block's frontend script
    wp_enqueue_script(
        'radio-station-embed-block-frontend',
        plugins_url('build/radio-station-embed/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/radio-station-embed/frontend.js'),
        true
    );

    // Enqueue FullCalendar for both editor and frontend
    wp_enqueue_script(
        'fullcalendar-global',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.14/index.global.min.js',
        array(),
        '6.1.14',
        true
    );
}
add_action('enqueue_block_assets', 'radio_scheduler_block_assets');
