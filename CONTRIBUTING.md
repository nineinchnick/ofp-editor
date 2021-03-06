# Contributing to OpenFloorPlan Editor

You should contribute to [iD] (https://github.com/systemed/iD) unless your modifications are explictly for customizations made by ofp-editor.



## Reporting Issues

We'd love to hear what you think about ofp-editor, about any specific problems or
concerns you have. Here's a quick list of things to consider:

Please [search for your issue before filing it: many bugs and improvements have already been reported](https://github.com/openfloorplan/ofp-editor/issues/search?q=)

To report a bug:

* Write specifically what browser (type and version, like "Firefox 43.0"), OS, and browser extensions you have installed
* Write steps to replicate the error: when did it happen? What did you expect to happen? What happened instead?
* Please keep bug reports professional and straightforward: trust us, we share your dismay at software breaking.
* If you can, [enable web developer extensions](http://debugbrowser.com/) and report the
  Javascript error message.

When in doubt, be over-descriptive of the bug and how you discovered it.

To request a feature:

* If the feature is available in some other software (like Potlatch), link to that software and the implementation.
  We care about prior art.
* Understand that ofp-editor is meant to be a simple editor and doesn't aim to be
  as complete or complicated as JOSM or similar.

## Verifying Bug Fixes

To verify a bug fix (or test a new feature), use the [master deployment](http://www.openstreetmap.us/iD/master/)
(http://www.openstreetmap.us/iD/master/), which is updated every 10 minutes with the latest code.

The deployments on openstreetmap.org and http://www.openstreetmap.us/iD/release/ are updated only
with stable releases. Issues that are marked fixed in the tracker may still be present.

## Translating


## Contributing Documentation

Documentation is maintained as a series of [Markdown](http://daringfireball.net/projects/markdown/)
documents in [core.yaml](/data/core.yaml). The documentation
is in the `help` section (currently starting at line 258). The first line
of each new section of documentation should be of the form

## Adding or Refining Presets

Presets save time for iD users by automatically showing them the tags they are
likely to add for a given feature. They are stored in `data/presets/presets`. If
you're going to update the presets, [review the Presets README](/data/presets/README.md).

## Javascript

We use the [Airbnb style for Javascript](https://github.com/airbnb/javascript) with
only one difference:

**4 space soft tabs always for Javascript, not 2.**

No aligned `=`, no aligned arguments, spaces are either indents or the 1
space between expressions. No hard tabs, ever.

Javascript code should pass through [ESLint](http://eslint.org/) with no
warnings.

## HTML

There isn't much HTML in ofp-editor, but what there is is similar to JS: 4 spaces
always, indented by the level of the tree:

```html
<div>
    <div></div>
</div>
```

## CSS

Just like HTML and Javascript, 4 space soft tabs always.

```css
.radial-menu-tooltip {
    background: rgba(255, 255, 255, 0.8);
}
```

We write vanilla CSS with no preprocessing step. Since ofp-editor targets modern browsers,
feel free to use newer features wisely.

## Tests

Test your code and make sure it passes. Our testing harness requires [node.js](http://nodejs.org/)
and a few modules:

1. [Install node.js](http://nodejs.org/) - 'Install' will download a package for your OS
2. Go to the directory where you have checked out `ofp-editor`
3. Run `npm install`
4. Run `npm test` to see whether your tests pass or fail.

## Building / Installing

You can build a concatenated and minified version of ofp-editor with the command `make`. Node.js is
required for this.

ofp-editor will be built to the `dist` directory. This directory is self-contained; you can copy it
into the public directory of your webserver to deploy ofp-editor.

## Licensing

ofp-editor is dual licensed under the MIT License or the [WTFPL](http://www.wtfpl.net/). Some of the libraries it uses
are under different licenses. If you're contributing to ofp-editor, you're contributing
MIT/WTFPL code.

## Submitting Changes

Let's say that you've thought of a great improvement to ofp-editor - a change that
turns everything red (please do not do this, we like colors other than red).

In your local copy, make a branch for this change:

    git checkout -b make-red

Make your changes to source files. By source files we mean the files in `js/`.
the `ofp-editor.js` and `ofp-editor.min.js` files in this project are autogenerated - don't edit
them.

So let's say you've changed `js/ui/confirm.js`.

1. Run `jshint js/ofp-editor` to make sure your code is clean
2. Run tests with `npm test`
3. Commit your changes with an informative commit message
4. [Submit a pull request](https://help.github.com/articles/using-pull-requests) to the `openfloorplan\ofp-editor` project.
