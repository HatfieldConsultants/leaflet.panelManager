**Leaflet PanelManager**
----------------

*Create and manage panels stand-alone panels for Leaflet maps, or load panels to house Leaflet plugins*

**[Demo](https://nimaboscarino.github.io/leaflet.panelManager/)**

**Installation and Use**:

**Add PanelManager to the map**
 - Link `panelManager.css` in the head section
 - Link `panelManager.js` in the body section after instantiating a map
   in a "map" div
 - After `panelManager.js`, add PanelManager to the map:
 `var panelManager = L.PanelManager.addTo(map);`

**Create Panels**

E.g.

    L.PanelManager.addTo(map);
    map.PanelManager.newPanel({
      position: "bottom",
      toggleHide: true,
      title: "Hi there"
    }).addTo(map);

    map.PanelManager.newPanel({
      position: "right",
      toggleHide: "button",
      title: "I am another panel"
    }).addTo(map);

**Panel Options for constructing panels directly**
- position
- toggleHide
- title
- initiallyVisible
- toggleOnCallback
- toggleOffCallback
- silentToggleOnEvent
- silentToggleOffEvent
- responsiveRules (not yet implemented)

**Load a plugin (e.g. [Redliner](https://github.com/NimaBoscarino/leaflet.redliner))**
 - `var redliner = L.Redliner.addTo(map);`
 - `map.PanelManager.loadPlugin(map.Redliner);`
 - The plugin must have a "GUI" property, which exposes a "loadPanels" function


**Plugin Development Guide**

PluginManager can be used as a kind of front-end for Leaflet plugins which employ the interface. Plugins must have a GUI property with a "loadPanels" function, which must return an array of panel specifications objects. The array can contain as many panel specifications as desired. (See [Redliner](https://github.com/NimaBoscarino/leaflet.redliner) for an example of implementing both a button-list panel and a document-list panel.

A panel is specified as such:

    title - string (for display)
    panelName - string (an identifier)
	position - "top" | "bottom" | "right" | "left"
    toggleHide - "button" | "peek" | true | false | null
    	if "button":
        	toggleIcon: - path to an image
        	toggleOnCallback - function exectued when panel is shown
            toggleOffCallback - function executed when panel is hidden
    type - "button-list" | "document-list" | null
    	if "button-list":
        	buttons - array of button objects where a button is
            	name - string
                icon - class name (in your styles, you can style the button with this)
                callback - function which is executed when your button is clicked

  		if "document-list":
        	documentSource: the array of objects to display
            documentActions: array of actions associated with the documents (e.g. delete, share), shown as buttons.
            	Each action is
            	- name: string (identifier, you can make a class in your styles named after this to style the specific action button)
            	- displayName: string (what is displayed in the button)
            	- action: function (executed when the button is clicked)
    
