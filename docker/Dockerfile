FROM ubuntu:latest

MAINTAINER Richard Berger <richard.berger@outlook.com>

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y wget build-essential cmake git python3 npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN cd /opt && git clone https://github.com/emscripten-core/emsdk.git && \
    cd /opt/emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest

RUN npm install -g bower

RUN mkdir -p /workdir

WORKDIR /workdir
