## KeyValue parser for various languages

Format: https://developer.valvesoftware.com/wiki/KeyValues

Parses vdf text to a language spefic data structure, like an object.
The data is then available for interaction during runtime.
Finally, the data can be encoded back to vdf.

VDF may contain comments. However, they are not preserved during decoding.

### Online (in your browser)

Go to http://rossengeorgiev.github.io/vdf-parser/

### Python

```python
import vdf

f = vdf.parse(open('file.txt'))
f = vdf.parse(vdf_text)

vdf_text = vdf.dump(f)
indented_vdf = vdf.dump(f,pretty=True)
```

### Javascript

```javascript
data = VDF.parse(vdf_text);
vdf_text = VDF.stringify(data)
```

### PHP

```php
require_once('vdf.php');

$array = vdf_decode($vdf);
$vdf = vdf_encode($array);
$indented_vdf = vdf_encode($array, true);
```

### License

See [license](LICENSE) file.
