import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory";
import Grid from "./Grid/Grid";
import Deal from "../Deal/Deal";
import HomeCategory from "./HomeCategory/HomeCategory";
import { API_URL } from "../../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<any>(null);

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

  return (
    <div className="space-y-10 pb-16">
      {/* Category Icons Bar */}
      <ElectronicCategory items={homeData?.electricCategories} />

      {/* Grid Banner Layout */}
      <section className="mt-6">
        <Grid items={homeData?.grid} />
      </section>

      {/* Deals Carousel Slider */}
      <section className="pt-6">
        <h1 className="text-3xl font-black text-center pb-5 text-gray-800">
          Today's Deals
        </h1>
        <Deal deals={homeData?.deals} />
      </section>

      {/* Circular Shop by Category */}
      <section className="pt-6">
        <h1 className="text-3xl font-black text-center pb-5 text-gray-800">
          Shop By Category
        </h1>
        <HomeCategory items={homeData?.shopByCategories} />
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