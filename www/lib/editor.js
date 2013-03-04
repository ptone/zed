define(function(require, exports, module) {
    require("ace/ace");
    /*
    require(["ace/keybinding-vim", "ace/keybinding-emacs"], function() {
        editor.ace.setKeyboardHandler("ace/keyboard/vim");
    });
    */

    var eventbus = require("eventbus");
    
    var editors = [];
    var activeEditor = null;

    var editor = module.exports = {
        buffers: {},
        extMapping: {
            "abap": "ace/mode/abap",
            "asciidoc": "ace/mode/asciidoc",
            "cpp": "ace/mode/c_cpp",
            "clj": "ace/mode/clojure",
            "coffee": "ace/mode/coffee",
            "cf": "ace/mode/coldfusion",
            "cs": "ace/mode/csharp",
            "css": "ace/mode/css",
            "curly": "ace/mode/curly",
            "dart": "ace/mode/dart",
            "diff": "ace/mode/diff",
            "dot": "ace/mode/dot",
            "golang": "ace/mode/golang",
            "groovy": "ace/mode/groovy",
            "haml": "ace/mode/haml",
            "haxe": "ace/mode/haxe",
            "html": "ace/mode/html",
            "jade": "ace/mode/jade",
            "java": "ace/mode/java",
            "js": "ace/mode/javascript",
            "json": "ace/mode/json",
            "jsp": "ace/mode/jsp",
            "jsx": "ace/mode/jsx",
            "ltx": "ace/mode/latex",
            "less": "ace/mode/less",
            "liquid": "ace/mode/liquid",
            "lisp": "ace/mode/lisp",
            "lua": "ace/mode/lua",
            "lucene": "ace/mode/lucene",
            "Makefile": "ace/mode/makefile",
            "md": "ace/mode/markdown",
            "m": "ace/mode/objectivec",
            "ocaml": "ace/mode/ocaml",
            "pl": "ace/mode/perl",
            "psql": "ace/mode/pgsql",
            "php": "ace/mode/php",
            "php": "ace/mode/php",
            "py": "ace/mode/python",
            "r": "ace/mode/r",
            "rdoc": "ace/mode/rdoc",
            "rhtml": "ace/mode/rhtml",
            "ruby": "ace/mode/ruby",
            "scad": "ace/mode/scad",
            "scala": "ace/mode/scala",
            "scheme": "ace/mode/scheme",
            "scss": "ace/mode/scss",
            "sh": "ace/mode/sh",
            "sql": "ace/mode/sql",
            "stylus": "ace/mode/stylus",
            "svg": "ace/mode/svg",
            "tcl": "ace/mode/tcl",
            "tex": "ace/mode/tex",
            "text": "ace/mode/text",
            "textile": "ace/mode/textile",
            "tm_snippet": "ace/mode/tm_snippet",
            "typescript": "ace/mode/typescript",
            "vbscript": "ace/mode/vbscript",
            "xml": "ace/mode/xml",
            "xquery": "ace/mode/xquery",
            "yaml": "ace/mode/yaml"
        },
        createSession: function(path, content) {
            var parts = path.split(".");
            var ext = parts[parts.length - 1];
            var mode = "text";
            if(editor.extMapping[ext]) {
                mode = editor.extMapping[ext];
            }
            var session = ace.createEditSession(content);
            session.setMode(mode);
            session.filename = path;
            return session;
        },
        switchSession: function(session, edit) {
            edit = edit || editor.getActiveEdtor();
            edit.setSession(session);
            eventbus.emit("switchsession", edit, session);
        },
        setMode: function(ext, modeModule) {
            editor.extMapping[ext] = modeModule;
        },
        getActiveEditor: function() {
            return activeEditor;
        },
        setActiveEditor: function(editor) {
            activeEditor = editor;
            activeEditor.focus();
        },
        getEditors: function() {
            return editors;
        },
        getActiveSession: function() {
            return editor.getActiveEditor().getSession();
        },
        getSessionState: function(session) {
            return {
                scrollTop: session.getScrollTop(),
                scrollLeft: session.getScrollLeft(),
                selection: session.getSelection().getRange(),
                lastUse: session.lastUse
            };
        },
        setSessionState : function(session, state) {
            session.getSelection().setSelectionRange(state.selection, false);
            session.setScrollTop(state.scrollTop);
            session.setScrollLeft(state.scrollLeft);
            session.lastUse = state.lastUse;
        },
    };
    
    init();

    function init() {
        $("body").append("<div id='editor0'>");
        $("body").append("<div id='editor1'>");
        $("body").append("<div id='editor2'>");
        editors.push(ace.edit("editor0"));
        editors.push(ace.edit("editor1"));
        editors.push(ace.edit("editor2"));
        
        var keyboardHandler = editors[0].getKeyboardHandler();
        editors.forEach(function(editor) {
            editor.setHighlightActiveLine(false);
            editor.setKeyboardHandler(keyboardHandler);
            editor.on("focus", function() {
                activeEditor = editor;
                editor.setHighlightActiveLine(true);
            });
            editor.on("blur", function() {
                activeEditor = editor;
                editor.setHighlightActiveLine(false);
            });
        });
        
        eventbus.emit("editorloaded");
        editor.setActiveEditor(editors[0]);
    }
});