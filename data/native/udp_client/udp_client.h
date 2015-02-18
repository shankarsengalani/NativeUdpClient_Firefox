#ifndef UDP_CLIENT_H
#define UDP_CLIENT_H

#include <fstream>
#include <iostream>
#include <boost/asio.hpp>

using CallBack_t = void(*)(const char*);

class UdpClient {
  enum {
    MAX_SIZE_IN_BYTES = 512,
    SELF_PORT = 40010,
    PEER_PORT = 40000,
  };

 public:
  UdpClient(boost::asio::io_service& io_service, CallBack_t cb, const std::string& log_file_name)
      : io_service_{io_service},
        cb_{cb},
        fs_{log_file_name, std::ios_base::trunc | std::ios_base::out | std::ios_base::binary} {
    if (fs_) {
      fs_ << "Data Received from UDP Server\n"
             "=============================\n";
    }
    start_write(boost::system::error_code{});
  }

 private:
  void start_read() {
    socket_.async_receive_from(
          boost::asio::buffer(rx_data_, MAX_SIZE_IN_BYTES), remote_ep_,
          [this](const boost::system::error_code& e, std::size_t bytes_rxd) {
      read_handler(e, bytes_rxd);
    });
  }

  void read_handler(const boost::system::error_code& e, std::size_t bytes_rxd) {
    if(e) {
      std::cerr << "Error in read_handler: " << e.message() << std::endl;
      io_service_.stop();
    }
    else {
      std::string rx_data(rx_data_, bytes_rxd);
      std::cerr << "Rx Data from {" << remote_ep_.address().to_string() << ", "
                << remote_ep_.port() << "} (" << bytes_rxd << "B): " << rx_data
                << std::endl;

      if (fs_) {
        fs_ << "<Data for datagram: " << packet_number_ - 1 << ">: " << rx_data << '\n';
      }

      if (cb_) {
        cb_(rx_data.c_str());
      }

      if(packet_number_ > 10) {
        std::cerr << "Enough sent. Terminating ..." << std::endl;
        io_service_.stop();
      }
      else {
        timer_.expires_from_now(boost::posix_time::seconds{3});
        timer_.async_wait([this](const boost::system::error_code& e){start_write(e);});
      }
    }
  }

  void start_write(const boost::system::error_code& e) {
    if(e) {
      std::cerr << "Error in timer timeout: " << e.message() << std::endl;
      io_service_.stop();
    }
    else {
      tx_data_ = "Datagram: " + std::to_string(packet_number_++);
      std::cerr << "Sending Data: " << tx_data_ << std::endl;
      socket_.async_send_to(
            boost::asio::buffer(tx_data_), remote_ep_,
            [this](const boost::system::error_code& e, std::size_t bytes_txd) {
        write_handler(e, bytes_txd);
      });
    }
  }

  void write_handler(const boost::system::error_code& e, std::size_t bytes_txd) {
    if(e) {
      std::cerr << "Error in write_handler: " << e.message() << std::endl;
      io_service_.stop();
    }
    else {
      std::cerr << "Tx Data (" << bytes_txd << "B): " << tx_data_ << std::endl;
      start_read();
    }
  }

 private:
  boost::asio::io_service& io_service_;
  CallBack_t cb_{nullptr};
  std::fstream fs_;

  boost::asio::ip::udp::socket socket_{
    io_service_,
    boost::asio::ip::udp::endpoint{
      boost::asio::ip::address_v4::any(),
      SELF_PORT
    }
  };

  boost::asio::ip::udp::endpoint remote_ep_{
    boost::asio::ip::udp::endpoint{
      boost::asio::ip::address_v4::any(),
      PEER_PORT
    }
  };

  char rx_data_[MAX_SIZE_IN_BYTES];
  std::string tx_data_;
  std::size_t packet_number_{};
  boost::asio::deadline_timer timer_{io_service_};
};

#endif // UDP_CLIENT_H
