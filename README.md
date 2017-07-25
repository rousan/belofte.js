# Belofte.js

`Belofte.js` is a lightweight Promises/A+ compliant implementation of ECMAScript Promise API.
Here the `Belofte` is an Afrikaans word, It means `Promise`.

This library is very useful for old browsers or old Javascript engines where
native `Promise` API is not available.


## Install

If you use NPM, run the following command, Otherwise download the latest release from Github. 
It uses `UMD` module definition i.e. it supports AMD, CommonJS, and VanillaJS module loader 
environments. In VanillaJS, a `Belofte` global object is exported:

`npm install belofte.js`

For VanillaJS, just insert it into your HTML page:

```haml
<script src="belofte.min.js"></script>
```

## Build

`npm run build`     
     
## Test

`npm test`

## Contributors

   * [Rousan Ali](https://github.com/ariyankhan)
   
   Contributions are always welcome.
   
## License

MIT License

Copyright (c) 2017 Rousan Ali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
