# Dispense

> A node continuous integration server using git hooks.

If that didn't make sense - *this thing builds and deploys code to production.*


## Installation

```shell
git clone git@github.com:TxSSC/Dispense.git && cd Dispense
mv config/deployments.example.json config/deployments.json
```


## Setup

* Most build scripts must use some ssh based authentication to copy over the built project, in order automate this you must use key based ssh authentication for user dispense is running as.
* The same ssh key should be set up on github for the same user, allowing dispense to `clone` and `pull` repositories from Github.

#### `deployments.json` supports the following keys:

##### users - `Array`

* array that contains authorized github users that push hooks are accepted from.

##### logfile - `String`

* absolute path to the file dispense should write logs to
* must be writable on the filesystem, otherwise bad things will happen

##### repos - `Object`

* contains all repositories that will be accepted by dispense
* a repository key should contain keys `type`, the proceeding keys are dependent upon the type chosen

##### repository.type - `String`

* the build script that will be executed by dispense for this repository
* all keys other than type are passed to the build script as arguments sorted by name


## Running
```shell
npm install && npm start
```


## License (MIT)
Copyright (c) 2013 TxSSC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.