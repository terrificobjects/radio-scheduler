=== Radio Scheduler ===
Contributors:      Terrific Objects
Tags:              block
Tested up to:      6.1
Stable tag:        0.1.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

This block will have a calendar that integrates an AzuraCast schedule into the FullCalendar library.

== Description ==

This plugin uses FullCalendar to create different calendars that have schedule data from an AzuraCast schedule in them. It can also create schedules directly within WordPress.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/radio-scheduler` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Changelog ==

= 0.0.1 =
* Release

= 0.0.2 =
Added Dashboard menu for Schedule Management
Added plugin activation code for table creation
Added fullpage selection calendar for schedule event creation to admin page
Set up Ajax for rudimentary event data manipulation and storage

= 0.0.3 =
Added Event Manager page in Dashboard
Rewrote some code for new page
Connected created events to frontend calendar display
Added block styles and attributes

= 0.1.0 =
Updated packages to latest for react and @wordpress/scripts
Organized files into simpler structure
Updated namespaces and cleaned up

= 0.1.1 =
Removed unnecessary view.js files from src directories
Added SweetAlert2 packages to blocks
Added custom calendar and SweetAlert2 colors to Editor

= 0.1.2 =
Added custom color picker for individual events
Added EventColor column to plugin custom database table init
Set up Editor to display custom colors on calendar in edit mode
Added custom color editor to Events Manager admin page