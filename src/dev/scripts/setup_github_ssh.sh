#!/bin/bash

cd src/dev/
mkdir -p ~/.ssh/
cd files
cp github_id_rsa github_id_rsa.pub ~/.ssh/

cd ~/.ssh/
chown $USER ~/.ssh/github_id_rsa*
chmod 600 ~/.ssh/github_id_rsa
chmod 644 ~/.ssh/github_id_rsa.pub

eval "$(ssh-agent -s)"
ssh-add -K ~/.ssh/github_id_rsa
