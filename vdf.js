// a simple parser for Valve's KeyValue format
// https://developer.valvesoftware.com/wiki/KeyValues
//
// author: Rossen Popov, 2014
//
// use at your own risk

var VDF = {
    parse: function(text) {
        if(typeof text != "string") {
            throw new TypeError("VDF.parse: Expecting parametar to be a string");
        }

        lines = text.split("\n");

        var obj = {};
        var stack = [obj];
        var expect_bracket = false;
        var name = "";

        var re_keyvalue = new RegExp('^"((?:\\\\.|[^"\\\\])*)"[ \t]+"((?:\\\\.|[^"\\\\])*)(")?','m');
        var re_key = new RegExp('^"((?:\\\\.|[^\\\\"])*)"')

        var i = 0, j = lines.length;
        for(; i < j; i++) {
            line = lines[i].trim();

            // skip empty and comment lines
            if( line == "" || line[0] == '/') { continue; }

            // one level deeper
            if( line[0] == "{" ) {
                expect_bracket = false;
                continue;
            }

            if(expect_bracket) {
                throw new SyntaxError("VDF.parse: invalid syntax");
            }

            // one level back
            if( line[0] == "}" ) {
                stack.pop();
                continue;
            }

            // parse keyvalue pairs
            if( line[0] == '"' ) {
                // nessesary for multiline values
                while(true) {
                    m = re_keyvalue.exec(line);

                    // we've matched a simple keyvalue pair, map it to the last dict obj in the stack
                    if(m) {
                        // if don't match a closing quote for value, we consome one more line, until we find it
                        if(typeof m[3] == "undefined") {
                            line += "\n" + lines[++i];
                            continue;
                        }

                        stack[stack.length-1][m[1]] = m[2];
                    }
                    // we have a key with value in parenthesis, so we make a new dict obj (one level deep)
                    else {
                        m = re_key.exec(line);

                        if(!m) throw new SyntaxError("VDF.parse: invalid syntax");

                        key = m[1]

                        stack[stack.length-1][key] = {};
                        stack.push(stack[stack.length-1][key]);
                        expect_bracket = true;
                   }
                   break;
               }
            }
        }

        if(stack.length != 1) throw new SyntaxError("VDF.parse: open parentheses somewhere");

        return obj;
    },

    stringify: function(obj,pretty) {
        if( typeof obj != "object") {
                throw new TypeError("VDF.stringify: First input parameter is not an object");
        }

        pretty = ( typeof pretty == "boolean" && pretty) ? true : false;

        return this._dump(obj,pretty,0);
    },

    _dump: function(obj,pretty,level) {
        if( typeof obj != "object" ) {
            throw new TypeError("VDF.stringify: a key has value of type other than string or object");
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
