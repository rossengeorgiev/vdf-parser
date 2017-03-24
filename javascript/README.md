##

Just a small fix to VDF output from what https://www.npmjs.com/package/simple-vdf does. It should use /t/t between "key" and "value", but is using space(s). 


## simple-vdf

Package for (de)serialization of Valve's KeyValue format (VDF)

## methods

### parse(string)
Parse a string containing VDF and returns an object

### stringify(obj) / dump(obj)
Serializes an object to a string of VDF
