require(['elgg', 'jquery', 'elgg/ready'], function (elgg, $) {
	elgg.register_hook_handler('ajax_response_data', 'all', function (name, type, params, data) {
		if (typeof data.value._states === 'undefined') {
			return;
		}
		console.log(data.value._states);
		require(['html/states'], function (states) {
			$.each(data.value._states, function (index, state) {
				console.log(index, state);
				if (state.selector) {
					var $elem = $(state.selector);
					delete state.selector;
					states.setState($elem, state);
				}
			});
		});
	});
});