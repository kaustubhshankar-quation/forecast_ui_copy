import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as images from '../../assets/images';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/css/frontpage.css";

function PrevArrow({ onClick }) {
  return (
    <button type="button" className="de-fs-arrow de-fs-prev" onClick={onClick} aria-label="Previous">
      <ChevronLeft size={20} strokeWidth={2.5} />
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button type="button" className="de-fs-arrow de-fs-next" onClick={onClick} aria-label="Next">
      <ChevronRight size={20} strokeWidth={2.5} />
    </button>
  );
}

export default function FeaturesSlider() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow:2,
    slidesToScroll: 2,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    className:'features-slider',
    dotsClass:'slick-dots-cust'    
  };
  return (
    <Slider {...settings}>
         <li>
                    <div className="sec3box1">
                          <img src={images.feicon1} className="max" alt="Demand Edge"></img>
                          <h2>Integrated with<br /> Postgres Database</h2>
                          <p>Seamless integration with Postgres database for secure, efficient, and scalable data storage.</p>
                          <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                    </div>
                  </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon2} className="max" alt="Demand Edge"></img>
                            <h2>Automatic Feature<br /> Selection</h2>
                            <p>Let our engine do the heavy lifting! Automatically select relevant features to streamline your forecasting process..</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon3} className="max" alt="Demand Edge"></img>
                            <h2>Data<br /> Selection</h2>
                            <p>Intuitively select training and validation time periods to tailor the forecasting engine to your unique needs.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon4} className="max" alt="Demand Edge"></img>
                            <h2>Data<br /> Validation</h2>
                            <p>Ensure data integrity with dynamic validation checks, ensuring sufficient data points for each product-date-store or hierarchical combination.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon5} className="max" alt="Demand Edge"></img>
                            <h2>Granularity<br /> Selection</h2>
                            <p>Choose your preferred granularity—whether daily, weekly, or monthly—with automatic adaptation to available data points for accurate forecasts.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon6} className="max" alt="Demand Edge"></img>
                            <h2>Feature<br /> Engineering</h2>
                            <p>Elevate your forecasting accuracy with advanced feature engineering capabilities for a more nuanced analysis.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon7} className="max" alt="Demand Edge"></img>
                            <h2>Model<br /> Selection</h2>
                            <p>Harness the power of diverse models including ARIMA, TBAT, NBEATS, LightGBM, XGBoost, CatBoost, Holt Winters, TSLM, and more.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon8} className="max" alt="Demand Edge"></img>
                            <h2>Deploy As<br /> Workflows</h2>
                            <p>Seamlessly deploy selected models as workflows, creating a smooth and efficient forecasting pipeline.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon9} className="max" alt="Demand Edge"></img>
                            <h2>Schedule Refit<br /> Or Forecasting</h2>
                            <p>Schedule refit or forecasting tasks to ensure your models stay up-to-date and aligned with evolving data patterns.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon10}  className="max" alt="Demand Edge"></img>
                            <h2>Evaluation <br />Metrics</h2>
                            <p>Evaluate performance with key metrics like RMSE, MAPE, and MAE for training, validation, and moving test datasets in production.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
                    <li>
                      <div className="sec3box1">
                            <img src={images.feicon11} className="max" alt="Demand Edge"></img>
                            <h2>Auto-refresh <br />Test Metrics</h2>
                            <p> Stay informed with auto-refreshed test metrics, providing real-time insights into model performance during production.</p>
                            <div className="readmorebtn"><a href="#" aria-label="DE">Get Started <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
                      </div>
                    </li>
    </Slider>
  );
}