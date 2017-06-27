# ActionLayer

class Action
	constructor: (options = {}) ->
		@name = options.name ? "action#{_.random(1000)}"
		@trigger = options.trigger ? throw 'Action requires a trigger.'
		@action = options.action ? throw 'Action requires an action.'
		@enabled = options.enabled ? true


class ActionLayer extends Layer
	constructor: (options = {}) ->

		###
		An ActionLayer is designed to simplify adding and managing events. 

		The class uses 'action objects', which are an object with a trigger, action, 
		and (optionally) a name. The trigger is a Framer Event property, formatted as 
		a string, such as 'Tap', 'SwipeEnd' or 'TouchStart'. The action is a function, 
		such as -> print 'Hello'. The name may be any string and is optional.

		**Initial Action**

		An ActionLayer has an 'initial action' that may be set with the 'trigger' and
		'action' properties. This initial action may be enabled or disabled using the 
		'initial' property. 

			layerA = new ActionLayer
				trigger: 'Tap'
				action: -> print 'Hello World'

			layerB = new ActionLayer
			layerB.trigger = 'SwipeEnd'
			layerB.action = -> print 'Swiped!'

			layerC = new ActionLayer
				initial: false

		By default, an ActionLayer has an initial action with a 'Tap' trigger and an
		action that causes it to quickly blink.

		**Toggle Actions**

		An ActionLayer may also be set to have two options which toggle one another,
		called 'toggleOn' and 'toggleOff'. They may be set with the toggleOn and 
		toggleOff properties. The property 'toggle' must be set to true before these
		actions will be run.

			layerD = new ActionLayer
				toggle: true
				toggleOn:
					trigger: 'Tap'
					action: -> print 'Toggled on.'
				toggleOff:
					trigger: 'Tap'
					action: -> print 'Toggled off.'
		
		By default, an ActionLayer's toggleOn action will darken the layer, while its 
		toggleOff will restore the layer to regular brightness; and both of these
		default actions will use the 'Tap' trigger.

		If trigger properties are not provided for the toggleOn or toggleOff options,
		the ActionLayer's initial action trigger will be used instead.

			layerE = new ActionLayer
				trigger: 'SwipeEnd'
				toggle: true
				toggleOn:
					action: -> print 'Swiped on.'
				toggleOff:
					action: -> print 'Swiped off.'
		
		An ActionLayer's toggle status may be accessed with the 'isOn' property.

			layerE = new ActionLayer
				toggle: true
				toggleOn:
					action: -> print layerE.isOn # prints true
				toggleOff:
					action: -> print layerE.isOn # prints false

		Finally, an ActionLayer's toggled status may be set programmaically, using the
		`toggled` function.

			layerE = new ActionLayer
				toggle: true
				toggleOn:
					action: -> print layerE.isOn # prints true
				toggleOff:
					action: -> print layerE.isOn # prints false

			layerE.toggled = true

		To prevent conflicts, a .05 second minimum delay exists between setting an
		ActionLayer's toggle. If rapid toggles are created programmaically, this
		must be overcome using a delay.

			layerE.toggled = true
			Utils.delay .05, -> layerE.toggled = false

		**Additional Actions**

		Additional actions may be added to an ActionLayer using the addAction function.

			layerF = new ActionLayer

			layerF.addAction
				trigger: 'SwipeEnd'
				action: -> print 'Swiped!'

		Actions may be added but not immediately enabled, using the `enable` property.

			layerF = new ActionLayer

			layerF.addAction
				trigger: 'SwipeEnd'
				action: -> print 'Swiped!'
				enable: false

		Actions may also be disabled using the `disableAction` function.

			layerF = new ActionLayer

			layerF.addAction
				name: 'swiped'
				trigger: 'SwipeEnd'
				action: -> print 'Swiped!'

			layerF.disableAction
				name: 'swiped'

		And they may be enabled using the `enableAction` function.

			layerF = new ActionLayer

			layerF.addAction
				name: 'swiped'
				enable: false
				trigger: 'SwipeEnd'
				action: -> print 'Swiped!'

			layerF.enableAction
				name: 'swiped'

		Additional actions may be removed using the removeAction function. 

			layerG = new ActionLayer

			layerG.addAction
				trigger: 'SwipeEnd'
				action: -> print 'Swiped!'

			layerG.addAction
				trigger: 'SwipeEnd'
				name: 'reallySwiped'
				action: -> print 'Really, it was swiped!'

			layerG.removeAction
				name: 'reallySwiped'

		In the `enableAction`, `disableAction` and `removeAction` functions, the
		actions affected depend on which properties are provided in the function's 
		arguments.

		If only the `trigger` is provided, all actions with that trigger will be 
		removed. If a name is provided, all actions with that name will be removed. 
		If both a name and a trigger are provided, all actions with both that name 
		and that trigger will be removed.

		**Enable**

		An ActionLayer may have all events enabled or disabled by using the 'enable'
		property. This property turns on or off the layer's ignoreEvents property.

		###

		# set general options
		@_actions = []
		@_toggle = false
		@_toggled = false

		# define initial action object
		@_trigger = options.trigger ? 'Tap'
		@_action = options.action ? ->
			@blinkUp = new Animation @, {brightness: 150, options:{time: .15}}
			@blinkUp.on Events.AnimationEnd, -> @reset()
			@blinkUp.start()
		@_initialAction = {name: 'initialAction', trigger: @_trigger, action: _.bind(@_action, @), enable: true}

		# define toggleOn action object
		@_onTrigger = options.toggleOn?.trigger ? @_trigger ? 'MouseOver'
		@_onAction = 	options.toggleOn?.action ? -> @animate {opacity: .6, options: {time: .15}}
		@_toggleOn = {name: 'toggleOn', trigger: @_onTrigger, enable: true, action: ->
			@toggled = true
			}

		# define toggleOff action object
		@_offTrigger = options.toggleOff?.trigger ? @_trigger ? 'MouseOut'
		@_offAction =  options.toggleOff?.action ? -> @animate {opacity: 1, options: {time: .15}}
		@_toggleOff = {name: 'toggleOff', trigger: @_offTrigger, enable: true, action: ->
			@toggled = false
			}


		# set options from options object
		super _.defaults options

		
		# set initial (if true, set initial action)
		@initial = options.initial ? true

		# set toggle (if true, set toggle actions)
		@_toggle = options.toggle ? false

		# set whether to enable events (if false, set ignore events)
		@enable = options.enable ? true


	# initial action ------------------

	# set the initial action's trigger
	@define "trigger",
		get: -> return @_initialAction.trigger ? undefined
		set: (trigger) ->
			throw "ActionLayer: trigger must set with a Framer Event name formatted as a string, like 'Tap' or 'SwipeDown'." if typeof trigger isnt "string"
			
			# remove initial action
			@removeAction(@_initialAction)

			# change trigger
			@_initialAction.trigger = trigger

			if @_enabled is true then @_setAction(@_initialAction)

	# define the initial action's action
	@define "action",
		get: -> return @_initialAction.action ? undefined
		set: (action) ->
			throw "ActionLayer: trigger must set with a function, like '-> print 'Hello world'." if typeof action isnt "function"
			
			# remove initial action
			@removeAction(@_initialAction)

			# change trigger
			@_initialAction.action = action

			if @_enabled is true then @_setAction(@_initialAction)

	# enable
	@define "initial",
		get: -> return @_initial
		set: (bool) -> 
			return if bool is @_initial
			@_inital = bool
			switch bool
				when true then @_setAction(@_initialAction)
				when false then @_unsetAction(@_initialAction)

	# enable
	@define "enable",
		get: -> return @_enabled
		set: (bool) -> 
			return if bool is @_enabled
			@_enabled = bool
			@ignoreEvents = !bool


	# toggle --------------------------

	# is on
	@define "isOn",
		get: -> return @_toggled
		set: -> return 'ActionLayer.isOn is read only.'	

	# toggleOff
	@define "toggleOff",
		get: -> return @_toggleOff
		set: (actionObject) ->
			@_unsetAction(@_toggleOff)
			@_offTrigger = actionObject.trigger ? @_offTrigger
			@_offAction  = actionObject.action  ? @_offAction
			@_toggleOff = {name: 'toggleOff', trigger: @_offTrigger, action: ->
				@toggled = false
				}

			if @_toggle is true then @_setAction(@_toggleOff)

	# toggleOn
	@define "toggleOn",
		get: -> return @_toggleOn
		set: (actionObject) ->
			@_unsetAction(@_toggleOn)
			@_onTrigger = actionObject.trigger ? @_onTrigger
			@_onAction  = actionObject.action  ? @_onAction
			@_toggleOn = {name: 'toggleOn', trigger: @_onTrigger, action: ->
				@toggled = true
				}

			if @_toggle is true then @_setAction(@_toggleOn)

	# toggle
	@define "toggle",
		get: -> return @_toggle
		set: (bool) ->
			return if bool is @_toggle
			@_toggle = bool

			switch @_toggle
				when true
					@_setAction(@_toggleOn)
					@_setAction(@_toggleOff)
				when false
					@_unsetAction(@_toggleOn)
					@_unsetAction(@_toggleOff)

	# toggled
	@define "toggled",
		get: -> return @_toggled
		set: (bool) ->
			# cancel if toggling to current toggle state
			switch bool
				when true 
					return if @_toggled is true 
					Utils.delay .05, => 
						@_toggled = true
						_.bind(@_onAction, @)()
						@emit("change:toggled", true)
				when false
					return if @_toggled is false 
					Utils.delay .05, => 
						@_toggled = false
						_.bind(@_offAction, @)()
						@emit("change:toggled", false)


	# additional actions --------------

	# get all additional actions
	@define "actions",
		get: -> return _actions
		set: -> throw 'ActionLayer.actions is read-only. Use .addActions() and .removeActions() to add or remove existing actions.'

	# add an additional action
	addAction: (options = {}) ->
		trigger = options.trigger
		action = options.action
		name = options.name
		enable = options.enable ? true

		if !trigger? or typeof trigger isnt "string" then throw "ActionLayer.addAction requires a Framer Event name formatted as a string, such as 'Tap' or 'SwipeEnd'."
		if !action? or typeof action isnt "function" then throw "ActionLayer.addAction requires a function, such as -> print @name."

		# create an object using the provided arguments
		_action = {trigger: trigger, name: name, action: action}

		# stop if this exact action is already on the list of actions
		return if _.includes(@_actions, _action)

		# otherwise... 

		@_actions.push(_action)		# add the action to the array of actions
		
		if enable?					# and, unless enable is set to false...
			@_setAction(_action)	# enable the action

		return _action

	# add multiple actions
	addActions: (actions) ->
		actions.forEach (action) => @addAction(action)
		return actions

	# get actions that have been added
	getActions: (options = {}) ->
		_actions = @_getActions(options)
		return _actions

	# get an individual action
	getAction: (options = {}) ->
		_actions = @_getActions(options)
		return _actions[0]

	# remove actions that have been added
	removeActions: (actions) ->
		# ensure that actions is an array, even if only an object is provided 
		actions = _.castArray(actions)

		# don't continue if there are no actions with that trigger
		return if actions.length is 0

		# for each of these actions, remove the event listener and pull from _actions
		actions.forEach (action) => @removeAction(action)

	# remove an individual action
	removeAction: (action) ->
		@_unsetAction(action)
		_.pull(action, _actions)

	# enable actions that have been added
	enableActions: (actions) ->
		# ensure that actions is an array, even if only an object is provided 
		actions = _.castArray(actions)

		# don't continue if there are no actions with that trigger
		return if actions.length is 0

		# for each of these actions, add the event listener
		actions.forEach (action) => @enableAction(action)

	# enable an individual action
	enableAction: (action) ->
		@_setAction(action)

	# disable actions that have been added / enabled
	disableActions: (actions) ->
		# ensure that actions is an array, even if only an object is provided 
		actions = _.castArray(actions)

		# don't continue if there are no actions with that trigger
		return if actions.length is 0

		# for each of these actions, remove the event listener
		actions.forEach (action) => @disableAction(action)

	# disable an individal action
	disableAction: (action) ->
		@_unsetAction(action)


	# private functions ---------------

	# returns all actions given name or trigger
	_getActions: (actionObject) ->
		trigger = actionObject.trigger
		name = actionObject.name

		if trigger? and typeof trigger isnt "string" then throw "ActionLayer.addAction requires a trigger a string, such as 'Tap' or 'SwipeEnd'."
		if name? and typeof name isnt "string" then throw "ActionLayer.addAction requires a name as a string, such as 'greet' or 'blink'."

		# get all actions to remove
		_actions = 
			# if action provided, get the stored action that has both the trigger and action
			if trigger? and name? then _.filter(@_actions, {'trigger': trigger, 'name': name})
			else if name? then _.filter(@_actions, {'name': name})
			else if trigger? then _.filter(@_actions, {'trigger': trigger})
			else throw "ActionLayer.removeAction requires either the action's trigger or its name."

		return _actions

	# enables an action (adds the listener)
	_setAction: (actionObject) ->
		trigger = actionObject.trigger
		action = actionObject.action
		@on Events[trigger], action

	# disables an action (removes the listener)
	_unsetAction: (actionObject) ->
		trigger = actionObject.trigger
		action = actionObject.action
		@off Events[trigger], action

exports.ActionLayer = ActionLayer
exports.Action = Action








