# SBB-TVM Prototype

## by Fernando Obieta - [blanktree.ch](http://blanktree.ch), Simon Fischer & Claudio Rainolter

Functional prototype of a new ticket vending machine (TVM) for the Swiss Federal Railways (SBB).

## Requirements

You'll need the following software installed to get started.

  - [Node.js](http://nodejs.org): Use the installer for your OS.
  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
    - Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  - [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
    - Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the first command.

## Get Started

Install the dependencies. If you're running Mac OS or Linux, you may need to run `sudo npm install` instead, depending on how your machine is configured.

```bash
npm install
bower install
```

While you're working on your project or just want to look at a local version, run:

```bash
npm start
```

This will compile the Sass and assemble your Angular app. **Now go to `localhost:8080` in your browser to see it in action.** When you change any file in the `client` folder, the appropriate Gulp task will run to build new files.

To run the compiling process once, without watching any files, use the `build` command.

```bash
npm start build
```

## Built with
- [Foundation for Apps](http://foundation.zurb.com/apps.html)
- [Angular 1.4.11](https://angularjs.org/)
- [Moment.js](http://momentjs.com/)

## Mirror
- [http://sbb-tvm.blanktree.ch/build](http://sbb-tvm.blanktree.ch/build)