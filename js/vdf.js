// a simple parser for Valve's KeyValue format
// https://developer.valvesoftware.com/wiki/KeyValues
//
// author: Rossen Popov, 2014
//
// use at your own risk

var VDF = {
    parse: function(text) {
        if(typeof text != "string") {
            throw new Error("Expecting parametar to be a string");
        }

        lines = text.split("\n");

        var obj = {};
        var stack = [obj];
        var skipnext = false;
        var name = "";

        var re_keyvalue = new RegExp('^"((\\.|[^\"])*)"[ \t]+"((\\.|[^\"])*)');

        var i = 0, j = lines.length;
        for(; i < j; i++) {
            line = lines[i].trim();

            // skip empty and comment lines
            if( line == "" || line[0] == '/') { continue; }

            // one level deeper
            if( line[0] == "{" && skipnext ) {
                skipnext = false;
                continue;
            }

            // one level back
            if( line[0] == "}" ) {
                stack.pop();
                continue;
            }

            // parse keyvalue pairs
            if( line[0] == '"' ) {
                m = re_keyvalue.exec(line);

                // we've matched a simple keyvalue pair, map it to the last dict obj in the stack
                if(m) {
                    stack[stack.length-1][m[1]] = m[3];
                }
                // we have a key with value in parenthesis, so we make a new dict obj (one level deep)
                else {
                    key = line.slice(1,line.length-1);

                    stack[stack.length-1][key] = {};
                    stack.push(stack[stack.length-1][key]);
                    skipnext = true;
               }
            }
        }

        return obj;
    },

    stringify: function(obj,pretty) {
        if( typeof obj != "object") {
                throw new Error("First input parameter is not an object");
        }

        pretty = ( typeof pretty == "boolean" && pretty) ? true : false;

        return this._dump(obj,pretty,0);
    },

    _dump: function(obj,pretty,level) {
        if( typeof obj != "object" ) {
            throw new Error("Expected parametar to an object");
        }

        var indent = "\t";
        var buf = "";
        var line_indent = "";


        if(pretty) {
            for(var i = 0; i < level; i++ ) {
                line_indent += indent;
            }
        }

        for(key in obj) {
            if( typeof obj[key] == "object" ) {
                buf += [line_indent, '"', key, '"\n', line_indent, '{\n', this._dump(obj[key],pretty,level+1), line_indent, "}\n"].join('');
            }
            else {
                buf += [line_indent, '"', key, '" "', String(obj[key]), '"\n'].join('');
            }
        }

        return buf;
    }
}
