#!/bin/bash

cd src/dev/
mkdir -p ~/.ssh/
cd files
cp github_id_rsa github_id_rsa.pub ~/.ssh/

cd ~/.ssh/
chown $USER ~/.ssh/github_id_rsa*
chmod 600 ~/.ssh/github_id_rsa
chmod 644 ~/.ssh/github_id_rsa.pub

cat <<EOF > ~/.ssh/config
Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/github_id_rsa
EOF
chmod 600 ~/.ssh/config

killall ssh-agent 2>/dev/null
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/github_id_rsa
