#!/bin/bash

source /opt/emsdk/emsdk_env.sh

if [ ! -e lammps ]
then
    git clone --depth=1 https://github.com/lammps/lammps.git
fi

cp cpp/* lammps/src/

mkdir -p build
cd build

emcmake cmake ../lammps/cmake
emcmake cmake -C ../preset.cmake .
emmake make -j 2

cp lmp.js lmp.wasm ../web/js/

cd ../web

npm install

export PATH=$(npm bin):$PATH

grunt build
