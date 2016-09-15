## KeyValue encoder/decoder for various languages

Format: https://developer.valvesoftware.com/wiki/KeyValues

VDF may contain comments. However, they are not preserved during decoding.

### Online (in your browser)

Go to http://rossengeorgiev.github.io/vdf-parser/

### Python

Moved to https://github.com/ValvePython/vdf

Install via pypi: `pip install vdf`

### Javascript

Using `vdf.js`

```javascript
data = VDF.parse(vdf_text);
vdf_text = VDF.stringify(data);
```

Or the version on `npm` (https://www.npmjs.com/package/simple-vdf)

```bash
npm install simple-vdf
```

```javascript
vdf = require('simple-vdf');
data = vdf.parse(vdf_text);
vdf_text = vdf.stringify(data);
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
