#!/bin/bash
# Install Prezo if it isn't already present
  if [[ ! -d $HOME/.zprezto/ ]]; then
    git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"

    # TODO The following commands fail under this bash script, but they work if you run them manually on terminal
    setopt EXTENDED_GLOB

    # The following command fails on Linux, command substitution: syntax error near unexpected token '.N'
    for rcfile in `${ZDOTDIR:-$HOME}/.zprezto/runcoms/^README.md(.N)`; do
      ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
    done

    # Installing the powerlevel9k theme
    # git clone https://github.com/bhilburn/powerlevel9k.git  ~/.zprezto/modules/prompt/external/powerlevel9k

    # If we want to uninstall it, just remove the ~/.zprezto folder
  else
    cd $HOME/.zprezto/
    git pull && git submodule update --init --recursive
  fi
