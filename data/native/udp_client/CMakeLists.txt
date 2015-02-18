cmake_minimum_required(VERSION 2.8)

if(NOT BOOST_DIR)
  message(FATAL_ERROR "Boost path not given: Use -DBOOST_DIR=<path to boost>")
endif()

project(udp_client)

set(BOOST_LIB_DIR "${BOOST_DIR}/stage/lib")

add_library(${PROJECT_NAME} SHARED "./main.cc" "./udp_client.h")
target_include_directories(${PROJECT_NAME} PRIVATE ${BOOST_DIR})
target_compile_options(${PROJECT_NAME} PRIVATE "-std=c++11")
target_link_libraries(${PROJECT_NAME}
 PRIVATE
  "${BOOST_LIB_DIR}/libboost_filesystem-mt.a"
  "${BOOST_LIB_DIR}/libboost_system-mt.a")
