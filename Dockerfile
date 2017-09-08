FROM ubuntu:latest

MAINTAINER Richard Berger <richard.berger@outlook.com>

RUN apt update && apt install -y wget build-essential cmake git python


RUN groupadd -g 114 jenkins
RUN useradd -u 106 -g 114 -ms /bin/bash jenkins
RUN mkdir -p /app

USER jenkins

RUN wget -qO /tmp/emsdk-portable.tar.gz https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz && \
    tar xvzf /tmp/emsdk-portable.tar.gz -C /home/jenkins && rm /tmp/emsdk-portable.tar.gz

RUN cd /home/jenkins/emsdk-portable && \
    ./emsdk update && \
    ./emsdk install latest && \
    ./emsdk activate latest

ENV PATH /home/jenkins/emsdk-portable:/home/jenkins/emsdk-portable/clang/e1.37.21_64bit:/home/jenkins/emsdk-portable/node/4.1.1_64bit/bin:/home/jenkins/emsdk-portable/emscripten/1.37.21:$PATH
ENV EMSDK /home/jenkins/emsdk-portable
ENV BINARYEN_ROOT /home/jenkins/emsdk-portable/clang/e1.37.21_64bit/binaryen

ENV EMSCRIPTEN /home/jenkins/emsdk-portable/emscripten/1.37.21


RUN emsdk activate

ENV EM_CONFIG=/home/jenkins/.emscripten

CMD /bin/bash
