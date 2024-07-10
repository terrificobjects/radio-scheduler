<?php
/**
 * Plugin Name: Radio Scheduler
 * Description: A plugin to schedule radio events using the npm FullCalendar react library.
 * Version: 0.0.1
 * Author: Terrific Objects
 * Text Domain: radio-scheduler
 */

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

    // Enqueue the block's frontend script
    wp_enqueue_script(
        'radio-scheduler-block-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/frontend.js'),
        true
    );
}
add_action('enqueue_block_assets', 'radio_scheduler_block_assets');
