set(CMAKE_CXX_FLAGS "-s ERROR_ON_UNDEFINED_SYMBOLS=0 -s ASSERTIONS=2 -s RESERVED_FUNCTION_POINTERS=1 -s NO_EXIT_RUNTIME=1 -s DISABLE_EXCEPTION_CATCHING=0 -s TOTAL_MEMORY=512MB -s EXTRA_EXPORTED_RUNTIME_METHODS=\"['cwrap']\" -s EXPORTED_FUNCTIONS=\"['_runCommands', '_addAtomifyFix', '_numberOfAtoms', '_setCallback', '_reset', '_runDefaultScript', '_systemSizeX', '_systemSizeY', '_systemSizeZ', '_positions', '_x', '_v', '_f', '_active', '_lammps_command', '_lammps_commands_string', '_lammps_extract_setting', '_lammps_get_natoms', '_lammps_extract_global', '_lammps_extract_atom', '_lammps_extract_compute', '_lammps_extract_fix', '_lammps_extract_variable', '_lammps_set_variable', '_lammps_get_thermo', '_lammps_has_error', '_lammps_get_last_error_message', '_memset']\"" CACHE STRING "" FORCE)

set(PKG_MC ON CACHE BOOL "" FORCE)
set(PKG_MANYBODY ON CACHE BOOL "" FORCE)
set(PKG_MOLECULE ON CACHE BOOL "" FORCE)

set(LAMMPS_EXCEPTIONS ON CACHE BOOL "" FORCE)
