# Lozya

A hack on top of [Jitsi](https://jitsi.org) to create a virtual meeting room where users can sit next to each other to hear each other better.

## PROBLEM

Even when it works, teleconferencing still kind of sucks. Only one person can realistically talk at any one time. This is fine for people giving presentations, but in real meetings, people speak over and around each other, or pair off into smaller subgroups, still being able to overhear the larger group.

## SOLUTION

Lozya adds a small, RPG-style map to the Jitsi meeting view. It gives you an avatar to walk around the room. Users choose where to sit in relation to other users. Users very close to you are set to full volume. Users a little far away have their volume scaled down accordingly. Users too far away to care about are rendered with zero volume.

- Visit the current installation at [meet.primrosevr.com](https://meet.primrosevr.com).
- Enter a room name and user name.
- Click "Connect" and wait for the connection to go through.
- If you need to change your microphone settings, click the `<` arrow in the menu in the upper right corner of the window to hide the map view and give you full access to the Jitsi Meet interface. 
- Once you are done changing settings, use the `>` arrow in the upper-right menu to return to the map view.
- Use the Arrow Keys to move your character around.

<video src="/capnmidnight/lozya/blob/master/demo.webp">

</video>

## INSTALLATION

- First, setup Jitsi Meet on a server of your choice: [Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md).
- Next login to your Jitsi Meet server as root and edit `/usr/share/jitsi-meet/index.html` and add the following line: `<script type="text/javascript" src="jitsihax.js"></script>`.
- Copy the script `jitsihax.js` from this repo to `/usr/share/jitsi-meet/`.
- Install the rest of this repository onto another server of your choice.
  - Modify "DOMAIN_NAME" in `index.html` scripts to point to your Jitsi Meet server.

## CONTRIBUTING

Everything. I only just got the basic Jitsi server running as of 4/1/2020 (this is not an April Fool's joke. We don't have time for childish games right now) and the basics of volume scaling done on 4/3/2020.

### Conduct

First, please read the [Conduct Policy](CONDUCT.md).

### Contributions

If you think you can be a polite person in accordance with the Conduct Policy, I'd be more than happy to add anyone who asks as a contributor. Just [email me](sean.mcbeth+gh@gmail.com) your profile info and a brief description of what you'd like to work on.

#### Artwork

Oh man, let's go nuts! I would love to see a wide variety of tilesets for rooms and avatars. Maybe customizable clothing and character features. 

#### Testing

The QA team is the software development team's best friend. Testing releases and filing issues is a huge amount of important work.

#### Documentation

IDK, I planned on just hacking this together as I went, but I will probaby write some notes on whatever I've done along they way. Won't say no to more docs.

#### Client

I have experience hacking on WebRTC stuffs, but I'm certainly welcome for more help. Right now, there's a button to hide the Lozya interface to give access to the Jitsi interface. A lot of the settings can be controlled through the Jitsi Meet Web API, so I think I'd prefer to provide a full interface and hide Jitsi Meet's web interface completely.

There are also Android and iOS clients for Jitsi that might be cool to fork and upgrade to have the game view. That is also outside of my current skillset. 

#### Server

I'm currently running an Azure VM in Central Korea region (hello, mid-pandemic resource shortages!) with 2 virtual CPUs and 4 GiB of RAM. Operating System is Ubuntu 18.04. This will cost approx. $75/mo, if left to run constantly.

I set the server up using [the Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md) (Actually, I followed [This video on YouTube](https://www.youtube.com/watch?v=8KR0AhDZF2A), but the directions are largely the same, I just found the video nice to see what to expect for results from each command). 

This repository is a set of static Web resources that use my private Jitsi Meet server through [the Jitsi Meet Web API](https://github.com/jitsi/jitsi-meet/blob/master/doc/api.md).

I'm a software hacker, not a server administrator. There is one file that needs to be copied to the Jitsi Meet install, and one of Jitsi Meet's files edited slightly. Ideally, I'd prefer to fork [the Jitsi-Meet repository](https://github.com/jitsi/jitsi-meet) and install from that, but that's beyond this old Windows developer's Linuxfu right now.

## OTHER

What else?

### Why?

[Cuz why not?](https://www.youtube.com/watch?v=YEwlW5sHQ4Q)

### Name

"Jitsi" is the Bulgarian word for "wires", so "Lozya" is the Bulgarian word for "Vines". Apparently, "Jitsi" is also the Swahili word for "Juice", so in my mind, this project is Grape Vines. Yes, I name all of my projects after plants.
