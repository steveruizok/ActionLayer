
# ActionLayer

An ActionLayer extends Layer, adding properties and functions designed to simplify managing events in Framer.

## Installation

Download the `ActionLayer.coffee` file and place it in your project's modules folder.

At the top of your project, include the line:

`{ActionLayer} = require 'ActionLayer'`

## Usage

An ActionLayer works with 'action objects'. These consist of four properties: a `trigger`, the Framer event that will cause the action to run; an `action`, the function that will execute when the trigger event occurs; a `name`, used to retrieve and modify individual actions; and `enable` , a boolean value that determines whether the action should be set or not. 

The trigger is a Framer Event property, formatted as a string, such as 'Tap', 'SwipeEnd' or 'TouchStart'. The action is a function, such as `-> print 'Hello'`. The name may be any string and is optional. The `enable` property is a boolean, and is `true` by default.

An ActionLayer has an **initial action** enabled by default, as well as options for two **toggle' actions**, and functions to add and manage as many **additional actions** as you may require.

### ActionLayer.enable

An ActionLayer may have all events enabled or disabled by using the `enable` property. This property turns on or off the layer's `ignoreEvents` property.

## Initial Action

An ActionLayer has an `initial` action that may be set with the `trigger` and `action` properties. This initial action may be enabled or disabled using the `initial` property.

```coffeescript
layerA = new ActionLayer
	trigger: 'Tap'
	action: -> print 'Hello World'

layerB = new ActionLayer
layerB.trigger = 'SwipeEnd'
layerB.action = -> print 'Swiped!'

layerC = new ActionLayer
	initial: false
```

By default, an ActionLayer has an initial action with a 'Tap' trigger and an action that causes it to quickly blink.

## Toggle Actions

An ActionLayer may also be set to have two actions which toggle one another, set using the `toggleOn` and `toggleOff` properties. The property `toggle` must be set to true before these actions will be run.

```coffeescript
layerD = new ActionLayer
	toggle: true
	toggleOn:
		trigger: 'Tap'
		action: -> print 'Toggled on.'
	toggleOff:
		trigger: 'Tap'
		action: -> print 'Toggled off.'
```

By default, an ActionLayer's `toggleOn` action will darken the layer, while its `toggleOff` action will restore the layer to its regular brightness. Both of these default actions will use the 'Tap' trigger.

If trigger properties are not provided for the `toggleOn` or `toggleOff` options, the ActionLayer's initial action trigger will be used instead. This will be 'Tap' unless set to another trigger using the `trigger` property.

```coffeescript
layerE = new ActionLayer
	trigger: 'SwipeEnd'
	toggle: true
	toggleOn:
		action: -> print 'Swiped on.'
	toggleOff:
		action: -> print 'Swiped off.'
```

### ActionLayer.isOn

An ActionLayer's toggle status may be accessed with the `isOn` property.

```coffeescript
layerE = new ActionLayer
	toggle: true
	toggleOn:
		action: -> print layerE.isOn # prints true
	toggleOff:
		action: -> print layerE.isOn # prints false
```

### ActionLayer.toggled

Finally, an ActionLayer's toggled status may be set programmaically, using the `toggled` property.

```coffeescript
layerE = new ActionLayer
	toggle: true
	toggleOn:
		action: -> print layerE.isOn # prints true
	toggleOff:
		action: -> print layerE.isOn # prints false

layerE.toggled = true
```

To prevent conflicts, a .05 second minimum delay exists between setting an ActionLayer's toggle. If rapid toggles are created programmaically, this must be overcome using a delay.

```coffeescript
layerE.toggled = true
Utils.delay .05, -> layerE.toggled = false
```

# Additional Actions


### ActionLayer.actions

In addition to its initial action and toggle actions, an ActionLayer may have any number of additional actions. These may be accessed using the `actions` property. By default, an ActionLayer has no additional actions, and this property will return an empty array.


### ActionLayer.addAction

Additional actions may be added to an ActionLayer using the `addAction` function. An ActionLayer may have as many actions as needed, including multiple actions that share the same trigger. When adding multiple acitons, it is recommended to give actions names so that they may be accessed and controlled later on.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'
```


### ActionLayer.addActions(actions)

Identical to `addActions`, except it accepts an array of action objects. Actions may be copied from one ActionLayer to the next using this function in combination with the `actions` property or the `getActions` function described below.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'

layerF.addAction
	trigger: 'TapEnd'
	action: -> print 'Tapped!'

layerE = new ActionLayer

layerE.addActions(layerF.actions)
```

Actions may be added but not immediately enabled, using the `enable` property. This property is `true` by default.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	name: 'swiped'
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'
	enable: false
```

### ActionLayer.getActions(options)

Actions that have been added to the ActionLayer may be retrieved using the `getActions` function. Actions will be returned in the form of an array. 

The actions that this function returns will depend on which properties are provided in the function's arguments. If only the `trigger` is provided, all actions with that trigger will be returned. If a `name` is provided, all actions with that name will be returned. If both a name and a trigger are provided, all actions with both that name and that trigger will be returned.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	name: 'swiped'
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'

layerF.addAction
	name: 'really swiped'
	trigger: 'SwipeEnd'
	action: -> print 'Really swiped!'

swiped = layerF.getActions
	name: 'swiped' # returns action named 'swiped'

allSwiped = layerF.getActions
	trigger: 'SwipeEnd' # returns both actions
```

An alternative to `getActions` is to define an action as it is added.

```coffeescript
layerF = new ActionLayer

tapped = layerF.addAction
	trigger: 'TapEnd'
	action: -> print 'Tapped!'
```

### ActionLayer.getAction(action)

Identical to `getActions`, except it will return a single action as an object, rather than as an array. If multiple actions are found, only the first will be returned.


### ActionLayer.disableActions(actions)

Actions may be disabled using the `disableActions` function. The result is the same as setting `enable` to false when adding an action using `addActions`. Actions may be passed to `disableActions` either as an array (such as the array produced by `getActions`) or as a single action object.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'

tapped = layerF.addAction
	trigger: 'TapEnd'
	action: -> print 'Tapped!'

swiped = layerF.getActions
	trigger: 'SwipeEnd'

layerF.disableAction(tapped)

layerF.disableAction(swiped)
```

### ActionLayer.disableAction(action)

Identical to `disableActions`, except it accepts a single action object (such as that produced by `getAction`) rather than an array, (such as that produced by `getActions`).


### ActionLayer.enableActions(actions)

Actions that have been disabled may be enabled again using the `enableActions` function. Actions may be passed to `enableActions` either as an array (such as the array produced by `getActions`) or as a single action object.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'
	enable: false

tapped = layerF.addAction
	trigger: 'TapEnd'
	action: -> print 'Tapped!'
	enable: false

swiped = layerF.getActions
	trigger: 'SwipeEnd'

layerF.enableAction(tapped)

layerF.enableAction(swiped)
```

### ActionLayer.enableAction(action)

Identical to `enableActions`, except it accepts a single action object (such as that produced by `getAction`) rather than an array, (such as that produced by `getActions`).


### ActionLayer.removeActions(actions)

Additional actions may be removed using the `removeAction` or `removeActions` function. These actions will not only be unset, but removed entirely; they will not be able to be reset using `enableActions`, but would have to be added again. Actions may be passed to `removeActions` either as an array (such as the array produced by `getActions`) or as a single action object.

```coffeescript
layerF = new ActionLayer

layerF.addAction
	trigger: 'SwipeEnd'
	action: -> print 'Swiped!'
	enable: false

tapped = layerF.addAction
	trigger: 'TapEnd'
	action: -> print 'Tapped!'
	enable: false

swiped = layerF.getActions
	trigger: 'SwipeEnd'

layerF.removeAction(tapped)

layerF.removeAction(swiped)
```

### ActionLayer.removeAction(action)

Identical to `removeActions`, except it accepts a single action object (such as that produced by `getAction`) rather than an array, (such as that produced by `getActions`).


# Action

In cases where you may wish to create actions apart form ActionLayers, or without attaching immediately, you can use the class Action. As with actions added with `ActionLayer.addAction`, the default value of enabled will be `true`.

```coffeescript

{Action} 	  = require 'ActionLayer'
{ActionLayer} = require 'ActionLayer'

tapped = new Action
	name: 'tapped'
	trigger: 'Tap'
	action: -> print 'Tapped!'
	enable: true

layerH = new ActionLayer
	initial: false

layerH.addAction(tapped)
```

