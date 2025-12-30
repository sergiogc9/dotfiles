#!/bin/bash

# Remove all existing Dock items
dockutil --remove all --no-restart

# Group 1
dockutil --add "/Applications/Spark.app" --no-restart
dockutil --add "/Applications/Calendars.app" --no-restart

# Separator in apps section
dockutil --add '' --type spacer --section apps --no-restart

# Group 2
dockutil --add "/Applications/Google Chrome.app" --no-restart
dockutil --add "/Applications/Safari.app" --no-restart
dockutil --add "/Applications/Notion.app" --no-restart
dockutil --add "/Applications/Raindrop.app" --no-restart
dockutil --add "/Applications/Sourcetree.app" --no-restart
dockutil --add "/Applications/Visual Studio Code.app" --no-restart
dockutil --add "/Applications/Beekeeper Studio.app" --no-restart
dockutil --add "/Applications/Termius.app" --no-restart
dockutil --add "/Applications/iTerm.app" --no-restart

# Separator
dockutil --add '' --type spacer --section apps --no-restart

# Group 3
dockutil --add "/Applications/Slack.app" --no-restart
dockutil --add "/Applications/1Password.app" --no-restart

# Separator
dockutil --add '' --type spacer --section apps --no-restart

# System group
dockutil --add "/Applications/App Store.app" --no-restart
dockutil --add "/System/Applications/System Settings.app"

# Done — Dock will restart after last command
