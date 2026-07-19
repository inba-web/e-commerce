import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CachedIcon from "@mui/icons-material/Cached";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import SliderImport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ElectronicCategory from "./ElectronicCategory/ElectronicCategory";
import Grid from "./Grid/Grid";
import Deal from "../Deal/Deal";
import HomeCategory from "./HomeCategory/HomeCategory";
import { API_URL } from "../../../context/AuthContext";

const Slider = SliderImport.default || SliderImport;

const heroBanners = [
  {
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop",
    title: "MEGA SHOPPING FESTIVAL",
    subtitle: "Up to 80% OFF on Top Brands & Categories",
    cta: "Shop Now"
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
    title: "ELECTRONICS CARNIVAL",
    subtitle: "Latest Smartphones, Laptops & Accessories at Unbeatable Prices",
    cta: "Explore Deals"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
    title: "FASHION & APPAREL BLOWOUT",
    subtitle: "Elevate your wardrobe with premium brands starting from just ₹299",
    cta: "View Catalog"
  }
];

// Custom Arrow Components for Slick
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-md hidden sm:flex"
      aria-label="Next slide"
    >
      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-md hidden sm:flex"
      aria-label="Previous slide"
    >
      <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(`${API_URL}/home`);
        setHomeData(response.data);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      }
    };
    fetchHomeData();
  }, []);

  // Ticking Countdown Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        return "00h : 00m : 00s";
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: any) => (
      <div style={{ position: "absolute", bottom: "16px" }}>
        <ul className="flex justify-center gap-2 m-0 p-0">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-colors" />
    )
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Category Icons Bar */}
      <ElectronicCategory items={homeData?.electricCategories} />

      {/* Hero Promotional Banner Slider */}
      <section className="relative w-full overflow-hidden mt-0">
        <div className="select-none relative bg-slate-900">
          <Slider {...heroSettings}>
            {heroBanners.map((banner, index) => (
              <div key={index} className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover brightness-[0.65]"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto w-full px-8 sm:px-16 lg:px-24 text-white space-y-3 sm:space-y-4">
                    <span className="text-teal-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
                      Exclusive Launch
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-md">
                      {banner.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-xl text-gray-200 drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="contained"
                        onClick={() => navigate("/products")}
                        sx={{
                          bgcolor: "#00927c",
                          "&:hover": { bgcolor: "#007d6a" },
                          fontWeight: "bold",
                          textTransform: "none",
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          borderRadius: "8px",
                          boxShadow: "none"
                        }}
                      >
                        {banner.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Grid Banner Layout */}
      <section className="mt-6">
        <Grid items={homeData?.grid} />
      </section>

      {/* Deals Carousel Slider with Real-time Countdown */}
      <section className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-800 tracking-tight">Today's Deals</h2>
          </div>
          <div className="bg-red-50 text-red-600 border border-red-150 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm flex items-center gap-2">
            <span>Deals end in:</span>
            <span className="font-mono text-sm tracking-wider">{timeLeft || "00h : 00m : 00s"}</span>
          </div>
        </div>
        <Deal deals={homeData?.deals} />
      </section>

      {/* Circular Shop by Category */}
      <section className="pt-6">
        <h1 className="text-2xl lg:text-3xl font-black text-center pb-5 text-gray-800">
          Shop By Category
        </h1>
        <HomeCategory items={homeData?.shopByCategories} />
      </section>

      {/* Enterprise Trust Assurances */}
      <section className="lg:px-20 py-10 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
              <LocalShippingIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Free Delivery</h4>
              <p className="text-gray-500 text-xs mt-0.5">On orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
              <PaymentIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Cash on Delivery</h4>
              <p className="text-gray-500 text-xs mt-0.5">Pay at your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
              <CachedIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Easy Returns</h4>
              <p className="text-gray-500 text-xs mt-0.5">7-day hassle-free policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
              <SecurityIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">100% Safe Payments</h4>
              <p className="text-gray-500 text-xs mt-0.5">Secured with SSL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sell Product Banner */}
      <section className="lg:px-20 relative h-[250px] lg:h-[450px] overflow-hidden rounded-xl shadow-lg mx-4 lg:mx-20">
        <img
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600&auto=format&fit=crop"
          alt="Sell Banner"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute top-1/2 left-8 lg:left-24 transform -translate-y-1/2 text-white space-y-4">
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight drop-shadow-md">
            Sell Your Products on Inba Mart
          </h1>
          <p className="text-lg lg:text-2xl font-light max-w-md drop-shadow-sm">
            Reach millions of customers. Zero onboarding fee, high growth platform.
          </p>
          <div className="pt-4">
            <Button
              startIcon={<StorefrontIcon />}
              variant="contained"
              size="large"
              onClick={() => navigate("/seller/login")}
              sx={{
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                fontSize: "1.05rem",
              }}
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;