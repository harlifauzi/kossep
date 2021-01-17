import React from 'react'
import { ILFarhan, ILHarley, ILKhalish, ILNadya, ILRahma } from '../../assets/illustrations'

const AboutUs = () => {
    return (
        <div className="aboutus-container">
            <h1>OUR TEAM</h1>
            <div class="aboutus-card-grid">
                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILFarhan} />
                    </div>
                    <p className="aboutus-nama">farhan andika</p>
                    <p className="aboutus-job">BACKEND DEVELOPER</p>
                    <div className="aboutus-social">
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILHarley}/>
                    </div>
                    <p className="aboutus-nama">harli fauzi ramli</p>
                    <p className="aboutus-job">BACKEND DEVELOPER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href="https://github.com/harlifauzi"><i class='bx bxl-github'></i></a>
                        <a target="_blank" href="https://www.linkedin.com/in/harli-fauzi-ramli-420217204/"><i class='bx bxl-linkedin-square'></i></a>
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILKhalish} />
                    </div>
                    <p className="aboutus-nama">muhammad khalish</p>
                    <p className="aboutus-job">BACKEND DEVELOPER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href="https://www.linkedin.com/in/mochammad-khalish-mulyadi-2811b21b4"><i class='bx bxl-linkedin-square'></i></a>
                        <a target="_blank" href="https://www.instagram.com/lizzietrix_"><i class='bx bxl-instagram-alt' ></i></a>
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILNadya} />
                    </div>
                    <p className="aboutus-nama">nadya yudho</p>
                    <p className="aboutus-job">FRONTEND DEVELOPER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href=">https://www.instagram.com/nadyayum/"><i class='bx bxl-instagram-alt' ></i></a>
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILRahma} />
                    </div>
                    <p className="aboutus-nama">rahma azizah</p>
                    <p className="aboutus-job">FRONTEND DEVELOPER</p>
                    <div className="aboutus-social">
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutUs
