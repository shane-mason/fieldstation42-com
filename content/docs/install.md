Title: Install FieldStation42
Slug: docs/install
Summary: Get FieldStation42 running on your system in about ten minutes.

You'll need a Linux computer (including Raspberry Pi) with an internet connection. If you're using Windows, FieldStation42 works great under [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

Once finished here, move on to [Add Station Content](/docs/add-content/).

## Install Dependencies

Open a terminal and run the following commands. When prompted for your password, that's normal. `sudo` runs commands with administrator privileges.

**MPV** handles video playback:

```bash
sudo apt-get install mpv
```

Quick test to make sure it works. Try playing any video file you have:

```bash
mpv /path/to/any/video.mp4
```

If a video window pops up, you're good. Press `q` to close it.

**Python 3.10 or newer** runs FieldStation42 itself:

```bash
sudo apt-get install python3 python3-pip python3-venv
```

**Ubuntu and Linux Mint users** also need one extra package:

```bash
sudo apt install python3-tk
```

## Download FieldStation42

Run this to download the project:

```bash
git clone https://github.com/shane-mason/FieldStation42
```

This creates a `FieldStation42` folder. Move into it:

```bash
cd FieldStation42
```

All commands from here on should be run from inside this folder.

## Run the Installer

```bash
bash install.sh
```

The installer sets up everything FieldStation42 needs to run. When it finishes, you'll see `runtime` and `catalog` folders appear. Those are for later steps.

If you see *"Virtual environment does not contain activate script"*, double-check that the Python packages from the first step installed correctly, then run `bash install.sh` again.

## Before You Run FieldStation42

Every time you sit down to use FieldStation42, you'll need to activate its environment first. This is a one-line command that tells your terminal to use FieldStation42's software:

```bash
source env/bin/activate
```

You'll know it worked when you see `(env)` appear at the start of your terminal prompt.

If you'd rather not type this every time, you can make it happen automatically when you open a terminal:

```bash
echo '. ~/FieldStation42/env/bin/activate' >> ~/.bashrc
```

To update FieldStation42 later, run this from inside the `FieldStation42` folder:

```bash
git pull
```

## Raspberry Pi Tips

Raspberry Pi works great with FieldStation42. A few things to know:

- Use **Bookworm OS** for best results. A fresh install is recommended.
- **Trixie** support is in progress. If video won't display, run these commands to create a config file that fixes it:

```bash
mkdir -p ~/.config/mpv
echo -e "vo=gpu\ngpu-api=opengl" > ~/.config/mpv/mpv.conf
```
