RaphealWrapper
==============

RaphaelWrapper is a Sproutcore framework that gives access to the [Raphaël](http://raphaeljs.com/) javascript graphic library through a Sproutcore-friendly view.

Installation
------------

**Note:** requires the 1.5 version of Sproutcore.

You need to copy or clone this project into the frameworks directory of your project. Assuming your project is a git repository, a best practice is to set up the framework a git submodule, as follows:

1. Make the frameworks directory in the root of your project, if it doesn't already exist: `mkdir your_project/frameworks`
2. Add RaphaelWrapper as a git submodule: `cd your_project; git submodule add git://github.com/demerzel3/RaphaelWrapper.git frameworks/raphael_wrapper`

Alternatively, you can just checkout the repository into your frameworks directory as follows:

1. Move to your frameworks directory: `cd your_project/frameworks`
2. Checkout the repository like this: `git checkout git://github.com/demerzel3/RaphaelWrapper.git raphael_wrapper`

Important: don't forget to add `raphael_wrapper` to the frameworks required by your project in your `Buildfile`.

Showcase
--------

![RaphaelWrapper showcase screenshot](http://gabrielegenta.files.wordpress.com/2011/03/raphaelwrapper_showcase.png)
[Click here to see the live demo](http://www.playcalliope.com/raphael_wrapper/showcase)

Usage
-----

Please refer to the [source code of the showcase](https://github.com/demerzel3/RaphaelWrapperShowcase).

About The Author
----------------

My name is Gabriele Genta, you can find more information and contacts [on this page](http://gabrielegenta.wordpress.com/about/).