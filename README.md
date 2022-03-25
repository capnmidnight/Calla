# THIS PROJECT HAS BEEN ARCHIVED. IT IS NO LONGER ACTIVELY DEVELOPED.


# Calla

A wrapper library for Jitsi Meet that adds audio spatialization, to be able to create virtual meeting rooms.

<img src="https://raw.githubusercontent.com/capnmidnight/Calla/master/repo-preview.jpg">

## PROBLEM

Even when it works, teleconferencing still kind of sucks. Only one person can realistically talk at any one time. This is fine for people giving presentations, but in real meetings, people speak over and around each other, or pair off into smaller subgroups, still being able to overhear the larger group.

## SOLUTION

Calla adds a small, RPG-style map to the Jitsi meeting view. It gives you an avatar to walk around the room. Users choose where to sit in relation to other users. Users very close to you are set to full volume. Users a little far away have their volume scaled down accordingly. Users too far away to care about are rendered with zero volume.

- Visit the current installation at [www.calla.chat](https://www.calla.chat).
- Enter a room name and user name. Suggest "Calla" for the roomname to meet other people linking from this repo (maybe). 
  - __Be careful in picking your room name__, if you don't want randos to join. Traffic is low right now, but you never know. 
  - Try to __pick a unique user name__. A lot of people use "Test" and then there are a bunch of people with the same name running around.
- Click "Connect" and wait for the connection to go through.
- Movement:
  - __Click on the map__ to move your avatar to wherever you want. Movement is instantaneous, with a smooth animation over the transition. Your avatar will stop at walls.
  - Or, __use the arrow keys__ on your keyboard to move.
  - __Click on yourself__ or __Hit the E key__ to spam emoji into the space as emote reactions.
  - You can __roll your mouse wheel__ or __pinch your touchscreen__ to zoom in and out of the map view. This is useful for groups of people standing close to each other to see the detail in ther Avatar.
- Options:
  - You can change your Microphone and Speaker device in the Options view. Click the Gear icon (⚙️) in the toolbar. 

## INSTALLATION

<em>NOTE: This project is currently going through an overhaul in how it is setup. In the future, Calla will be just the library for interfacing with Jitsi Meet and spatializing its audio. The application currently visible on [calla.chat](https://calla.chat) will become a separate project. </em>

- First, setup Jitsi Meet on a server of your choice: [Jitsi quick-start instructions](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart).
- <strike>Install the Calla front-end (basically the rest of this repository) onto another server of your choice</strike>.
  - <strike>Modify "JITSI_HOST" in `index.html` scripts to point to your Jitsi Meet server</strike>.
- <strike>You may also want to edit `index.html` to change/remove the link(s) to this repository and/or my Twitter profile</strike>.
- <em>new setup instructions TBD</em>
  
Make sure you keep the distinction between your Jitsi installation and your Calla installation clear. You can conceivably run them on the same server, but I won't be digging into customizing a Jitsi installation enough to figure that out, so my setup has them on separate servers.

### Docker-compose installation

- Set up Jitsi Meet using docker-compose: [Jitsi Self-Hosting Guide - Docker](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker).
- Allow CORS access by adding the following two lines to the top of `${CONFIG}/prosody/config/conf.d/jitsi-meet.cfg.lua` (you may need to start jitsi once to generate the file):

        consider_bosh_secure = true
        cross_domain_bosh = true

- `git clone` this repository into the Calla folder under the same `${CONFIG}` directory as jitsi.
- Edit the jitsi `docker-compose.yml` to add the following service section:

        services:
            # Calla
            calla:
                image: nginx:alpine
                volumes:
                    - ${CONFIG}/Calla/js:/usr/share/nginx/html
                command: sh /usr/share/nginx/html/entrypoint.sh

- Add additional environment variables as necessary:

                environment:
                    - JITSI_HOST=jitsi.example.com
                    - JVB_HOST=jitsi.meet
                    - JVB_MUC=muc.jitsi.meet

    - The default JITSI_HOST will be `jitsi.<domain>`, where calla is served at `<domain>`
    - The default JVB_HOST will be `jitsi.meet`; this should be the name of the internal docker network you used in your `docker-compose.yml`
    - Set JVB_MUC to be the value of `muc.${JVB_HOST}`
- Add any additional reverse proxy configurations.
- Start Jitsi and Calla: `$ docker-compose up -d`

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

I'm currently running a VM on Azure with 2 virtual CPUs and 4 GiB of RAM. Operating System is Ubuntu 18.04. This will cost me about $100/mo.

I set the server up using [the Jitsi quick-start instructions](https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md) (Actually, I followed [This video on YouTube](https://www.youtube.com/watch?v=8KR0AhDZF2A), but the directions are largely the same, I just found the video nice to see what to expect for results from each command). 

There's no backend for Calla. All communication goes through Jitsi, even the data specific to the "game" is serialized through Jitsi. Eventually, I'd like to setup a backend, but for the basics of spatializing Jitsi, it's not necessary.
