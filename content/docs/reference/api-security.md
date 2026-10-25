Title: API Security
Slug: docs/reference/api-security
Summary: Protect the FieldStation42 web console and API with an api_key - turning it on and off, logging in, and sending the key from scripts and integrations.

FieldStation42 runs a web server, on port 4242 by default, for the web console, the web remote and any scripts that control the player. Without protection, anyone who can reach that port can use every endpoint, including the ones that list folders on disk and change station configuration.

Setting an `api_key` adds a first line of defense against scanners and unwanted calls on your network.

> **FieldStation42 should never be exposed to the open internet.** Don't port-forward 4242. The key travels unencrypted over your network, so this is basic protection, not real security.

## Turning It On or Off

The key lives in `confs/main_config.json`:

```json
{
  "api_key": "pick-something-long-and-random"
}
```

- **On:** `api_key` is set to a non-empty value.
- **Off:** there's no `api_key`, or it's empty (`"api_key": ""`). Everything stays open, and the server logs a warning at startup.
- **Restart FieldStation42 after changing the key.** `main_config.json` is only read at startup.

Any string works, but a short key is easy to guess, and the server warns about keys under 12 characters. To generate a good one:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(16))"
```

### New Installs

On a new install, the installer turns security on. It writes a random key to `confs/main_config.json` and prints it at the end. To opt out, remove `api_key` from that file and restart.

### Existing Installs

Nothing changes until you opt in. Either:

- add `api_key` to `confs/main_config.json` yourself and restart, or
- run `bash install.sh` again and answer **yes** when it asks "Enable API security?" The installer writes the new key into `main_config.json`. Your other settings are kept, but the file's formatting may change.

Before you turn it on, update any scripts or integrations that call the API (see [Scripts and Integrations](#scripts-and-integrations) below).

### Docker

When the container starts, it checks the mounted `confs` folder. An empty config folder (a new setup) gets a random key, printed in the container logs (`docker logs fieldstation42`). An existing config folder is left alone; to opt in, add `api_key` to `main_config.json`.

## The Web Console

With security on, the web console and [web remote](/docs/reference/web-remote/) ask for the key once per browser or device, then remember it for a year. Changing the key logs every device out.

For a bookmark, a phone home-screen shortcut or a QR code, this URL logs in with one tap:

```
http://<your-fs42-box>:4242/login?api_key=YOUR_KEY
```

A browser in kiosk mode that shows a single page, such as a [custom guide](/docs/guides/guide-channels/) on a second screen, can carry the key in that page's URL:

```
http://<your-fs42-box>:4242/static/customguide/customguide.html?api_key=YOUR_KEY
```

After 10 wrong keys in 5 minutes, the login page stops accepting attempts from that device for a few minutes.

## Scripts and Integrations

Every request must carry the key, in any one of these three ways:

| Method | Example |
|--------|---------|
| URL parameter | `http://fs42:4242/player/channels/up?api_key=YOUR_KEY` |
| `X-API-Key` header | `X-API-Key: YOUR_KEY` |
| Bearer token | `Authorization: Bearer YOUR_KEY` |

Requests without a valid key get a `401` response:

```json
{"detail": "api key required"}
```

With curl:

```bash
curl -H "X-API-Key: YOUR_KEY" http://fs42:4242/player/status
curl "http://fs42:4242/player/channels/up?api_key=YOUR_KEY"
```

With a Home Assistant `rest_command`:

```yaml
rest_command:
  fs42_channel_up:
    url: "http://fs42:4242/player/channels/up"
    method: get
    headers:
      X-API-Key: !secret fs42_api_key
```

FieldStation42 masks keys in URL parameters (`api_key=***`) in its own access log, but other tools along the way may log them. Use a header where you can.

## FieldStation42's Own Components

These handle the key automatically, with nothing to configure:

- **The web renderer**, which shows web channels, the custom guide, [autobumps](/docs/reference/autobump/), [Pay-Per-View](/docs/reference/ppv/) and diagnostics. It sends the key only to the local FieldStation42 server, never to third-party sites in a web channel.
- **The [remote controller](/docs/guides/remote-control/)** reads the key from `confs/main_config.json`. If it runs on a different machine from FieldStation42, set the `FS42_API_KEY` environment variable.

One caveat: a web channel whose `web_url` points at the box's own network address (for example `http://192.168.1.20:4242/...`) won't get the key. For pages served by FieldStation42 itself, use `http://localhost:4242/...`.

## Managing the Server

The **Manage** page in the web console (formerly About) can restart FieldStation42, stop it, and update it from git. These controls only work when `api_key` is set. Without a key, the `/manage` actions are refused with a `403`, whether you use the page or call the API.

- **Restart** restarts every running `fs42*` systemd user service. It needs FieldStation42 to be [running as a service](/docs/guides/autostart/). When it's started from a terminal, Restart is disabled.
- **Stop** stops every FieldStation42 service except the remote controller, and the web console stays up in *standby* so you can press **Start** later. Because the remote controller keeps running, its power button can also turn FieldStation42 back on. **Start** brings up the same services a boot would (every enabled `fs42*` service). Standby needs the `fs42-standby` service, which is installed by `install/install_services.sh`. On installs set up before it existed, rerun that script. Until then, Stop also shuts down the web console. FieldStation42 then has to be started again with the remote's power button or on the box. If FieldStation42 isn't running as a service, Stop exits the player.
- **Check for Updates** fetches from git and lists the new commits on your branch.
- **Update Now** runs `git pull --ff-only`. It never merges, stashes, or resets. If git can't fast-forward, for example because you have local edits to files the update changes, or your branch has its own commits, nothing is changed. The page shows what git said. Nothing restarts automatically after an update, so restart when you're ready. If `requirements.txt` changed, run `bash install.sh` first.

Update is not available in Docker. To update a container, rebuild the image.

## Other Changes

`/media/json` no longer serves `confs/main_config.json`, whether security is on or off, because that file holds the key and other secrets. Other JSON files are served as before.

## Lost Your Key?

Open `confs/main_config.json` on the FieldStation42 machine and read the `api_key` value.
