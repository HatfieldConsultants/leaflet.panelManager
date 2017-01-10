(function (factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.PanelManager = factory(L);
    }
}(function (L) {
    var PanelManager = {
        options: {
        },

        version: '0.1.0',

        getVersion: function() {
            var self = this;
            console.log(self.version);
        },

        addTo: function(map) {
            map.PanelManager = PanelManager;
            map.PanelManager.list = [];
        },

        newPanel: function(options) {
            /* options ----
                - position: top/bottom/left/right // for default desktop view
                - responsive: {
                    rules for repositioning with different window sizes
                    e.g. does it change on window resizing, or just on load
                    rules include new height/width/styling/flex/etc.
                }
                - height + width
                - other optional styling options {
                    margin
                    padding
                    colour etc.
                }

                - flexibility: { (this has default where all panels get equal space)
                    if a new panel is added that interferes with this panel
                    how does this panel respond?
                    e.g. does it resize height/width to fit together, or is it stubborn?
                }

                - initiallyVisible (default true)
                - toggleHide (optional) (default false)
            */
            var self = this;
            var panel = L.DomUtil.create('div', 'panelmanager-panel');
            L.DomUtil.addClass(panel, "panelmanager-" + options.position);
            L.DomUtil.addClass(panel, "panelmanager-visible-" + options.position);

            panel.visible = true;

            panel.addTo = function(map) {
                map.PanelManager.list.push(panel);
                var controlContainer = map._controlContainer;
                controlContainer.insertBefore(panel, controlContainer.firstChild);
                panel.visible = true;

                if (options.toggleHide) {
                    var close = L.DomUtil.create('a', 'close', panel);
                    L.DomUtil.addClass(close, "panelmanager-close-" + options.position);
                    close.innerHTML = '&times;';
    
                    var togglePanel = function(e){
                        if (panel.visible) {
                            L.DomUtil.removeClass(panel, "panelmanager-visible-" + options.position);
                            L.DomUtil.addClass(panel, "panelmanager-invisible-" + options.position);
                            close.innerHTML = '+'; // temporary
                        } else {
                            L.DomUtil.removeClass(panel, "panelmanager-invisible-" + options.position);
                            L.DomUtil.addClass(panel, "panelmanager-visible-" + options.position);
                            close.innerHTML = '&times;'; // temporary
                        }
                        panel.visible = !panel.visible;
                    };

                    L.DomEvent.on(close, 'click',
                        togglePanel, self);
                }
                self.flexRender(options.position);
            };

            return panel;
        },

        flexRender: function(position) {
            var self = this;
            panels = [];
            var offsetPosition;
            var defaultDimension;
            if (position == "top" || position == "bottom") {
                offsetPosition = "right";
                defaultDimension = 60;
            } else if (position == "left" || position == "right") {
                offsetPosition = "top";
                defaultDimension = 90;
            }

            self.list.forEach(function(panel) {
                if (L.DomUtil.hasClass(panel, 'panelmanager-' + position)) {
                    panels.push(panel);
                }
            });
            panels.forEach(function(panel, index) {
                if (position == "top" || position == "bottom") {
                    panel.style.width = (defaultDimension / panels.length) + "%";         
                    panel.style.left = ((parseFloat(panel.style.width) * index) + (50 - defaultDimension/2)) + "%";
                } else if (position == "left" || position == "right") {
                    panel.style.height = (defaultDimension / panels.length) + "%";
                    panel.style.top = ((parseFloat(panel.style.height) * index) + (50 - defaultDimension/2)) + "%";
                }
            });
        }
    };
    // return your plugin when you are done
    return PanelManager;
}, window));

