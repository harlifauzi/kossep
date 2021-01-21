import React, { useEffect } from 'react'
import { ILFarhan, ILHarley, ILKhalish, ILNadya, ILRahma } from '../../assets/illustrations'

const AboutUs = () => {
    useEffect(() => {
        document.title="Kossep | About us"
    }, [])


    return (
        <div className="aboutus-container">
            <h1>Apa sih Kossep itu?</h1>
            <p className="aboutus-deskripsi"><i class='bx bxs-quote-alt-left'></i>Kossep menyediakan kumpulan menu masakah cepat saji yang mudah untuk dibuat. “Jika ada cara mudah untuk bikin makanan enak, kenapa dibuat susah.”
            Situs ini akan membantu kamu mengakses resep makanan yang praktis khususnya kamu yang anak kos!!
            Ayo eksplorasi menu lezat favorit kamu sekarang!<i class='bx bxs-quote-alt-right'></i></p>
            <h1 className="aboutus-ourteam">Our Team</h1>
            <div class="aboutus-card-grid">

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILKhalish} />
                    </div>
                    <p className="aboutus-nama">muhammad khalish</p>
                    <p className="aboutus-job">LEADER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href="https://www.linkedin.com/in/mochammad-khalish-mulyadi-2811b21b4"><i class='bx bxl-linkedin-square'></i></a>
                        <a target="_blank" href="https://www.instagram.com/lizzietrix_"><i class='bx bxl-instagram-alt' ></i></a>
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILRahma} />
                    </div>
                    <p className="aboutus-nama">rahma azizah</p>
                    <p className="aboutus-job">CONCEPT CREATOR</p>
                    <div className="aboutus-social">
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILFarhan} />
                    </div>
                    <p className="aboutus-nama">farhan andika</p>
                    <p className="aboutus-job">UI-DESIGNER</p>
                    <div className="aboutus-social">
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILNadya} />
                    </div>
                    <p className="aboutus-nama">nadya yudho</p>
                    <p className="aboutus-job">UX-DESIGNER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href=">https://www.instagram.com/nadyayum/"><i class='bx bxl-instagram-alt' ></i></a>
                    </div>
                </div>

                <div className="aboutus-card">
                    <div className="aboutus-img-wrapper">
                        <img src={ILHarley}/>
                    </div>
                    <p className="aboutus-nama">harli fauzi ramli</p>
                    <p className="aboutus-job">DEVELOPER</p>
                    <div className="aboutus-social">
                        <a target="_blank" href="https://github.com/harlifauzi"><i class='bx bxl-github'></i></a>
                        <a target="_blank" href="https://www.linkedin.com/in/harli-fauzi-ramli-420217204/"><i class='bx bxl-linkedin-square'></i></a>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutUs
