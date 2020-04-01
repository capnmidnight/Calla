# Lozya
A hack on top of [Jitsi](https://jitsi.org) to create a virtual meeting room where users can sit next to each other to hear each other better.

## Problem
Even when it works, teleconferencing still kind of sucks. Only one person can realistically talk at any one time. This is fine for people giving presentations, but in real meetings, people speak over and around each other, or pair off into smaller subgroups, still being able to overhear the larger group.

## Solution
Lozya adds a small, RPG-style map to the Jitsi meeting view. It gives you an avatar to walk around the room. Users choose where to sit in relation to other users. Users very close to you are set to full volume. Users a little far away have their volume scaled down accordingly. Users too far away to care about are rendered with zero volume.

## TODO
Everything. I only just got the basic Jitsi server running as of 4/1/2020 (this is not an April Fool's joke. We don't have time for childish games right now).

### Server
I'm currently running an Azure VM in Central Korea region (hello, mid-pandemic resource shortages!) with 2 virtual CPUs and 4 GiB of RAM. Operating System is Ubuntu 18.04. This will cost approx. $75/mo, if left to run constantly.

I set the server up using [the Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md) (Actually, I followed [This video on YouTube](https://www.youtube.com/watch?v=8KR0AhDZF2A, but the directions are largely the same, I just found the video nice to see what to expect for results from each command). This repository is the static Web resources from that install.

I'm a software hacker, not a server administrator. Ideally, I'd prefer to fork [the Jitsi-Meet repository](https://github.com/jitsi/jitsi-meet) and install from that, but that's beyond this old Windows developer's Linuxfu right now.

### Client
I have experience hacking on WebRTC stuffs, but I'm certainly welcome for more help. One of the reasons I went with copying the installation's Web resources directory was to get around having to learn their build system. It should be realtively easy to just hack on the HTML files in-place and add whatever JavaScript is needed to get the game view working.

My current plan is to create a wrapper around the browser's WebRTC API that can capture Jitsi's parameters and create an extra data channel using the same handshake values that Jitsi negotiates for itself.

There are also Android and iOS clients for Jitsi that might be cool to fork and upgrade to have the game view. That is also outside of my current skillset.

### Artwork
Oh man, let's go nuts! I would love to see a wide variety of tilesets for rooms and avatars. Maybe customizable clothing and character features. 

## ADMIN

### Conduct
Please read the [Conduct Policy](CONDUCT.md)

### Contributions
If you think you can be a polite person in accordance with the Conduct Policy, I'd be more than happy to add anyone who asks as a contributor. Just [email me](sean.mcbeth+gh@gmail.com) your profile info and a brief description of what you'd like to work on.

## OTHER
What else?

### Why?
[Cuz why not?](https://www.youtube.com/watch?v=YEwlW5sHQ4Q)

### Name
"Jitsi" is the Bulgarian word for "wires", so "Lozya" is the Bulgarian word for "Vines". Apparently, "Jitsi" is also the Swahili word for "Juice", so in my mind, this project is Grape Vines. Yes, I name all of my projects after plants.
