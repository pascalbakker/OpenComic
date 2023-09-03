function start()
{
	events.events();

	generateShortcutsTable();
}

function generateShortcutsTable(highlightItem = false)
{
	let list = shortcuts.shortcuts();

	// Keyboard
	let keys = {};

	for(let key in list.reading.shortcuts)
	{
		let action = list.reading.shortcuts[key];

		if(!keys[action]) keys[action] = [];
		keys[action].push(key);
	}

	// Gamepad
	let buttons = {};

	for(let button in list.reading.gamepad)
	{
		let action = list.reading.gamepad[button];

		if(!buttons[action]) buttons[action] = [];
		buttons[action].push(button);
	}

	let actions = [];

	for(let key in list.reading.actionsOrder)
	{
		let action = list.reading.actionsOrder[key];
		let data = list.reading.actions[action];

		let _keys = keys[action] || {};
		let _buttons = buttons[action] || {};

		let shortcut = {
			action: action,
			name: data.name,
			key1: _keys[0] || '',
			key2: _keys[1] || '',
			key3: _keys[2] || '',
			key4: _keys[3] || '',
			key5: _keys[4] || '',
			gamepad1: (_buttons[0] || '').toLowerCase(),
			gamepad1_: _buttons[0] || '',
			gamepad2: (_buttons[1] || '').toLowerCase(),
			gamepad2_: _buttons[1] || '',
		};

		actions.push(shortcut);
	}

	handlebarsContext.shortcuts = actions;

	let table = template._contentRight().querySelector('.settings-shortcuts-table');
	table.innerHTML = template.load('settings.content.right.shortcuts.html');

	gamepad.updateBrowsableItems('settings', false, !(highlightItem !== false));
	if(highlightItem !== false) gamepad.highlightItem(highlightItem);
}

var recording= false;

function changeShortcut(action, current, This)
{
	if(recording) return;

	recording = true;

	dom.this(template._contentRight()).find('table tbody td').removeClass('active');
	This.classList.add('active');

	shortcuts.record(function(shortcut) {

		shortcuts.change('reading', action, current, shortcut);

		generateShortcutsTable(gamepad.currentHighlightItem());

		setTimeout(function(){recording = false}, 100);

	});
}

function removeShortcut(action, current)
{
	shortcuts.change('reading', action, current, '');

	generateShortcutsTable(gamepad.currentHighlightItem());
}

function changeButton(action, current, This)
{
	if(recording) return;

	recording = true;

	dom.this(template._contentRight()).find('table tbody td').removeClass('active');
	This.classList.add('active');

	shortcuts.record(function(shortcut){

		gamepad.reset('record');

		console.log(This);
		This.classList.remove('active');

		events.snackbar({
			key: 'useGamepad',
			text: language.settings.shortcuts.useGamepad,
			duration: 6,
			update: true,
			buttons: [
				{
					text: language.buttons.dismiss,
					function: 'events.closeSnackbar();',
				},
			],
		});

		setTimeout(function(){recording = false}, 100);

	});

	console.log(action, current);

	gamepad.setButtonEvent('record', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], function(key, button){

		console.log(key, button);

		gamepad.reset('record');
		shortcuts.stopRecord();

		shortcuts.changeGamepad('reading', action, current, gamepad.buttonName(key));

		generateShortcutsTable(gamepad.currentHighlightItem());

		setTimeout(function(){recording = false}, 100);

	});
}

function removeButton(action, current)
{
	shortcuts.changeGamepad('reading', action, current, '');

	generateShortcutsTable(gamepad.currentHighlightItem());
}

function resoreShortcuts()
{
	shortcuts.restoreDefaults();

	generateShortcutsTable(gamepad.currentHighlightItem());
}

function setMaxMargin(value, save = false)
{
	if(save) storage.updateVar('config', 'readingMaxMargin', value);
}

function setGlobalZoom(value)
{
	storage.updateVar('config', 'readingGlobalZoom', value);
}

function setShowFullPathLibrary(value)
{
	storage.updateVar('config', 'showFullPathLibrary', value);
}

function setShowFullPathOpened(value)
{
	storage.updateVar('config', 'showFullPathOpened', value);
}

function setStartInFullScreen(value)
{
	storage.updateVar('config', 'startInFullScreen', value);
}

function setCheckReleases(value)
{
	storage.updateVar('config', 'checkReleases', value);

	dom.query('.settings-check-prereleases').class(!value, 'disable-pointer');
}

function setCheckPreReleases(value)
{
	storage.updateVar('config', 'checkPreReleases', value);
}


module.exports = {
	start: start,
	setMaxMargin: setMaxMargin,
	setGlobalZoom: setGlobalZoom,
	setShowFullPathLibrary: setShowFullPathLibrary,
	setShowFullPathOpened: setShowFullPathOpened,
	setStartInFullScreen: setStartInFullScreen,
	setCheckReleases: setCheckReleases,
	setCheckPreReleases: setCheckPreReleases,
	changeShortcut: changeShortcut,
	removeShortcut: removeShortcut,
	changeButton: changeButton,
	removeButton: removeButton,
	resoreShortcuts: resoreShortcuts,
};