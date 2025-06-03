import React from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles
import './HOME.css';
import { Link } from 'react-router-dom';

function HOME() {
    const navigate = useNavigate();

    React.useEffect(() => {
        AOS.init({ offset: 1 });
    }, []);

    const handleVisitClick = () => {
        navigate('/shop');
    };

    return (
        <div>
            <nav>
                <div className="shark">
                    <div className="search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </nav>
            <section>
                <div className="content">
                    <div className="main-content">
                        <h1 data-aos="fade-right" data-aos-duration="2000">STORE</h1>
                        <h2 data-aos="fade-left" data-aos-duration="2000" data-aos-delay="200">YOUZEX SPORT</h2>
                        <h4 data-aos="fade-right" data-aos-duration="2000" data-aos-delay="400">BEST SPORTS STORE</h4>
                        <p data-aos="flip-down" data-aos-duration="2000" data-aos-delay="600">
                        Discover our premium collection of sport shoes tailored for every athlete. Whether you’re hitting the gym, running marathons, or enjoying outdoor adventures, we’ve got the perfect pair for you
                        </p>
                        <div className="order">
                                <button onClick={handleVisitClick}>V I S I T</button> 
                            
                        </div>
                    </div>
                    <div className="image">
                        <img src="/assets/products/pngegg.png" data-aos="zoom-in" data-aos-duration="2000" alt="Product" /> {/* Corrected path */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HOME;