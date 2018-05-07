# Welcome to Yaasl

Yet another automatic sortie list.

The idea behind Yaasl is cooperation, that means everyone can modify a sortie list at any time as long as it is open and
from any device (desk-/laptop, tablet, phone). Changes are immediately visible to all.

Start and landing times are provided automatically. If the backend detects a new flight it will merge the start and
landing time if there is already one in the start list or it will create a new one. That means a flight can be created
with the callsigns and pilots assigned beforehand with the start and landing times left blank. These are than later
automatically provided when the flight actually takes place.

This project is the frontend only, it needs [Yaasl backend](http://cbiever.github.io/yaasl-server) as a provider of so
called REST services.

![Yaasl](https://raw.githubusercontent.com/cbiever/yaasl/master/docs/Yaasl.png)

Try it [here](https://yaasl.duckdns.org) (the certificate is self signed, you need to except it as an exception).
At the moment 2 roles are defined: test and admin. The password is equal to the username.

See the projects [Manual](https://github.com/cbiever/yaasl/wiki/Manual) wiki page for more information.

## Installation

See the projects [Wiki](https://github.com/cbiever/yaasl/wiki) pages for more information.
