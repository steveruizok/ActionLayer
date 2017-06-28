{ActionLayer} = require 'ActionLayer'
{ActionTextLayer} = require 'ActionLayer'

# page component / pages

pager = new PageComponent
	size: Screen.size
	scrollVertical: false

pages = []

for i in [0...3]
	pages[i] = new Layer
		size: Screen.size
		backgroundColor: '#efefef'

	pager.addPage(pages[i])

# page 1

for i in [0...15]
	tile = new ActionLayer
		parent: pages[0]
		height: 100
		width: 100
		x: Align.center(-120 + 120 * (i % 3))
		y: 20 + (120 * _.floor(i / 3))
		image: Utils.randomImage()
		borderRadius: 8, borderWidth: 1
		toggle: true
		toggleOn:
			trigger: 'Tap'
			action: ->
				@defaultFrame = @frame
				@bringToFront()
				@animate
					frame: Screen.frame
					options:
						time: .25
		toggleOff:
			trigger: 'Tap'
			action: -> 
				@animate
					frame: @defaultFrame
					options:
						time: .25

next = new ActionTextLayer
	text: 'next', parent: pages[0]
	x: Align.right(-16), y: Align.bottom(-16)
	fontSize: 18, fontFamily: 'Arial', textAlign: 'center', color: '#333'
	action: -> pager.snapToNextPage('right')

# page 2

for i in [0...15]
	tile = new ActionLayer
		parent: pages[1]
		height: 100
		width: 100
		x: Align.center(-120 + 120 * (i % 3))
		y: 20 + (120 * _.floor(i / 3))
		backgroundColor: 'rgba(158, 198, 209, 1)'
		toggle: true
		initial: false
		toggleOn:
			trigger: 'Tap'
			action: ->
				@backgroundColor = 'rgba(3, 123, 179, 1)'
				# toggle off all siblings when this toggles on
				@siblings.forEach (sib) -> sib.toggled = false
		toggleOff:
			trigger: 'Tap'
			action: -> 
				@backgroundColor = 'rgba(158, 198, 209, 1)'
		
	if i is 8 then tile.toggled = true

	
prev = new ActionTextLayer
	text: 'prev', parent: pages[1]
	x: 16, y: Align.bottom(-16)
	fontSize: 18, fontFamily: 'Arial', textAlign: 'center', color: '#333'
	action: -> pager.snapToNextPage('left')
	
next = new ActionTextLayer
	text: 'next', parent: pages[1]
	x: Align.right(-16), y: Align.bottom(-16)
	fontSize: 18, fontFamily: 'Arial', textAlign: 'center', color: '#333'
	action: -> pager.snapToNextPage('right')

# page 3

fruits = []

for fruit, i in ['orange', 'apple', 'pear', 'banana', 'grape', 'apricot', 'lime', 'lemon', 'cherry', 'plum', 'peach', 'mango']
	tile = new ActionTextLayer
		parent: pages[2]
		x: Align.center(-120 + 120 * (i % 3))
		y: 20 + (120 * _.floor(i / 3))
		toggle: true
		initial: false
		text: fruit
		fontSize: 18, fontFamily: 'Arial', textAlign: 'center', color: '#333'
		toggleOn:
			trigger: 'Tap'
			action: ->
				fruits.push(@)
				label.update()
				@color = 'rgba(0, 179, 231, 1)'
		toggleOff:
			trigger: 'Tap'
			action: -> 
				_.pull(fruits, @)
				label.update()
				@color = '#333'
	
	if i is 8 then tile.toggled = true

label = new TextLayer
	parent: pages[2]
	x: pages[2].children[0].x, y: tile.maxY + 64
	width: Screen.width - 64
	fontSize: 18, fontFamily: 'Arial', color: '#333'

label.update = ->
	@text = 'My favorite fruits are: '
	@text += fruit.text + ' ' for fruit in fruits
	if fruits.length is 0 then @text = "I'm more of a vegetable person."
	
prev = new ActionTextLayer
	text: 'prev', parent: pages[1]
	x: 16, y: Align.bottom(-16)
	fontSize: 18, fontFamily: 'Arial', textAlign: 'center', color: '#333'
	action: -> pager.snapToNextPage('left')
