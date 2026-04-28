import SliderImport from "react-slick";

const Slider = SliderImport.default || SliderImport;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DealCard from "./DealCard";

const Deal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoPlay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <div className="">
      <div className="slide-container">
        <Slider {...settings}>
          {[1,2,3,4,5].map((item, index) => <div className="flex flex-col w-60" key={index}>
            <DealCard deal={{image:"https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D", discount:"10"}} />
          </div>)}
        </Slider>
      </div>
    </div>
  );
};

export default Deal;
