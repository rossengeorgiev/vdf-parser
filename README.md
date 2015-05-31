## KeyValue encoder/decoder for various languages

Format: https://developer.valvesoftware.com/wiki/KeyValues

VDF may contain comments. However, they are not preserved during decoding.

### Online (in your browser)

Go to http://rossengeorgiev.github.io/vdf-parser/

### Python

Moved to https://github.com/rossengeorgiev/vdf-python

Install via pypi: `pip install vdf`

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
