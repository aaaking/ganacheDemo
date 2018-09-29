# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.12

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.12.0/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.12.0/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/zhouzhihui/codebase/blockChain/eos

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/zhouzhihui/codebase/blockChain/eos/build

# Utility rule file for eosio.token.

# Include the progress variables for this target.
include contracts/eosio.token/CMakeFiles/eosio.token.dir/progress.make

contracts/eosio.token/CMakeFiles/eosio.token: contracts/eosio.token/eosio.token.wast.hpp
contracts/eosio.token/CMakeFiles/eosio.token: contracts/eosio.token/eosio.token.abi.hpp
contracts/eosio.token/CMakeFiles/eosio.token: contracts/eosio.token/eosio.token.wasm


contracts/eosio.token/eosio.token.wast.hpp: contracts/eosio.token/eosio.token.wast
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Generating eosio.token.wast.hpp"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && echo "const char* const eosio_token_wast = R\"=====(" > /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast.hpp
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && cat /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast >> /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast.hpp
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && echo ")=====\";" >> /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast.hpp

contracts/eosio.token/eosio.token.abi.hpp: contracts/eosio.token/eosio.token.abi
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Generating eosio.token.abi.hpp"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && echo "const char* const eosio_token_abi = R\"=====(" > /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.abi.hpp
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && cat /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.abi >> /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.abi.hpp
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && echo ")=====\";" >> /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.abi.hpp

contracts/eosio.token/eosio.token.wasm: contracts/eosio.token/eosio.token.wast
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Generating WASM eosio.token.wasm"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && /Users/zhouzhihui/codebase/blockChain/eos/build/libraries/wasm-jit/Source/Programs/eosio-wast2wasm /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wasm -n

contracts/eosio.token/eosio.token.wast: contracts/eosio.token/eosio.token.s
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Generating WAST eosio.token.wast"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && /Users/zhouzhihui/codebase/blockChain/eos/build/externals/binaryen/bin/eosio-s2wasm -o /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/eosio.token.wast -s 10240 eosio.token.s

contracts/eosio.token/eosio.token.s: contracts/eosio.token/eosio.token.bc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Generating textual assembly eosio.token.s"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && /usr/local/wasm/bin/llc -thread-model=single -asm-verbose=false -o eosio.token.s eosio.token.bc

contracts/eosio.token/eosio.token.bc: contracts/eosio.token/eosio.token.cpp.bc
contracts/eosio.token/eosio.token.bc: contracts/libc++/libc++.bc
contracts/eosio.token/eosio.token.bc: contracts/musl/libc.bc
contracts/eosio.token/eosio.token.bc: contracts/eosiolib/eosiolib.bc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Linking LLVM bitcode executable eosio.token.bc"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && /usr/local/wasm/bin/llvm-link -only-needed -o eosio.token.bc eosio.token.cpp.bc /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/libc++/libc++.bc /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/musl/libc.bc /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosiolib/eosiolib.bc

contracts/eosio.token/eosio.token.cpp.bc: ../contracts/eosio.token/eosio.token.cpp
contracts/eosio.token/eosio.token.cpp.bc: ../contracts/eosio.token/eosio.token.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/zhouzhihui/codebase/blockChain/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building LLVM bitcode eosio.token.cpp.bc"
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && /usr/local/wasm/bin/clang -emit-llvm -O3 --std=c++14 --target=wasm32 -ffreestanding -nostdlib -nostdlibinc -DBOOST_DISABLE_ASSERTS -DBOOST_EXCEPTION_DISABLE -fno-threadsafe-statics -fno-rtti -fno-exceptions -c /Users/zhouzhihui/codebase/blockChain/eos/contracts/eosio.token/eosio.token.cpp -o eosio.token.cpp.bc -Weverything -Wno-c++98-compat -Wno-old-style-cast -Wno-vla -Wno-vla-extension -Wno-c++98-compat-pedantic -Wno-missing-prototypes -Wno-missing-variable-declarations -Wno-packed -Wno-padded -Wno-c99-extensions -Wno-documentation-unknown-command -I /Users/zhouzhihui/codebase/blockChain/eos/contracts -I /Users/zhouzhihui/codebase/blockChain/eos/externals/magic_get/include -isystem /Users/zhouzhihui/codebase/blockChain/eos/contracts/libc++/upstream/include -isystem /Users/zhouzhihui/codebase/blockChain/eos/contracts/musl/upstream/include -isystem /usr/local/include

eosio.token: contracts/eosio.token/CMakeFiles/eosio.token
eosio.token: contracts/eosio.token/eosio.token.wast.hpp
eosio.token: contracts/eosio.token/eosio.token.abi.hpp
eosio.token: contracts/eosio.token/eosio.token.wasm
eosio.token: contracts/eosio.token/eosio.token.wast
eosio.token: contracts/eosio.token/eosio.token.s
eosio.token: contracts/eosio.token/eosio.token.bc
eosio.token: contracts/eosio.token/eosio.token.cpp.bc
eosio.token: contracts/eosio.token/CMakeFiles/eosio.token.dir/build.make

.PHONY : eosio.token

# Rule to build all files generated by this target.
contracts/eosio.token/CMakeFiles/eosio.token.dir/build: eosio.token

.PHONY : contracts/eosio.token/CMakeFiles/eosio.token.dir/build

contracts/eosio.token/CMakeFiles/eosio.token.dir/clean:
	cd /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token && $(CMAKE_COMMAND) -P CMakeFiles/eosio.token.dir/cmake_clean.cmake
.PHONY : contracts/eosio.token/CMakeFiles/eosio.token.dir/clean

contracts/eosio.token/CMakeFiles/eosio.token.dir/depend:
	cd /Users/zhouzhihui/codebase/blockChain/eos/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/zhouzhihui/codebase/blockChain/eos /Users/zhouzhihui/codebase/blockChain/eos/contracts/eosio.token /Users/zhouzhihui/codebase/blockChain/eos/build /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token /Users/zhouzhihui/codebase/blockChain/eos/build/contracts/eosio.token/CMakeFiles/eosio.token.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : contracts/eosio.token/CMakeFiles/eosio.token.dir/depend
