#!/usr/bin/env python

# a simple parser for Valve's KeyValue format
# https://developer.valvesoftware.com/wiki/KeyValues
#
# author: Rossen Popov, 2014
#
# use at your own risk

import re

###############################################
#
# Takes a file or str and returns dict
#
# Function assumes valid VDF as input.
# Invalid VDF will result in unexpected output
#
###############################################

def parse(a):
    a_type = type(a)

    if a_type is file:
        lines = a.readlines()
    elif a_type is str:
        lines = a.split('\n')
    else:
        raise ValueError("Expected parametar to be file or str")

    obj = dict()
    stack = [obj]
    skipnext = False
    name = ""

    re_keyvalue = re.compile(r'^"((\\.|[^\"])*)"[ \t]+"((\\.|[^\"])*)(")?')

    itr = iter(lines)

    for line in itr:
        line = line.strip()

        # skip empty and comment lines
        if line == "" or line[0] == '/':
            continue

        # one level deeper
        if line[0] == "{" and skipnext is True:
            skipnext = False
            continue

        # one level back
        if line[0] == "}":
            stack.pop()
            continue

        # parse keyvalue pairs
        if line[0] == '"':
            while True:
                m = re_keyvalue.match(line)

                # we've matched a simple keyvalue pair, map it to the last dict obj in the stack
                if m:
                    # if the value is line consume one more line and try to match again, until we get the KeyValue pair
                    if m.group(5) == None:
                        line += itr.next()
                        continue

                    stack[-1][m.group(1)] = m.group(3)

                # we have a key with value in parenthesis, so we make a new dict obj (one level deep)
                else:
                    key = line[1:-1]

                    stack[-1][key] = dict()
                    stack.append(stack[-1][key])
                    skipnext = True

                # exit the loop
                break

    return obj

###############################################
#
# Take a dict, reuturns VDF in str buffer
#
# dump(dict(), pretty=True) for indented VDF
#
###############################################

def dump(a, **kwargs):
    pretty = kwargs.get("pretty", False)

    if type(pretty) is not bool:
        raise ValueError("Pretty option is a boolean")

    return _dump(a,pretty)

def _dump(a,pretty=False,level=0):
    if type(a) is not dict:
        raise ValueError("Expected parametar to be dict")

    indent = "\t"
    buf = ""
    line_indent = ""

    if pretty:
        line_indent = indent * level

    for key in a:
        if type(a[key]) is dict:
            buf += '%s"%s"\n%s{\n%s%s}\n' % (line_indent, key, line_indent, _dump(a[key],pretty,level+1), line_indent)
        else:
            buf += '%s"%s" "%s"\n' % (line_indent, key, str(a[key]))

    return buf

###############################################
#
# Testing initiative
#
###############################################


def test():
    tests = [
                [ '' , {} ],
                [ {} ,  '' ],
                [ "//comment text\n//comment", {} ],
                [ {1:1}, '"1" "1"\n'],
                [ {"a":"1","b":"2"} , '"a" "1"\n"b" "2"\n' ],
                [ '//comment\n"a" "1"\n"b" "2" //comment' , {"a":"1","b":"2"} ],
                [ {"a":{"b":{"c":{"d":"1","e":"2"}}}} , '"a"\n{\n"b"\n{\n"c"\n{\n"e" "2"\n"d" "1"\n}\n}\n}\n' ],
                [ '"a"\n{\n"b"\n{\n"c"\n{\n"e" "2"\n"d" "1"\n}\n}\n}\n' , {"a":{"b":{"c":{"d":"1","e":"2"}}}} ],
            ]

    for test,expected in tests:
        out = None

        try:
            if type(test) is dict:
                out = dump(test)
            else:
                out = parse(test)
        except:
            print "Test falure (exception):\n\n%s" % str(test)
            raise

        if cmp(expected,out) != 0:
            print "Test falure (ouput mismatch):\n\n%s" % str(test)
            print "\nOutput:\n\n%s" % str(out)
            print "\nExpected:\n\n%s\n" % str(expected)

            raise Exception("Output differs from expected result")

    return True




