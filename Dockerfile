FROM ubuntu:latest

MAINTAINER Richard Berger <richard.berger@outlook.com>

RUN apt update && apt install -y wget build-essential cmake git python3

RUN cd /opt && git clone https://github.com/emscripten-core/emsdk.git && \
    cd /opt/emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest

RUN apt install -y npm

RUN npm install -g bower

RUN mkdir -p /workdir

WORKDIR /workdir
