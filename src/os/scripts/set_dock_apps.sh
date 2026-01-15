#!/bin/bash

# Remove all existing Dock items
dockutil --remove all --no-restart

dockutil --add "/Applications/Spark.app" --no-restart
dockutil --add "/Applications/Calendars.app" --no-restart
dockutil --add "/Applications/Slack.app" --no-restart
dockutil --add "/Applications/Microsoft Teams.app" --no-restart

dockutil --add '' --type small-spacer --section apps --no-restart

dockutil --add "/Applications/Google Chrome.app" --no-restart
dockutil --add "/Applications/Safari.app" --no-restart

dockutil --add '' --type small-spacer --section apps --no-restart

dockutil --add "/Applications/Notion.app" --no-restart
dockutil --add "/Applications/ChatGPT.app" --no-restart
dockutil --add "/Applications/Miro.app" --no-restart
dockutil --add "/Applications/Raindrop.io.app" --no-restart

dockutil --add '' --type small-spacer --section apps --no-restart

dockutil --add "/Applications/Sourcetree.app" --no-restart
dockutil --add "/Applications/Visual Studio Code.app" --no-restart
dockutil --add "/Applications/Warp.app" --no-restart
dockutil --add "/Applications/iTerm.app" --no-restart
dockutil --add "/Applications/Warp.app" --no-restart
dockutil --add "/Applications/Termius.app" --no-restart

dockutil --add '' --type small-spacer --section apps --no-restart

dockutil --add "/Applications/1Password.app" --no-restart
dockutil --add "/Applications/App Store.app" --no-restart
dockutil --add "/System/Applications/System Settings.app"
