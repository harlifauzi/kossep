import React from "react";
import {
    BuatAkun,
    Masuk,
    HalamanUtama,
    BuatResep,
    LihatResep,
    HalamanAkun,
    HalamanAkunLain,
    HalamanEksplor,
    PengaturanAkun,
    Recook,
    AboutUs,
} from '../../pages';
import { Switch, Route } from 'react-router-dom';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/halamanutama/:key" component={HalamanUtama} />
            <Route path="/buatakun" component={BuatAkun} />
            <Route path="/masuk" component={Masuk} />
            <Route path="/buatresep" component={BuatResep} />
            <Route path="/lihatresep/:key" component={LihatResep} />
            <Route path="/halamanakun/:key" component={HalamanAkun} />
            <Route path="/halamanakunlain/:key" component={HalamanAkunLain} />
            <Route path="/halamaneksplor/:key" component={HalamanEksplor} />
            <Route path="/pengaturanakun/:key" component={PengaturanAkun} />
            <Route path="/recook/:key" component={Recook} />
            <Route path="/aboutus" component={AboutUs} />
        </Switch>
    );
};

export default Routes;
