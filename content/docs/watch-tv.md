Title: Watch TV
Slug: docs/watch-tv
Summary: Start the FieldStation42 player and change channels.

You've made it! Time to turn on the TV.

## Start the Player

Make sure you've activated the virtual environment (you should see `(env)` in your prompt), then start the player:

```bash
source env/bin/activate
python3 field_player.py
```

A video window will appear and start playing the scheduled content for your first channel. If nothing plays, double-check that you've built the catalog and generated a schedule in the [previous step](/docs/generate-schedules/).

## Change Channels

The player starts a web server on port 4242 by default, which gives you a few ways to flip channels:

**From a web browser** -- visit any of these URLs (swap `localhost` for the machine's IP if you're on a different device):

- `http://localhost:4242/player/channels/up` -- channel up
- `http://localhost:4242/player/channels/down` -- channel down
- `http://localhost:4242/player/channels/42` -- jump to channel 42

**From the command line:**

```bash
echo '{"command": "direct", "channel": 3}' > runtime/channel.socket
```

The player watches that file for commands. You can also use `"command": "up"` or `"command": "down"` to flip through channels.

## Remote Control

FieldStation42 includes a built-in web remote you can use from your phone or any browser. See the [Web Remote guide](/docs/reference/web-remote/) for setup.

For deeper integration with scripts and external apps, check out the [Web Console and API](/docs/reference/web-console/).
