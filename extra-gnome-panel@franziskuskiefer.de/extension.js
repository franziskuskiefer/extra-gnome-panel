// Extra Gnome Panel
// Copyright (C) 2013 Franziskus Kiefer

const Lang = imports.lang;
const Layout = imports.ui.layout;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Panel = imports.ui.panel;
const St = imports.gi.St;

let extraPanel, panels;

const ExtraPanels = new Lang.Class({
    Name: 'ExtraGnomePanel',

    _init : function() {
        this.monitors = Main.layoutManager.monitors;
        this.primaryIndex = Main.layoutManager.primaryIndex;
        this.panelBoxes = [];
        this.panels = [];
        Main.layoutManager.panelBoxes = this.panelBoxes;

        for (let i = 0; i < this.monitors.length; i++) {
            if (i == this.primaryIndex)
                continue;
            this.panelBoxes[i] = new St.BoxLayout({ name: 'panelBox'+(i+1), vertical: true });
            Main.layoutManager.addChrome(this.panelBoxes[i], { affectsStruts: true });
            this.panels[i] = new Panel.Panel();
            Main.layoutManager.panelBox.remove_actor(this.panels[i].actor);
            this.panelBoxes[i].add(this.panels[i].actor)
            this.panelBoxes[i].set_position(this.monitors[i].x, this.monitors[i].y);
            this.panelBoxes[i].set_width(this.monitors[i].width);

            // we don't want icons
            for (let j = 0; j < this.panels[i]._rightBox.get_children().length; j++) {
			    this.panels[i]._rightBox.get_children()[j].hide();
	    	}
            for (let j = 0; j < this.panels[i]._leftBox.get_children().length; j++) {
			    this.panels[i]._leftBox.get_children()[j].hide();
	    	}
            for (let j = 0; j < this.panels[i]._centerBox.get_children().length; j++) {
			    this.panels[i]._centerBox.get_children()[j].hide();
	    	}

            //this.updateCorners(i); // FIXME: causes error, needs fix
        }

        this.monSigId = Main.layoutManager.connect('monitors-changed', Lang.bind(this, this.updatePanels));
    },
    
    updatePanels : function(){
        this.destroy();
        this._init();

    },

//    updateCorners : function(monIndex){
//        let corner = new Layout.HotCorner(); // XXX: caus of error
//        Main.layoutManager._hotCorners.push(corner);
//        corner.actor.set_position(this.monitors[monIndex].x, this.monitors[monIndex].y);
//        Main.layoutManager._chrome.addActor(corner.actor);
//        this.panels[monIndex]._hotCorner = corner;
//    },

    destroy : function(){

        for (let i = 0; i < this.panels.length; i++) {
            if (i == this.primaryIndex)
                continue;

            this.panels[i].actor.destroy();
            this.panelBoxes = null;

            this.panels[i]._hotCorner.actor.destroy();
        }
        Main.layoutManager.disconnect(this.monSigId);
    }
});

function enable() {
    log("Loading Gnome Extra Panel Extension");
    extraPanel = new ExtraPanels();
}


function disable() {
    log("Disabling Gnome Extra Panel Extension");
    extraPanel.destroy();
}
