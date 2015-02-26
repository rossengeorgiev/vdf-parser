<?php
// a simple parser for Valve's KeyValue format
// https://developer.valvesoftware.com/wiki/KeyValues
//
// author: Rossen Popov, 2015
//
// use at your own risk

function vdf_decode($text) {
    if(!is_string($text)) {
        trigger_error("vdf_encode expects parameter 1 to be a string, " . gettype($arr) . " given.", E_USER_NOTICE);
        return NULL;
    }

    // remove that damn BOM
    $text = preg_replace('/^(\x{FEFF}|\x{FFFE}|\x{EEBB}\x{BF})/u', '', $text);

    $lines = preg_split('/\n/', $text);

    $arr = array();
    $stack = array(0=>&$arr);
    $expect_bracket = false;
    $name = "";

    $re_keyvalue = '~^"((?:\\\\.|[^"\\\\])*)"[ \t]*"((?:\\\\.|[^"\\\\])*)(")?~mu';
    $re_key = '~^"((?:\\\\.|[^\\\\"])*)"~u';

    $j = count($lines);
    for($i = 0; $i < $j; $i++) {
        $line = trim($lines[$i]);

        // skip empty and comment lines
        if( $line == "" || $line[0] == '/') { continue; }

        // one level deeper
        if( $line[0] == "{" ) {
            $expect_bracket = false;
            continue;
        }

        if($expect_bracket) {
            trigger_error("vdf_decode: invalid syntax, expected a '}'", E_USER_NOTICE);
            return NULL;
        }

        // one level back
        if( $line[0] == "}" ) {
            array_pop($stack);
            continue;
        }

        // parse keyvalue pairs
        if( $line[0] == '"' ) {
            // nessesary for multiline values
            while(true) {
                // we've matched a simple keyvalue pair, map it to the last dict obj in the stack
                if(preg_match($re_keyvalue, $line, $m)) {
                    // if don't match a closing quote for value, we consome one more line, until we find it
                    if(!isset($m[3])) {
                        $line .= "\n" . $lines[++$i];
                        continue;
                    }

                    $stack[count($stack)-1][$m[1]] = $m[2];
                }
                // we have a key with value in parenthesis, so we make a new dict obj (one level deep)
                else {
                    if(!preg_match($re_key, $line, $m)) {
                        trigger_error("vdf_decode: invalid syntax", E_USER_NOTICE);
                        return NULL;
                    }

                    $key = $m[1];

                    $stack[count($stack)-1][$key] = array();
                    $stack[count($stack)] = &$stack[count($stack)-1][$key];
                    $expect_bracket = true;
               }
               break;
           }
        }
    }

    if(count($stack) !== 1)  {
        trigger_error("vdf_decode: open parentheses somewhere", E_USER_NOTICE);
        return NULL;
    }

    return $arr;
}

function vdf_encode($arr, $pretty = false) {
    if(!is_array($arr)) {
        trigger_error("vdf_encode expects parameter 1 to be an array, " . gettype($arr) . " given.", E_USER_NOTICE);
        return NULL;
    }

    $pretty = (boolean) $pretty;

    return vdf_encode_step($arr, $pretty, 0);
}

function vdf_encode_step($arr, $pretty, $level) {
    if(!is_array($arr)) {
        trigger_error("vdf_encode encounted " . gettype($arr) . ", only array or string allowed (depth ".$level.")", E_USER_NOTICE);
        return NULL;
    }

    $indent = "\t";
    $buf = "";
    $line_indent = "";

    if($pretty) {
        for($i = 0; $i < $level; $i++ ) {
            $line_indent .= $indent;
        }
    }

    foreach($arr as $k => $v) {
        if(is_string($v)) {
            $buf .= sprintf('%s"%s" "%s"\n', $line_indent, $k, $v);
        }
        else {
            $res = vdf_encode_step($v, $pretty, $level + 1);
            if($res === NULL) return NULL;

            $buf .= sprintf('%s"%s"\n{\n%s}\n', $line_indent, $k, $res);
        }
    }

    return $buf;
}
