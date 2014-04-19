## KeyValue parser for various languages

Format: https://developer.valvesoftware.com/wiki/KeyValues

Parses vdf text to a language spefic data structure, like an object.
The data is then available for interaction during runtime.
Finally, the data can be encoded back to vdf.

VDF may contain comments. However, they are not preserved during decoding.

### Python

    import vdf

    f = vdf.parse(open('file.txt'))
    f = vdf.parse(vdf_text)

    vdf_text = vdf.dump(f)
    indented_vdf = vdf.dump(f,pretty=True)

### Javascript

    data = VDF.parse(vdf_text);
    vdf_text = VDF.stringify(data)


### License

See [license](LICENSE) file.
