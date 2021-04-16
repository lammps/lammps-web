/* ----------------------------------------------------------------------
   LAMMPS - Large-scale Atomic/Molecular Massively Parallel Simulator
   http://lammps.sandia.gov, Sandia National Laboratories
   Steve Plimpton, sjplimp@sandia.gov
   
   Copyright (2003) Sandia Corporation.  Under the terms of Contract
   DE-AC04-94AL85000 with Sandia Corporation, the U.S. Government retains
   certain rights in this software.  This software is distributed under
   the GNU General Public License.
   
   See the README file in the top-level LAMMPS directory.
------------------------------------------------------------------------- */
#include <cstring>
#include <iostream>
#include <sstream>
#include <vector>
#include <cstring>

#include <fix_atomify.h>
#include <modify.h>
#include <lammps.h>
#include <library.h>

using namespace LAMMPS_NS;
using namespace std;

typedef void (*FnPtr)(void *, int);
struct Box {
    double boxlo[3];
    double boxhi[3];
    double xy;
    double yz;
    double xz;
    int periodicity[3];
    int box_change;
};

FnPtr callback;
Box box;
LAMMPS *lammps = nullptr;

extern "C" {
void* reset() {
    if(lammps) {
        lammps_close((void*)lammps);
        lammps = nullptr;
    }
    lammps = (LAMMPS*)lammps_open_no_mpi(0, 0, nullptr);
    return lammps;
}

void addAtomifyFix()
{
    if(!lammps) {
        printf("Error, could not add fix atomify since LAMMPS object is not created");
        exit(0);
    }

    lammps_command(lammps, "fix atomify all atomify");
    
    int ifix = lammps->modify->find_fix("atomify");
    if (ifix < 0) {
        printf("Error, could not create fix atomify");
        exit(1);
    }
    FixAtomify *fix = static_cast<FixAtomify*>(lammps->modify->fix[ifix]);
    fix->set_callback(callback, nullptr);
}

void setCallback(FnPtr cb) {
    callback = cb;
}

int numberOfAtoms() {
    return lammps_get_natoms(lammps);
}

bool active() {
    return lammps != 0;
}

double systemSizeX() {
    lammps_extract_box((void*)lammps, box.boxlo, box.boxhi, &box.xy, &box.yz, &box.xz, box.periodicity, &box.box_change);
    return box.boxhi[0]-box.boxlo[0];
}

double systemSizeY() {
    lammps_extract_box((void*)lammps, box.boxlo, box.boxhi, &box.xy, &box.yz, &box.xz, box.periodicity, &box.box_change);
    return box.boxhi[1]-box.boxlo[1];
}

double systemSizeZ() {
    lammps_extract_box((void*)lammps, box.boxlo, box.boxhi, &box.xy, &box.yz, &box.xz, box.periodicity, &box.box_change);
    return box.boxhi[2]-box.boxlo[2];
}

double **x() {
    return (double**)lammps_extract_atom((void*)lammps, "x");
}

double **v() {
    return (double**)lammps_extract_atom((void*)lammps, "v");
}

double **f() {
    return (double**)lammps_extract_atom((void*)lammps, "f");
}

double *positions() {
    return x()[0];
}

void runCommands(const char *commands) {
    if(!lammps) {
        reset();
    }

    lammps_commands_string((void*)lammps, commands);
}

void runDefaultScript() {
    const char * defaultScript = 
        "# 3d Lennard-Jones melt\n"
        "variable    x index 1\n"
        "variable    y index 1\n"
        "variable    z index 1\n"
        "variable    xx equal 20*$x\n"
        "variable    yy equal 20*$y\n"
        "variable    zz equal 20*$z\n"
        "units       lj\n"
        "atom_style  atomic\n"
        "lattice     fcc 0.8442\n"
        "region      box block 0 ${xx} 0 ${yy} 0 ${zz}\n"
        "create_box  1 box\n"
        "create_atoms    1 box\n"
        "mass        1 1.0\n"
        "velocity    all create 1.44 87287 loop geom\n"
        "pair_style  lj/cut 2.5\n"
        "pair_coeff  1 1 1.0 1.0 2.5\n"
        "neighbor    0.3 bin\n"
        "neigh_modify    delay 0 every 20 check no\n"
        "fix     1 all nve\n"
        "run     10\n"
        "run     100\n";

    runCommands(defaultScript);
}

}
