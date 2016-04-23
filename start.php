<?php

/**
 * Element States
 *
 * @author Ismayil Khayredinov <info@hypejunction.com>
 * @copyright Copyright (c) 2016, Ismayil Khayredinov
 */
elgg_register_event_handler('init', 'system', 'ui_element_states_init');

/**
 * Initialize the plugin
 * @return void
 */
function ui_element_states_init() {

	elgg_extend_view('elgg.js', 'html/ajax_states.js');
	elgg_register_plugin_hook_handler('view_vars', 'output/url', 'ui_element_states_prepare_states');
}

/**
 * Prepare element states
 *
 * @param string $hook   "view_vars"
 * @param string $type   "output_url"
 * @param array  $vars   View vars
 * @param array  $params Hook params
 * @return array
 */
function ui_element_states_prepare_states($hook, $type, $vars, $params) {
	$state = elgg_extract('state', $vars);
	$states = (array) elgg_extract('states', $vars);

	unset($vars['state']);
	unset($vars['states']);

	if (empty($states)) {
		return;
	}

	elgg_require_js('html/states');
	
	$state_names = array_keys($states);

	if (!$state || !array_key_exists($state, $states)) {
		$state = $state_names[0];
	}

	foreach ($state_names as $key => $state_name) {
		if (!isset($states[$state_name]['after_state'])) {
			$states[$state_name]['after_state'] = isset($state_names[$key+1]) ? $state_names[$key+1] : $state_names[0];
		}
	}

	$vars = array_merge($vars, $states[$state]);
	$vars['data-states'] = json_encode($states);
	$vars['data-state'] = $state;

	return $vars;
}
