#!/bin/bash
docker run -v $PWD:/workdir -ti lammps/lammps-web ./build.sh
