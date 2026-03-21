Title: Install FieldStation42
Slug: docs/install
Summary: Get FieldStation42 running on your system — dependencies, cloning, and the install script.

Follow these steps in order. Once finished, move on to [Add Station Content](/docs/add-content/).

## Step 0: Prepare Your System

FieldStation42 runs on any modern Linux distribution, including Raspberry Pi OS and WSL. Start by updating your system and installing the required dependencies.

**MPV** (video playback):

```bash
sudo apt-get install mpv
```

Test that MPV can play a video from the command line before continuing.

**Python 3.10 or newer:**

```bash
sudo apt-get install python3
sudo apt-get install python3-pip
sudo apt-get install python3-venv
```

**Ubuntu users** also need tkinter:

```bash
sudo apt install python3-tk
```

### Raspberry Pi notes

Use **Bookworm OS** for best results. Fresh installations are recommended. Trixie support is in progress — if video won't display on Trixie, create `~/.config/mpv/mpv.conf` with:

```
vo=gpu
gpu-api=opengl
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/shane-mason/FieldStation42
```

Or with GitHub CLI:

```bash
gh repo clone shane-mason/FieldStation42
```

This creates a `FieldStation42` folder. Run all commands from inside that directory — configuration file paths are relative to it.

To stay up to date:

```bash
git pull
```

## Step 2: Run the Install Script

From inside the `FieldStation42` folder:

```bash
bash install.sh
```

This script creates a Python virtual environment, installs all dependencies, and generates the `runtime` and `catalog` folders you'll use going forward.

**Troubleshooting:** If you see *"Virtual environment does not contain activate script"*, install the missing dependencies from Step 0 and re-run the installer.

## Using the Virtual Environment

Activate the environment before running any FieldStation42 commands:

```bash
source env/bin/activate
```

To activate automatically on login, add this line to your `~/.bashrc`:

```bash
. ~/FieldStation42/env/bin/activate
```