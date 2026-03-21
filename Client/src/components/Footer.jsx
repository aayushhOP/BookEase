import React from "react";
import { assets } from "../assets/assets";
import { Link } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img
            alt=""
            class="h-11"
            src={assets.bookease}
          />
          <p className="mt-6 text-sm">
            BookEase has been a leading online movie ticket booking platform since 2023, providing a seamless and convenient way for moviegoers to book their tickets.BookEase has become the go-to destination for movie enthusiasts looking to secure their seats in advance. Our commitment to customer satisfaction and our extensive network of partner theaters have made us a trusted name in the industry.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src={assets.googlePlay} alt="google play"
              className="h-9 w-auto"
            />
            <img
              src={assets.appStore} 
              alt="app store"
              className="h-9 w-auto"
            />
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                
                <a href="#">Home</a>
                
                
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91 62028-85694</p>
              <p>aayushkmrk1441.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} ©{" "}
        <a href="https://prebuiltui.com">BookEase</a>. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
