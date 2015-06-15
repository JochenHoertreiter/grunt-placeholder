
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

## Plugin purpose

This plugin lets you alter your source code (any text file) by replacing placeholder inside with values defined in a configuration file.
This step is considered a preprocess step and should be done before you start compiling, linting or doing anything similar with your sources.

The placeholder replacement enables you to move common values within different files into a single configuration file in order to avoid redundancy.
The configuration and replacement is done on folder structure level (see example for details).
The keys are hierarchical and can be used with dot syntax as used to (e.g. the placeholder `___config.package.name___` looks for the value of key `name` within key `package`)

## Task Options

- `configFile`: (default `component.yaml`) the configuration file that contains key/values for any replacements.
- `configType`: (default `yaml`) the type of the configuration file - possible values are `json` or `yaml`.
- `configEncoding`: (default `utf8`) file encoding for configuration files.
- `sourceEncoding`: (default `utf8`) file encoding for source files.
- `placeholderRegex`: (default `/___config\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)___/g`)
                      placeholder used by source files in order to replace keys with values from the configuration file.

## Placeholder Task

_Run this task with the `grunt placeholder` command._

Task targets, files and options may be specified according to the Grunt
[Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

## Usage Example

### The example scenario

Assuming we have the following folder and file structure that helps us to separate concerns of individual parts of a component:

- `app`
  - `ui`
    - `componentA`
      - `de.json`
      - `en.json`
      - `componentA-ctrl.js`
      - `componentA-model.js`
      - `componentA-view.js`
      - `componentA.html`
      - `componentA.less`
    - `componentB`
      - `de.json`
      - `en.json`
      - `componentB-ctrl.js`
      - `componentB-model.js`
      - `componentB-view.js`
      - `componentB.html`
      - `componentB.less`

The example separates an ui component into several files in order to put
- internationalisation into `json` files
- the controller related logic into a single `javascript` file
- the model values into another `javascript` file
- the view related logic into another `javascript` file
- all view related markups into a `HTML` file
- and the markup related styling into a `less` file

Since all single files of a component are related together, they use identifier and package names in common.
This makes the files look like this:

- `app/ui/componentA/componentA-ctrl.js`

```js
cs.ns("app.ui.componentA");
app.ui.componentA.ctrl = cs.clazz({
    dynamics: {
        ...
    },
    protos: {

        create: function () {
            var self = this;
            self.model = cs(self).create("model", app.ui.componentA.model);
            self.view = self.model.create("view", app.ui.componentA.view);
        },

        ...
    }
}
```

- `app/ui/componentA/componentA-model.js`

```js
cs.ns("app.ui.componentA");
app.ui.componentA.model = cs.clazz({
    dynamics: {
        ...
    },
    protos: {
        ...
    }
}
```

- `app/ui/componentA/componentA-view.js`

```js
cs.ns("app.ui.componentA");
app.ui.componentA.view = cs.clazz({
    dynamics: {
        ...
    },
    protos: {
        ...
    }
}
```

- `app/ui/componentA/de.json`

```json
{
    "componentA": {
        "title": "Titel der Komponente A"
    }
}
```

- `app/ui/componentA/en.json`

```json
{
    "componentA": {
        "title": "Title of component A"
    }
}
```

- `app/ui/componentA/componentA.html`

```html
<markup id="componentA">
    <div class="componentA">
        <div data-i18n="componentA.title;[title]componentA.title"></div>
    </div>
</markup>
```

- `app/ui/componentA/componentA.less`

```less
.componentA {
    background: grey;
    color: red;
}
```

### The problem

In each of the given component parts different content is redundant and by the other hand must match in order to avoid errors.

In detail this is
- the ctrl, model and views namespace/package `app.ui.componentA`
- the component id used in the i18n json, the markup and the less file `componentA`

### The solution

By identifying the common values used by more then one separate file and moving those values into a configuration file we can
let this `grunt placeholder` task auto search placeholders in any source file and replace the placeholder with the defined value
within the configuration file.

- `app/ui/componentA/componentA.yaml`

```yaml
  package: "app.ui.componentA"
  id: "componentA"
```

The source files will change of course by using the placeholders now instead.

- `app/ui/componentA/componentA-ctrl.js`

```js
cs.ns("___config.package___");
___config.package___.ctrl = cs.clazz({
    dynamics: {
        ...
    },
    protos: {

        create: function () {
            var self = this;
            self.model = cs(self).create("model", ___config.package___.model);
            self.view = self.model.create("view", ___config.package___.view);
        },

        ...
    }
}
```

- `app/ui/componentA/componentA-model.js`

```js
cs.ns("___config.package___");
___config.package___.model = cs.clazz({
    dynamics: {
        ...
    },
    protos: {
        ...
    }
}
```

- `app/ui/componentA/componentA-view.js`

```js
cs.ns("___config.package___");
___config.package___.view = cs.clazz({
    dynamics: {
        ...
    },
    protos: {
        ...
    }
}
```

- `app/ui/componentA/de.json`

```json
{
    "___config.id___": {
        "title": "Titel der Komponente A"
    }
}
```

- `app/ui/componentA/en.json`

```json
{
    "___config.id___": {
        "title": "Title of component A"
    }
}
```

- `app/ui/componentA/componentA.html`

```html
<markup id="___config.id___">
    <div class="___config.id___">
        <div data-i18n="___config.id___.title;[title]___config.id___.title"></div>
    </div>
</markup>
```

- `app/ui/componentA/componentA.less`

```less
.___config.id___ {
    background: grey;
    color: red;
}
```

### Grunt config for this solution

```js
grunt.initConfig({
    "placeholder": {
        "example": {
            "files": [
                {
                    cwd: "app/ui",
                    src: [
                        "**/de.json",
                        "**/en.json",
                        "**/*-ctrl.js",
                        "**/*-model.js",
                        "**/*-view.js",
                        "**/*.html",
                        "**/*.less"
                    ],
                    dest: "tmp/app/ui"
                }
           ]
        }
    },
});
```

## Future plans

In order to enhance the folder structure based replacement it is planed to let the configuration files extend from parent configuration files.
This way we can build even more redundant free configuration files.