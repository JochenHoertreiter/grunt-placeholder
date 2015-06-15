
# grunt-placeholder

Grunt Task for replacing placeholders in source files with values from a configuration file

<p/>
<img src="https://nodei.co/npm/grunt-placeholder.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/JochenHoertreiter/grunt-placeholder.png" alt=""/>


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/)
before, be sure to check out the [Getting
Started](http://gruntjs.com/getting-started) guide, as it explains how
to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process,
you may install this plugin with this command:

```shell
npm install grunt-placeholder --save-dev
```

Once the plugin has been installed, it may be enabled inside your
Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-placeholder');
```

## Task Options

TODO:
- `configFile`: (default `component.yaml`) the configuration file that contains key/values for any replacements.
- `configType`: (default `yaml`) the type of the configuration file - possible values are `json` or `yaml`.
- `configEncoding`: (default `utf8`) file encoding for configuration files.
- `sourceEncoding`: (default `utf8`) file encoding for source files.
- `placeholderRegex`: (default `/___config\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)___/g`)
                      placeholder used by source files in order to replace keys with values from the configuration file.
:TODO END

## Merge JSON Task

_Run this task with the `grunt placeholder` command._

Task targets, files and options may be specified according to the Grunt
[Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

## Usage Example

TODO:
Assuming we have the following types of source JSON files:

- `src/foo/foo-en.json`:

```json
{
    "foo": {
        "title": "The Foo",
        "name":  "A wonderful component"
    }
}
```

- `src/bar/bar-en.json`:

```json
{
    "bar": {
        "title": "The Bar",
        "name":  "An even more wonderful component"
    }
}
```

Assuming we want to generate the following destination JSON file:

```json
{
    "foo": {
        "title": "The Foo",
        "name":  "A wonderful component"
    },
    "bar": {
        "title": "The Bar",
        "name":  "An even more wonderful component"
    }
}
```

### Single file per target variant

```js
grunt.initConfig({
    "merge-json": {
        "en": {
            src: [ "src/**/*-en.json" ],
            dest: "www/en.json"
        },
        "de": {
            src: [ "src/**/*-de.json" ],
            dest: "www/de.json"
        }
    }
});
```

### Multiple files per target variant

```js
grunt.initConfig({
    "merge-json": {
        "i18n": {
            files: {
                "www/en.json": [ "src/**/*-en.json" ],
                "www/de.json": [ "src/**/*-de.json" ]
            }
        }
    }
});
```

:TODO END