A dotfiles init config for Mac OS by Sergio G Cosgaya using NodeJS and Typescript.

## Features

- Configure Mac OS settings, e.g. scroll direction, finder settings, etc.
- Install applications and other software at once using [brew](https://brew.sh/index_es).
- Backup and/or restore applications settings as well as ssh, terminal and other setup using [mackup](https://github.com/lra/mackup).
- Config automatically all terminal related setup using zsh, powerline icons, etc.
- Configure Github SSH keys to enable cloning, fetching and pushing repositories with a GPG key.
- Backup and/or restore the config from/to Dropbox to keep multiple devices on sync.

## Installation

1. Clone the repository.
2. Download the 2 zip files (e.g. Dropbox) and override the fake ones.
3. Make a fake sudo command (e.g. sudo ls -l) to be able to install brew, etc.
4. Install the packages using the correct version of node (check *.nvmrc*):
    `yarn install`


## Usage

There are two scripts available:

`yarn start`: Installs everything (or update) and setups all configs defined.

`yarn apps-config`: Restore or backup the applications settings in dropbox.

#### Config backup

The config backup will be written in a `.dotfiles` directory inside the Dropbox folder, i.e. *$HOME/Dropbox/*. If you want to use another cloud app or Dropbox is installed somewhere else, change it before.

**Backup process performs:**

- Empties the `backup` folder inside `.dotfiles` directory (if a previous restore exists).
- Creates and copies the backup inside the `backup` directory.
- Zips the `backup` folder in a file named with current date and time.
- Zips the `backup` folder in a file named `last-backup.zip`.

**Restoring the settings:**

The restore process needs to fetch a zipped backup from internet (the backup folder created in the restore process above). The process will try to get the url to fetch it by reading the file *src/backup/files/config_dropbox_url.txt* (that file should only contain one line with the url).

You can use a zip file with password to protect the txt file. If the txt file is not found, the process will try to unzip the file *src/backup/files/config_dropbox_url.zip*, prompting the password if needed.

ℹ️ I know this is not the best approach, but it was the only way I found to keep my dotfiles public without sharing my personal or sensitive data.

⚠️ The zips in the repo are fake zips, don't try to hack them 🥺.
#### Github keys

In order to import Github ssh_keys, the following files should be added inside *src/dev/files/*:

- `github_id_rsa`: Private SSH key related to public key added into Github settings.
- `github_id_rsa.pub`: Public SSH key added into Github settings.
- `github-gpg-private-key`: The GPG key added into Github settings.

Inside that directory you can zip with password those files into a `github_keys.zip` file. The program will ask for the password when processing it.
