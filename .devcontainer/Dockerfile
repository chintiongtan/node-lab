FROM mcr.microsoft.com/devcontainers/typescript-node:22

ENV HOME="/home/node"
ENV PNPM_HOME="$HOME/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update \
  && apt-get install -y awscli vim

RUN curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o $HOME/.git-completion.bash \
  && echo "source $HOME/.git-completion.bash" >> $HOME/.zshrc
