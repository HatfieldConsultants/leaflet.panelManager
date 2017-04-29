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

        getVersion: function () {
            var self = this;
            //console.log(self.version);
        },

        addTo: function (map) {
            var self = this;
            map.PanelManager = PanelManager;
            this.map = map;
            map.PanelManager.list = [];
            map.on('resize', function () {
                self.list.forEach(function (panel) {
                    // if (panel.responsiveRules) {
                    //     var responsivePos = panel.responsiveRules(map).position;
                    //     L.DomUtil.removeClass(panel, 'panelmanager-' + panel.originalPosition);
                    //     L.DomUtil.removeClass(panel, 'panelmanager-min-' + panel.originalPosition);
                    //     L.DomUtil.removeClass(panel, 'panelmanager-max-' + panel.originalPosition);
                    //     L.DomUtil.addClass(panel, 'panelmanager-' + responsivePos);
                    //     //console.log(panel);
                    //     self.flexRender(responsivePos);
                    //
                    // }
                });
            });
        },

        newPanel: function (options) {
            /* options ----
                - title
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

            panel.addTo = function (map) {
                map.PanelManager.list.push(panel);
                var controlContainer = map._controlContainer;
                controlContainer.insertBefore(panel, controlContainer.firstChild);
                panel.visible = true;
                panel.originalPosition = options.position;


                var panelContent = L.DomUtil.create('div', 'panelmanager-panel-content');
                panel.panelContent = panelContent;
                panel.appendChild(panelContent);

                if (options.responsiveRules) {
                    panel.responsiveRules = options.responsiveRules;
                }

                if (options.toggleHide) {

                    var titleDiv = L.DomUtil.create('div', 'panelmanager-panel-titlediv');

                    panel.appendChild(titleDiv);
                    var title = L.DomUtil.create('h2', 'panelmanager-panel-title');
                    titleDiv.insertBefore(title, titleDiv.firstChild);
                    panel.title = title;
                    panel.titleDiv = titleDiv;

                    if (options.title) {
                        title.innerHTML = options.title;
                    }

                    var close = L.DomUtil.create('a', 'close');
                    panel.insertBefore(close, panel.firstChild);

                    L.DomUtil.addClass(close, "panelmanager-close-" + options.position);
                    close.innerHTML = '&times;';

                    panel.togglePanel = function (e) {
                        if (panel.visible) {
                            L.DomUtil.removeClass(panel, "panelmanager-max-" + options.position);
                            L.DomUtil.addClass(panel, "panelmanager-min-" + options.position);
                            close.innerHTML = '+'; // temporary
                            L.DomUtil.addClass(panel.titleDiv, "invisible");
                            L.DomUtil.addClass(panel.panelContent, "invisible");
                        } else {
                            L.DomUtil.removeClass(panel, "panelmanager-min-" + options.position);
                            L.DomUtil.addClass(panel, "panelmanager-max-" + options.position);
                            close.innerHTML = '&times;'; // temporary
                            L.DomUtil.removeClass(panel.titleDiv, "invisible");
                            L.DomUtil.removeClass(panel.panelContent, "invisible");
                        }
                        panel.visible = !panel.visible;
                    };
                    panel.hidePanel = function (e) {
                        L.DomUtil.removeClass(panel, "panelmanager-max-" + options.position);
                        L.DomUtil.addClass(panel, "panelmanager-invisible-" + options.position);
                        panel.visible = false;

                        L.DomUtil.addClass(panel.titleDiv, "invisible");
                        L.DomUtil.addClass(panel.panelContent, "invisible");
                        L.DomUtil.removeClass(panel.button, "invisible");

                    };
                    panel.showPanel = function (e) {
                        L.DomUtil.removeClass(panel, "panelmanager-invisible-" + options.position);
                        L.DomUtil.addClass(panel, "panelmanager-max-" + options.position);
                        panel.visible = true;

                        L.DomUtil.removeClass(panel.titleDiv, "invisible");
                        L.DomUtil.removeClass(panel.panelContent, "invisible");
                        L.DomUtil.addClass(panel.button, "invisible");
                    };

                    if (options.toggleHide == "button") {
                        if (!options.initiallyVisible) {
                            panel.visible = false;
                            L.DomUtil.addClass(panel, "panelmanager-invisible-" + options.position);
                        } else {
                            panel.visible = true;
                            L.DomUtil.addClass(panel, "panelmanager-visible-" + options.position);
                        }

                        var customControl = L.Control.extend({
                            options: {
                                position: 'topleft'
                                //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
                            },

                            onAdd: function (map) {
                                //add a button to show panel
                                panel.button = L.DomUtil.create('div', 'leaflet-bar panelmanager-button');
                                panel.button.style.backgroundColor = 'white';
                                panel.button.innerHTML = options.title;

                                L.DomEvent.on(panel.button, 'click',
                                    panel.showPanel, self);

                                L.DomEvent.on(close, 'click',
                                    panel.hidePanel, self);

                                // optional callback that can be triggered when opening a panel with button-toggle
                                if (options.toggleOnCallback) {
                                    L.DomEvent.on(panel.button, 'click',
                                        options.toggleOnCallback, self);
                                }
                                if (options.toggleOffCallback) {
                                    L.DomEvent.on(close, 'click',
                                        options.toggleOffCallback, self);
                                }

                                return panel.button;
                            },
                        });
                        map.addControl(new customControl());

                    } else {
                        if (!options.initiallyVisible) {
                            panel.visible = false;
                            L.DomUtil.addClass(panel, "panelmanager-min-" + options.position);
                            close.innerHTML = '+'; // temporary
                            L.DomUtil.addClass(panel.titleDiv, "invisible");
                            L.DomUtil.addClass(panel.panelContent, "invisible");
                        } else {
                            panel.visible = true;
                            L.DomUtil.addClass(panel, "panelmanager-max-" + options.position);
                        }

                        L.DomEvent.on(close, 'click',
                            panel.togglePanel, self);
                    }

                }
                self.flexRender(options.position);
            };

            return panel;
        },

        flexRender: function (position) {
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

            self.list.forEach(function (panel) {
                if (L.DomUtil.hasClass(panel, 'panelmanager-' + position)) {
                    panels.push(panel);
                }
            });
            panels.forEach(function (panel, index) {
                if (position == "top" || position == "bottom") {
                    panel.style.width = (defaultDimension / panels.length) + "%";
                    panel.style.left = ((parseFloat(panel.style.width) * index) + (50 - defaultDimension / 2)) + "%";
                } else if (position == "left" || position == "right") {
                    panel.style.height = (defaultDimension / panels.length) + "%";
                    panel.style.top = ((parseFloat(panel.style.height) * index) + (50 - defaultDimension / 2)) + "%";
                }
            });
        },

        loadPlugin: function (plugin) {
            var self = this;
            var spec = plugin.GUI.loadPanels();

            spec.panels.forEach(function (specPanel) {
                var panel = self.newPanel({
                    position: specPanel.position,
                    toggleHide: specPanel.toggleHide,
                    toggleOnCallback: specPanel.toggleOnCallback,
                    toggleOffCallback: specPanel.toggleOffCallback,
                    title: specPanel.title,
                    silentToggleOnEvent: specPanel.silentToggleOnEvent,
                    silentToggleOffEvent: specPanel.silentToggleOffEvent,
                    initiallyVisible: specPanel.initiallyVisible,
                    responsiveRules: specPanel.responsiveRules,
                });
                panel.addTo(map);

                // listeners for opening and closing the panel (silently)
                if (specPanel.toggleHide) {

                    if (specPanel.toggleHide == "button") {
                        window.addEventListener('show-' + specPanel.panelName, function (e) {
                            panel.showPanel();
                        }, false);

                        window.addEventListener('hide-' + specPanel.panelName, function (e) {
                            panel.hidePanel();
                        }, false);
                    } else {
                        window.addEventListener('show-' + specPanel.panelName, function (e) {
                            // TODO: check if panel is already visible
                            panel.togglePanel();
                        }, false);

                        window.addEventListener('hide-' + specPanel.panelName, function (e) {
                            // TODO: check if panel is already hidden
                            panel.togglePanel();
                        }, false);

                    }

                }


                if (specPanel.type == "button-list") {
                    specPanel.buttons.forEach(function (specButton) {
                        var button = L.DomUtil.create('button', 'panelmanager-panel-button ' + specButton.icon);
                        button.style.backgroundSize = "100% 100%";
                        if (specButton.callback) {
                            L.DomEvent.on(button, 'click',
                                specButton.callback, self);
                        }
                        panel.panelContent.appendChild(button);
                    });
                } else if (specPanel.type == "document-list") {
                    var documentList = L.DomUtil.create('ul', 'panelmanager-panel-document-list');
                    panel.panelContent.insertBefore(documentList, panel.panelContent.firstChild);
                    if (specPanel.eventName) {
                        window.addEventListener('comment-list-refresh', function (e) {
                            self.loadDocumentList(specPanel, documentList);
                        }, false);
                    }
                    self.loadDocumentList(specPanel, documentList);

                    specPanel.documentActions.forEach(function (documentAction) {
                        // listeners for button state (active/inactive)
                        window.addEventListener('enable-' + documentAction.name, function (e) {
                            var comment = e.detail;
                            actionButton = document.getElementById('edit-' + comment.id);
                            L.DomUtil.removeClass(actionButton, 'panelmanager-document-property-button-disabled');
                            actionButton.disabled = false;
                            //console.log('enabling ' + documentAction.name + ' for ' + comment.name);
                        }, false);

                        window.addEventListener('disable-' + documentAction.name, function (e) {
                            var comment = e.detail;
                            actionButton = document.getElementById('edit-' + comment.id);
                            L.DomUtil.addClass(actionButton, 'panelmanager-document-property-button-disabled');
                            actionButton.disabled = true;
                            //console.log('disabling ' + documentAction.name + ' for ' + comment.name);
                        }, false);
                    });
                }


            });
        },

        loadDocumentList: function (specPanel, documentList) {
            while (documentList.hasChildNodes()) {
                documentList.removeChild(documentList.lastChild);
            }

            if (specPanel.documentSource) {

                specPanel.documentSource.forEach(function (panelDocument) {
                    var self = this;
                    var documentItem = L.DomUtil.create('li', 'panelmanager-panel-document-li');
                    var documentItemPropertyList = L.DomUtil.create('ul', 'panelmanager-document-property-ul');
                    documentItem.appendChild(documentItemPropertyList);
                    itemName = L.DomUtil.create('li', 'panelmanager-document-name panelmanager-document-property-li');
                    itemName.innerHTML = panelDocument.name;
                    documentItemPropertyList.appendChild(itemName);
                    specPanel.documentActions.forEach(function (documentAction) {
                        actionLi = L.DomUtil.create('li', 'panelmanager-document-action panelmanager-document-property-li');
                        actionButton = L.DomUtil.create('button', 'panelmanager-document-action panelmanager-document-property-button ' + documentAction.name);
                        documentItemPropertyList.appendChild(actionLi);
                        actionButton.innerHTML = documentAction.displayName;
                        actionButton.id = documentAction.name + "-" + panelDocument.id;
                        actionButton.onclick = function () {
                            documentAction.action(panelDocument);
                        };

                        actionLi.appendChild(actionButton);
                    });

                    documentList.appendChild(documentItem);
                });
            }

        }
    };
    // return your plugin when you are done
    return PanelManager;
}, window));
