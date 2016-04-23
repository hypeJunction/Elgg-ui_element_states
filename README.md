Element States for Elgg
================
![Elgg 2.0](https://img.shields.io/badge/Elgg-2.0.x-orange.svg?style=flat-square)

## Features

* API for creating stateful HTML elements

## Usage

### Create an anchor that changes its state on click

In the following example, the button is rendered based on the current friendship state between users.
On each click, an action is performed via AJAX, and the state of the anchor is updated to the `after_state` on success.

```php

$entity = elgg_extract('entity', $vars);
$viewer = elgg_get_logged_in_user_entity();

if (!$entity->isFriendOf($viewer->guid)) {
	if (check_entity_relationship($viewer->guid, 'friendrequest', $entity->guid)) {
		$state = 'revoke';
	} else {
		$state = 'add';
	}
} else {
	$state = 'remove';
}

echo elgg_view('output/url', [
	'data-guid' => $entity->guid,
	'state' => $state,
	'states' => [
		'add' => [
			'text' => elgg_echo('friend:add'),
			'href' => "action/friends/add?friend={$entity->guid}",
			'is_action' => true,
			'class' => 'elgg-button elgg-button-action',
			'after_state' => 'revoke',
		],
		'revoke' => [
			'text' => elgg_echo('friend_request:friend:add:pending'),
			'title' => elgg_echo('friend_request:revoke'),
			'href' => "action/friend_request/revoke?guid={$entity->guid}",
			'is_action' => true,
			'class' => 'elgg-button elgg-button-special',
			'after_state' => 'add',
		],
		'remove' => [
			'text' => elgg_echo('friend:remove'),
			'href' => "action/friends/remove?friend={$entity->guid}",
			'is_action' => true,
			'class' => 'elgg-button elgg-button-delete',
			'after_state' => 'add',
		]
	]
]);
```


### Update a DOM element on AJAX success

You can use AJAX responses to update an element (`elgg/Ajax` API usage is assumed).

```php
// somewhere in the user listing
$counter = elgg_format_element('span', [
	'data-guid' => $entity->guid,
	'class' => 'friends-counter',
		], $entity->getFriends(['count' => true]));

echo "$counter friends";
```

```php
// on successful action
if (elgg_is_xhr()) {
	echo json_encode([
		'_states' => [
			// Update friend counters
			[
				'selector' => ".friends-counter[data-guid=\"$friend->guid\"]",
				'text' => $friend->getFriends(['count' => true]),
			],
			// Update unread messages count while at it
			[
				'selector' => '#messages-new',
				'html' => elgg_format_element('span', [
					'class' => 'unread-counter',
				], messages_count_unread()),
				'class' => 'has-unread-messages',
				'title' => 'You have unread messages',
			]
		]
	]);
}
```