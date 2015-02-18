#include "udp_client.h"

#include "boost/asio.hpp"

boost::asio::io_service io_service;

extern "C" void Run(CallBack_t cb, const char* log_file_name) {
  std::cerr << "Native Called" << std::endl;
  UdpClient udp_client{io_service, cb, std::string{log_file_name}};
  (void)sizeof(udp_client);

  io_service.run();

  std::cerr << "Native exiting.." << std::endl;
}

extern "C" void Stop() {
  io_service.stop();
}
