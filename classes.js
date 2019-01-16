//Objeto JSON HV
class HV {
    constructor(peso, volume, vig){
        this.peso = peso;
        this.vig = vig;
        this.volume = volume;
        this.na20 = 3.4;
        this.ca10 = 9.0;

    }

    getPeso(){
        return this.peso;
    }

    getVIG(){
        return this.vig;
    }

    getVolume(){
        return this.volume;
    }

    setNa(dose) {
        this.na = dose;
    }

    getNa() {
        return this.na;
    }

    setCa(dose) {
        this.ca = dose;
    }

    getCa() {
        return this.ca;
    }

    setK(dose) {
        this.k = dose;
    }

    getK() {
        return this.k;
    }

    setMg(dose) {
        this.mg = dose;
    }

    getMg() {
        return this.mg;
    }

    setCK(sel_k) {
        switch (sel_k) {
            case 0:
                this.cK = 1.34;  //KCl 10%
                break;

            case 1:
                this.cK = 2.56;  //KCl 19,1%
                break;

            default:
                this.cK = 2.56;
                break;
        };
    }


    setCMg(sel_mg) {
        switch (sel_mg) {
            case 0:
                this.cMg = 0.8;  //MgSO4 10%
                break;

            case 1:
                this.cMg = 4.0;  //MgSO4 50%
                break;

            default:
                this.cMg = 4.0;
                break;
        };
    }

    //Cálculo do volume de eletrólitos
    volNa() {
        return this.peso * this.na / this.na20;
    }

    volCa() {
        return this.peso * this.ca;
    }

    volK() {
        return this.peso * this.k / this.cK;
    }

    volMg() {
        return this.peso * this.mg / this.cMg;
    }

    //Volume de cálculo
    volumeCalculo() {
        return this.peso * this.volume;
    }

    //Concentração Teórica
    concentracaoTeorica() {
        var gr_glicose = 1.44 * this.peso * this.vig;
        return (100 * gr_glicose) / this.volumeCalculo();
    }

    //Concentração Real
    concentracaoReal() {
        return (this.volumeGlic10()*0.1 + this.volumeGlic50()*0.5 + this.volumeGlic5()*0.05)/
            this.volumeTotal();
    }

    //Volume de glicose a 50%
    volumeGlic50() {
        var resultado = 0.0;
        if (this.concentracaoTeorica() > 5.0){
            resultado = (this.volumeCalculo() * (this.concentracaoTeorica() - 5.0) )/ 45;
        }

        return resultado;
    }

    //Volume de glicose a 10%
    volumeGlic10() {
        return (this.peso * this.vig * 1.44) * 10;
    }

    //Volume de glicose a 5%
    volumeGlic5() {
        var resultado = 0.0;
        if (this.concentracaoTeorica() > 5.0){
            resultado = this.volumeCalculo() - this.volumeGlic50()
        }
        return resultado;
    }

    volumeABD() {
        var resultado = 0.0;

        if (this.concentracaoTeorica() < 5.0){
            resultado = this.volumeCalculo() - (this.volumeGlic50() + this.volNa() + this.volCa()
                + this.volK() + this.volMg());
        }
        return resultado;
    }

    volumeTotal(sel_glic) {
        var vt = 0;

        switch (sel_glic) {
            case 0:  //Glicose 50 + SG 5%
                vt = this.volumeGlic5() + this.volumeGlic50() + this.volumeABD() +
                    this.volNa() + this.volK() + this.volCa() + this.volMg();
                break;

            case 1:  //Glicose 10%
                vt = this.volumeGlic10() + this.volumeABD() +
                    this.volNa() + this.volK() + this.volCa() + this.volMg();
                break;

            default:
                vt = this.volumeGlic5() + this.volumeGlic50() + this.volumeABD() +
                    this.volNa() + this.volK() + this.volCa() + this.volMg();
                break;
        }

    }

    toJSON() {
        var arq = new Object()

        arq.peso = this.peso;
        arq.volume = this.volume;
        arq.vig = this.vig;
        arq.concentracaoTeorica = this.concentracaoTeorica();
        arq.concentracaoReal = this.concentracaoReal();
        arq.vGlic5 = this.volumeGlic5();
        arq.vGlic10 = this.volumeGlic10();
        arq.vGlic50 = this.volumeGlic50();
        arq.vABD = this.volumeABD();
        arq.vCa = this.volCa();
        arq.vNa = this.volNa();
        arq.vK = this.volK();
        arq.vMg = this.volMg();
        arq.volTotal = this.volumeTotal();

        return JSON.stringify(arq);
    }
}



function calcular(){
    //Captura os valores dos campos
    var txt_peso = parseFloat(document.getElementById('hv_peso').value);
    var txt_volume = parseFloat(document.getElementById('hv_volume').value);
    var txt_vig = parseFloat(document.getElementById('hv_vig').value);
    var dose_na = parseFloat(document.getElementById('hv_na').value);
    var dose_k = parseFloat(document.getElementById('hv_k').value);
    var dose_ca = parseFloat(document.getElementById('hv_ca').value);
    var dose_mg = parseFloat(document.getElementById('hv_mg').value);

    //Inicializa o objeto
    var new_hv = new HV(txt_peso, txt_volume, txt_vig);

    //Seta as doses
    new_hv.setCK(1);
    new_hv.setCMg(1);
    new_hv.setNa(dose_na);
    new_hv.setK(dose_k);
    new_hv.setCa(dose_ca);
    new_hv.setMg(dose_mg);

    alert(new_hv.toJSON());
}


