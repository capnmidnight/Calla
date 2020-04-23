# Calla

A hack on top of [Jitsi](https://jitsi.org) to create a virtual meeting room where users can sit next to each other to hear each other better.
<img src="https://raw.githubusercontent.com/capnmidnight/Calla/master/repo-preview.jpg">

## PROBLEM

Even when it works, teleconferencing still kind of sucks. Only one person can realistically talk at any one time. This is fine for people giving presentations, but in real meetings, people speak over and around each other, or pair off into smaller subgroups, still being able to overhear the larger group.

## SOLUTION

Calla adds a small, RPG-style map to the Jitsi meeting view. It gives you an avatar to walk around the room. Users choose where to sit in relation to other users. Users very close to you are set to full volume. Users a little far away have their volume scaled down accordingly. Users too far away to care about are rendered with zero volume.

- Visit the current installation at [www.calla.chat](https://www.calla.chat).
- Enter a room name and user name. Suggest "FromGithub" for the roomname to meet other people linking from this repo (maybe).
- Click "Connect" and wait for the connection to go through.
- If you need to change your microphone settings, click the `<` arrow in the menu in the upper right corner of the window to hide the map view and give you full access to the Jitsi Meet interface. 
- Once you are done changing settings, use the `>` arrow in the upper-right menu to return to the map view.
- Use the Arrow Keys to move your character around.

## INSTALLATION

- First, setup Jitsi Meet on a server of your choice: [Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md).
- Next login to your Jitsi Meet server as root and edit `/usr/share/jitsi-meet/index.html` and add the following line: `<script type="text/javascript" src="jitsihax.js"></script>`.
- Copy the script `jitsihax.js` from this repo to `/usr/share/jitsi-meet/`.
- Edit `jitsihax.js`, changing `FRONT_END_SERVER` to point to where you will host the Calla front-end.
- Install the Calla front-end (basically the rest of this repository) onto another server of your choice.
  - Modify "DOMAIN_NAME" in `index.html` scripts to point to your Jitsi Meet server.
- You may also want to edit `index.html` to change/remove the link(s) to this repository and/or my Twitter profile.
  
Make sure you keep the distinction between your Jitsi installation and your Calla installation clear. You can conceivably run them on the same server, but I won't be digging into customizing a Jitsi installation enough to figure that out, so my setup has them on separate servers. `jitsihax.js` needs to go on your Jitsi server, and you need to edit it to point to your Calla server. `index.html` goes on your Lozay server, and you need to edit it to point to your Jitsi server.

## USAGE

- __Be careful in picking your room name__, if you don't want randos to join. Traffic is low right now, but you never know.
- Try to __pick a unique user name__. A lot of people use "Test" and then there are a bunch of people with the same name running around.
- Either __Hide the game view__ or __Separate the game and meeting views__ to be able to access the Jitsi Meet user settings. Calla captures all of the mouse clicks to enable moving.
- __Click on the map__ to move your avatar to wherever you want. Movement is instantaneous, with a smooth animation over the transition. Your avatar will stop at walls.
- Or, __use the arrow keys__ on your keyboard to move.
- __Click on yourself__ to open a list of Emoji. Select an Emoji to float it out into the map.
- __Hit the E key__ to re-emote with your last selected Emoji.
- You can __roll your mouse wheel__ or __pinch your touchscreen__ to zoom in and out of the map view. This is useful for groups of people standing close to each other to see the detail in ther Avatar.
- __Jitsi Meet's web client doesn't work on iOS!__ Sorry :(

## CONTRIBUTING

### Conduct

First, please read the [Conduct Policy](CONDUCT.md).

### Contributions

If you think you can be a polite person in accordance with the Conduct Policy, I'd be more than happy to add anyone who asks as a contributor. Just [email me](sean.mcbeth+gh@gmail.com) your profile info and a brief description of what you'd like to work on.

#### Artwork

Oh man, let's go nuts! I would love to see a wide variety of tilesets for rooms and avatars. Maybe customizable clothing and character features. 

- You can use [Tiled](https://www.mapeditor.org/) to create a tilemap.
- You can do multiple layers.
- You can set blocks as non-walkable by opening your Tile Set, selecting the unwalkable block, and adding a custom property to it. Create a boolean value named "Collision", and set its value to "true". All instances of that tile will now be solid on your map.
- Save your `.tmx` file to `<Calla-proj>\data\tilemaps\<room-name>.tmx`.
- Save your `.tsx` file to `<Calla-proj>\data\tilesets\<tileset-name>\<tileset-name>.tsx`.
- And that's it! Calla reads Tiled files directly.

#### Testing

The QA team is the software development team's best friend. Testing releases and filing issues is a huge amount of important work.

#### Documentation

IDK, I planned on just hacking this together as I went, but I will probaby write some notes on whatever I've done along they way. Let me know if anything is particularly unclear and I'll write something about it.

#### Client

I'm pretty happy with how the client is working right now, but anyone is free to self-service add features. But check the [Issues](https://github.com/capnmidnight/Calla/issues) nonetheless.

#### Server

I'm currently running a VM on Azure with 2 virtual CPUs and 4 GiB of RAM. Operating System is Ubuntu 18.04. This will cost me about $200/mo.

I set the server up using [the Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md) (Actually, I followed [This video on YouTube](https://www.youtube.com/watch?v=8KR0AhDZF2A), but the directions are largely the same, I just found the video nice to see what to expect for results from each command). 

This repository is a set of static Web resources that use my private Jitsi Meet server through [the Jitsi Meet Web API](https://github.com/jitsi/jitsi-meet/blob/master/doc/api.md).

I'm a software hacker, not a server administrator. There is one file that needs to be copied to the Jitsi Meet install, and one of Jitsi Meet's files edited slightly. Ideally, I'd prefer to fork [the Jitsi-Meet repository](https://github.com/jitsi/jitsi-meet) and install from that, but that's beyond this old Windows developer's Linuxfu right now.

## OTHER

What else?

### Why?

[Cuz why not?](https://www.youtube.com/watch?v=YEwlW5sHQ4Q)

### Name

"Jitsi" is the Bulgarian word for "wires", so "Calla" is the Bulgarian word for "Vines". Apparently, "Jitsi" is also the Swahili word for "Juice", so in my mind, this project is Grape Vines. Yes, I name all of my projects after plants.
