# Bitcoin Block Clock
macOS screensaver powered by mempool.space 's awesome API

This saver requires an internet connection obviouly, otherwise nothing interesting is displayed.

## Info

Includes a tweaked version of [GeoSans Light](https://www.dafont.com/geo-sans-light.font) font, created by Manfred Klein. I had some kerning issues, so converted the TTF to WOFF2 using 'Font-face Generator' on Font Squirrel.

I took a chunk of code from [Word Clock Screensaver](https://github.com/chrstphrknwtn/word-clock/) -> .xib + .h + .m to get this initial version pu and running.

## Install

Download 'Bitcoin Block Clock.saver' or compile everything yourself using the Xcode project. 

Tested on macOS 10.12 thru 11.4. May or may not work on other versions. 


## Issues

On older versions of macOS you have the option to target Main, All or Last Used Display in System Preferences. But on newer macOS versions these options are not available... not sure why the config panel doesn't display. Will fix eventually.
