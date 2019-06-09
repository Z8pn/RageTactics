const absolute_path = "package://RageTactics/cef/views/";
class CEFBrowser {
    constructor(url) {
        this._setup(url);
    }
    _setup(url) {
        let self = this;
        self.browser = mp.browsers.new(absolute_path + url);
        self.cursorState = false;
       // console.log("new instance");

    }
    call() {
        let args = Array.prototype.slice.call(arguments);
        let full = args[0];
        let callArgs = "(";
        for (let i = 1; i < args.length; i++) {
            switch (typeof args[i]) {
                case 'string':
                    {  
                        callArgs += "\'" + args[i] + "\'";
                        break;
                    }
                case 'number':
                case 'boolean':
                    {
                        callArgs += args[i];
                        break;
                    }
                case 'object':
                    {
                        callArgs += JSON.stringify(args[i]);
                        break;
                    }
            }
            if (i < (args.length - 1)) {
                callArgs += ",";
            }
        }
        callArgs += ");";
        full += callArgs;
        this.browser.execute(full);
    }
    active(toggle) {
        this.browser.active = toggle;
    }
    get isActive() {
        return this.browser.active;
    }
    cursor(state) {
        this.cursorState = state;
        mp.gui.cursor.visible = state;
    }
    clear() {
        this.load("empty.html")
    }
    load(path) {
        let self = this;
        self.browser.url = absolute_path + path;
    }
}
module.exports = {
    interface:new CEFBrowser("empty.html"),
    storage:new CEFBrowser("empty.html"),
    hud:new CEFBrowser("empty.html"),
    notification:new CEFBrowser("notifications/index.html"),
    class:CEFBrowser
};