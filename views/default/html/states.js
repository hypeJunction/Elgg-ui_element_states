define(function (require) {

	var $ = require('jquery');

	var Ajax = require('elgg/Ajax');
	var ajax = new Ajax();

	var states_api = {
		/**
		 * Update element state
		 *
		 * @param {jQuery} $elem jQuery element
		 * @param {Object} state New state
		 * @returns {void}
		 */
		setState: function ($elem, state) {
			if (state.text) {
				$elem.text(state.text);
			} else if (state.html) {
				$elem.html(state.html);
			}
			delete state.text;
			delete state.html;
			$elem.prop(state);
		},
		/**
		 * Callback function to update element state on click
		 *
		 * @param {Object} e jQuery event
		 * @returns {void|Boolean}
		 */
		onClick: function (e) {

			var $elem = $(this);

			if ($elem.prop('disabled')) {
				return false;
			}

			var item_state = $elem.data('state');
			var item_states = $elem.data('states');
			if (!item_state || !item_states) {
				return;
			}
			var current_state = item_states[item_state];
			if (!current_state || !current_state.after_state) {
				return;
			}

			var after_state = item_states[current_state.after_state];

			if (!current_state.is_action) {
				return;
			}

			e.preventDefault();

			ajax.action($elem.prop('href'))
					.done(function () {
						states_api.setState($elem, after_state);
						$elem.data('state', current_state.after_state);
					});
		}
	};

	$(document).on('click', '[data-state]', states_api.onClick);

	return states_api;
});
