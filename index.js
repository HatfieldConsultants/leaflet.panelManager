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
            var panel = {};

            panel.addTo = function(map) {
                map.PanelManager.list.push(panel);
            }

            return panel;
        }
    };
    // return your plugin when you are done
    return PanelManager;
}, window));

