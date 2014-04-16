#!/usr/bin/env python

# a simple parse for Valve's KeyValue format
# https://developer.valvesoftware.com/wiki/KeyValues
#
# author: Rossen Popov, 2014
#
# use at your own risk

import re

####################################
# takes file and returns a dict
####################################

def parse(fileobj):
    obj = dict()
    stack = [obj]
    skipnext = False
    name = ""

    re_keyvalue = re.compile('^"((?:[^"\\\]|\.)*)"[ \t]+"((?:[^"\\\]|\.)*)"')

    for line in fileobj.readlines():
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
            m = re_keyvalue.match(line)

            # we've matched a simple keyvalue pair, map it to the last dict obj in the stack
            if m:
                stack[-1][m.group(1)] = m.group(2)

            # we have a key with value in parenthesis, so we make a new dict obj (one level deep)
            else:
                key = line[1:-1]

                stack[-1][key] = dict()
                stack.append(stack[-1][key])
                skipnext = True

    return obj
