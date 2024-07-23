/*
NeoCalcJs
Desenvolvido por Eric Calasans
Copyright © 2019
 */

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
        let gr_glicose = 1.44 * this.peso * this.vig;
        return (100 * gr_glicose) / this.volumeCalculo();
    }

    //Concentração Real
    concentracaoReal(sol_glic) {
        let conc_real = 0;

        switch (sol_glic) {
            case 0:  //Glicose 5%
                conc_real = (this.volumeGlic5()* 0.05 + this.volumeGlic50()*0.5)/this.volumeTotal();
                break;

            case 1:  //Glicose 10%
                conc_real = this.volumeGlic10()*0.1 / this.volumeTotal();

            default:
                conc_real = (this.volumeGlic5()* 0.05 + this.volumeGlic50()*0.5)/this.volumeTotal();
                break;
        }

        return conc_real;
    }

    //Volume de glicose a 50%
    volumeGlic50() {
        let resultado = 0.0;
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
        let resultado = 0.0;
        if (this.concentracaoTeorica() > 5.0){
            resultado = this.volumeCalculo() - this.volumeGlic50()
        }
        return resultado;
    }

    volumeABD() {
        let resultado = 0.0;

        if (this.concentracaoTeorica() < 5.0){
            resultado = this.volumeCalculo() - (this.volumeGlic50() + this.volNa() + this.volCa()
                + this.volK() + this.volMg());
        }
        return resultado;
    }

    volumeTotal(sel_glic) {
        let vt = 0;

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
        return vt;

    }

    toJSON() {
        let arq = new Object()

        arq.peso = this.peso;
        arq.volume = this.volume;
        arq.vig = this.vig;
        arq.concentracaoTeorica = this.concentracaoTeorica().toFixed(1);
        arq.concentracaoReal = this.concentracaoReal(0).toFixed(1);
        arq.vGlic5 = this.volumeGlic5().toFixed(1);
        arq.vGlic10 = this.volumeGlic10().toFixed(1);
        arq.vGlic50 = this.volumeGlic50().toFixed(1);
        arq.vABD = this.volumeABD().toFixed(1);
        arq.vCa = this.volCa().toFixed(1);
        arq.vNa = this.volNa().toFixed(1);
        arq.vK = this.volK().toFixed(1);
        arq.vMg = this.volMg().toFixed(1);
        arq.volTotal= this.volumeTotal(0).toFixed(1);

        return JSON.stringify(arq);
    }
}


class NPT extends HV{
    constructor(peso, volume, vig, aac, lip){
        super(peso, volume, vig);
        this.aac = aac;
        this.lip = lip;
        this.fc = (this.volumeCalculo() + 20) / this.volumeCalculo();
    }

    //Sets e gets
    //Aminoácidos
    getAac(){
        return this.aac;
    }

    setAac(dose_aac){
        this.aac = dose_aac;
    }

    //Lipídios
    getLip(){
        return this.lip;
    }

    setLip(dose_lip){
        this.lip = dose_lip;
    }

    //Fósforo
    setP(dose_p){
        this.p = dose_p;
    }

    getP(){
        return this.p;
    }

    //Vitaminas
    setOpVit(opcao){
        this.optVit = opcao;
    }

    getOptVit(){
        return this.optVit;
    }

    //Oligoelementos
    setOpOligo(opcao){
        this.opOligo = opcao;
    }

    getOpOligo(){
        return this.opOligo;
    }

    //Fator de correção - para um equipo de 25mL
    getFC(){
        return this.fc;
    }

    setFC(volume_equipo){
        this.fc = (this.volumeCalculo() + volume_equipo) / this.volumeCalculo();
    }

    //Cálculo dos volumes - sobrecarrega métodos de HV para multiplicar pelo FC
    //Eletrólitos
    volNa(){
        let resultado = 0;
        if((this.p != 0) & (this.na >= 2)){
            resultado = super.volNa() * this.fc;
        }

        return resultado;
    }

    volCa(){
        return super.volCa() * this.fc;
    }

    volMg(){
        return super.volMg() * this.fc;
    }

    volK(){
        return super.volK() * this.fc;
    }

    volP(){
        return this.peso * this.p * this.fc;
    }

    //Nutrientes
    volAac(){
        return this.peso * this.aac * 10 * this.fc;
    }

    volLip(){
        return this.peso * this.lip * 5 * this.fc;
    }

    volGlic(){
        return this.peso * this.vig * 2 * 1.44 * this.fc;
    }

    volVit(){
        let vitaminas = [0, 0];

        switch (this.optVit) {
            case 0:
                break;

            case 1:  //Frutovitam
                vitaminas[0] = this.peso * 2.0 * this.fc;
                break;

            case 2:  // Trezevit A/B
                if (this.peso >= 3.0){
                    vitaminas[0] = 5 * this.peso * this.fc;
                    vitaminas[1] = 5 * this.peso * this.fc;
                } else if ((this.peso > 1.0) && (this.peso < 3.0)){
                    vitaminas[0] = 3.25 * this.peso * this.fc;
                    vitaminas[1] = 3.25 * this.peso * this.fc;
                } else if (this.peso <= 1.0){
                    vitaminas[0] = 1.5 * this.peso * this.fc;
                    vitaminas[1] = 1.5 * this.peso * this.fc;
                }
                break;

            case 3:  //Polivit A/B
                if (this.peso <=10.0){
                    vitaminas[0] = (this.peso * 4.0 * this.fc);
                    vitaminas[1] = (this.peso * 2.0 * this.fc);
                } else {
                    vitaminas[0] = 10.0;
                    vitaminas[1] = 5.0;
                }
                break;

            default:
                vitaminas[0] = 5 * this.peso * this.fc;
                vitaminas[1] = 5 * this.peso * this.fc;

        }

        return vitaminas;
    }

    vTotalVit(vitaminas){
        return vitaminas[0] + vitaminas[1];
    }

    volOligo(){
        let resultado = 0.0;

        switch (this.opOligo) {
            case 0:
                break;

            case 1:  //Ped-Element
                resultado = this.peso * 0.2 * this.fc;
                break;

            case 2:  //Oliped
                resultado = this.peso *  this.fc;
                break;

            case 3:  //Ad-Element
                resultado = this.peso * 0.05 * this.fc;
                break;

            case 4:  //Politrace 4
                resultado = this.peso * 0.1 * this.fc;
                break;

            case 5:  //Tracitrans Plus
                resultado = this.peso * 0.3 * this.fc;
                break;
        }

        return resultado;
    }

    //Controles da NPT

    kcalGlic(){
        return 3.4 * this.peso * this.vig * 1.44;
    }

    kcalLip(){
        return 9 * this.peso * this.lip;
    }

    kcalAAC(){
        return 4 * this.peso * this.aac;
    }

    kcalNaoProteicas(){
        return this.kcalGlic() + this.kcalLip();
    }

    ofertaCaloricaTotal(){   //em kcal/dia
        return (this.kcalLip() + this.kcalGlic() + this.kcalAAC());
    }

    totalCations(){  //em mEq/L
        return (this.volCa() * 0.45 + this.volMg() * 4) * 1000 / this.volumeTotalNPT();
    }

    totalN(){  //em g
        return this.peso * this.aac / 6.25;
    }

    totalCa(){   //em mEq/L
        return (this.volCa() * 450) / this.volumeTotalNPT();
    }

    relCaP(){
        return (this.volCa() * 9) / (this.volP() * 31);
    }

    osmolaridade(){
        return ((this.volAac() * 0.8 + this.volGlic() * 3.5 + this.volNa() * 6.8 + this.volP() * 6.2)
            * 1000 / this.volumeTotalNPT()) - 50;
    }

    //Volume de ABD para completar solução
    volABD(){
        return (this.volumeCalculo() * this.fc) - (this.volGlic() + this.volAac() + this.volLip() +
            this.volCa() + this.volNa() + this.volK() + this.volMg() + this.volP() + this.vTotalVit(this.volVit()) +
            this.volOligo());
    }

    volumeTotalNPT(){
        return this.volGlic() + this.volAac() + this.volLip() +
            this.volCa() + this.volNa() + this.volK() + this.volMg() + this.volP() + this.vTotalVit(this.volVit()) +
            this.volOligo() + this.volABD();
    }

    volInfusao(){
        return this.volumeTotalNPT() / this.fc;
    }

    mlH(){
        return this.volInfusao() / 24;
    }

    toJSON(){
        super.toJSON();

        let arq = new Object();

        arq.peso = this.peso;
        arq.volume = this.volume;
        arq.vig = this.vig;
        arq.aac = this.aac;
        arq.lip = this.lip;
        arq.glicose_50 = this.volGlic().toFixed(1);
        arq.proteinas = this.volAac().toFixed(1);
        arq.lipidios = this.volLip().toFixed(1);
        arq.abd = this.volABD().toFixed(1);
        arq.ca = this.volCa().toFixed(1);
        arq.na = this.volNa().toFixed(1);
        arq.k = this.volK().toFixed(1);
        arq.mg = this.volMg().toFixed(1);
        arq.p = this.volP().toFixed(1);
        arq.oligoelementos = this.volOligo().toFixed(1);
        arq.vitaminas = this.volVit();
        arq.kcal_glic = this.kcalGlic().toFixed(1);
        arq.kcal_prot = this.kcalAAC().toFixed(1);
        arq.kcal_lip = this.kcalLip().toFixed(1);
        arq.kcal_nao_proteicas = this.kcalNaoProteicas().toFixed(1);
        arq.oferta_calorica_total = this.ofertaCaloricaTotal().toFixed(1);
        arq.total_cations = this.totalCations().toFixed(1);
        arq.total_ca = this.totalCa().toFixed(1);
        arq.rel_ca_p = this.relCaP().toFixed(1);
        arq.total_n = this.totalN().toFixed(1);
        arq.osmolaridade = Math.round(this.osmolaridade());
        arq.volume_total = this.volumeTotalNPT().toFixed(1);
        arq.volume_infusao = this.volInfusao().toFixed(1);
        arq.mlh = this.mlH().toFixed(1);

        return JSON.stringify(arq);

    }

}

class Drogas{
    constructor(peso){
        this.peso = peso;
    }

//DVA
    setAdrenalina(adr){
        this.adrenalina = adr;
    }

    getAdrenalina(){
        return this.adrenalina;
    }

    volAdrenalina(){
        return this.peso * this.adrenalina * 1.44;
    }

    setNoradrenalina(nora){
        this.noradrenalina = nora;
    }

    getNoradrenalina(){
        return this.noradrenalina;
    }

    volNoradrenalina(){
        return (this.peso * this.noradrenalina * 1.44);
    }

    setDobutamina(dobuta){
        this.dobutamina = dobuta;
    }

    getDobutamina(){
        return this.dobutamina;
    }

    volDobutamina(){
        return (this.peso * this.dobutamina * 1.44) * 0.08;
    }

    setDopamina(dopa){
        this.dopamina = dopa;
    }

    getDopamina(){
        return this.dopamina;
    }

    volDopamina(){
        return (this.peso * this.dopamina * 1.44) * 0.2;
    }

    setMilrinone(mil){
        this.milrinone = mil;
    }

    getMilrinone(){
        return this.milrinone;
    }

    volMilrnone(){
        let mcg = (this.peso * this.milrinone * 1440);
        return mcg * 0.01 * 0.04;
    }

    setAdenosina(adenosina){
        this.adenosina = adenosina;
    }

    getAdenosina(){
        return this.adenosina;
    }

    volAdenosina(){
        return (this.peso * this.adenosina) / 300;
    }

    setAmiodarona(amiodarona){
        this.amiodarona = amiodarona;
    }

    getAmiodarona(){
        return this.amiodarona;
    }

    volAmiodarona(){
        return (this.peso * this.amiodarona) / 1.5;
    }

    setProstaglandina(prost){
        this.prostaglandina = prost;
    }

    getProstaglandina(){
        return this.prostaglandina;
    }

    volProstaglandina(conc){
        let mcg = (this.peso * this.prostaglandina * 1440);

        if(parseInt(conc) === 500){  //Solução 1mL/100mL diluente
            return (mcg * 0.2) / 24;
        } else {
            // Calcula qte de frascos de 20mcg
            let mcg = this.peso * this.prostaglandina * 1440
            let frascos = Math.ceil(mcg *  0.05);
            let volume = 4 * frascos;  // Para uma concentração de 5mcg/mL
            return {
                volume : volume,
                mLh : (mcg * 0.2) / 24
            }
        }
    }

    //Sedativos
    setFentanil(fent){
        this.fentanil = fent;
    }

    getFentanil(){
        return this.fentanil;
    }

    volFentanil(){
        return this.peso * this.fentanil * 0.2;  //Diluido 1+9
    }

    volFentanilContinuo(){
        return this.peso * this.fentanil * 0.48;
    }

    setMidazolam(mid){
        this.midazolam = mid;
    }

    getMidazolam(){
        return this.midazolam;
    }

    volMidazolam(){
        return this.peso * this.midazolam * 2; // Diluido 1+9
    }

    volMidazolamContinuo(){
        return this.peso * this.midazolam * 4.8;
    }

    setCetamina(cetamina){
        this.cetamina = cetamina;
    }

    getCetamina(){
        return this.cetamina;
    }

    volCetamina(){
        return this.peso * this.cetamina * 0.2;  // Diluida 1+9
    }

    volCetaminaContinuo(){
        return this.peso * this.cetamina * 0.48;
    }

    //Anticonvulsivantes
    setFenobarbital(feno){
        this.fenobarbital = feno;
    }

    getFenobarbital(){
        return this.fenobarbital;
    }

    volAtaqueFenobarbital(){
        return this.peso * this.fenobarbital * 0.01;
    }

    volFenobarbital(){
        return this.peso * this.fenobarbital * 0.1;  // Diluido 1+9
    }

    setFenitoina(fenito){
        this.fenitoina = fenito;
    }

    getFenitona(){
        return this.fenitoina;
    }

    volAtaqueFenitoina(){
        return this.peso * this.fenitoina * 0.02;
    }

    volFenitoina(){
        return this.peso * this.fenitoina * 0.2;
    }


    //Bloqueadores neuromusculares
    setPancuronio(panc){
        this.pancuronio = panc;
    }

    getPancuronio(){
        return this.pancuronio;
    }

    volPancuronio(){
        return this.peso * this.pancuronio * 0.5;
    }

    volPancuronContinuo(){
        return (this.peso * this.pancuronio * 0.72); // 1440min/2000mcg
    }

    setRocuronio(roc){
        this.rocuronio = roc;
    }

    getRocuronio(){
        return this.rocuronio;
    }

    volRocuronio(){
        return this.peso * this.rocuronio * 0.1;
    }

    volRocuronContinuo(){
        return (this.peso * this.rocuronio * 0.144);
    }


    //Antagonistas
    setNaloxone(nalox){
        this.naloxone = nalox;
    }

    getNaloxone(){
        return this.naloxone;
    }

    volNaloxone(){
        return this.peso * this.naloxone * 0.1;  // Diluir 0,1:9,9
    }

    setFlumazenil(flu){
        this.flumazenil = flu;
    }

    getFlumazenil(){
        return this.flumazenil;
    }

    volFlumazenil(){
        return this.peso * this.flumazenil * 0.1
    }

    setNeostigmine(neost){
        this.neostigmine = neost;
    }

    getNeostigmine(){
        return this.neostigmine;
    }

    volNeostigmine(){
        return this.peso * this.neostigmine * 20;
    }
}

function calcular(){
    //Captura os valores dos campos
    let txt_peso = parseFloat(document.getElementById('hv_peso').value);
    let txt_volume = parseFloat(document.getElementById('hv_volume').value);
    let txt_vig = parseFloat(document.getElementById('hv_vig').value);
    let dose_na = parseFloat(document.getElementById('hv_na').value);
    let dose_k = parseFloat(document.getElementById('hv_k').value);
    let dose_ca = parseFloat(document.getElementById('hv_ca').value);
    let dose_mg = parseFloat(document.getElementById('hv_mg').value);

    //Inicializa o objeto
    let new_hv = new HV(txt_peso, txt_volume, txt_vig);

    //Seta as doses
    new_hv.setCK(1);
    new_hv.setCMg(1);
    new_hv.setNa(dose_na);
    new_hv.setK(dose_k);
    new_hv.setCa(dose_ca);
    new_hv.setMg(dose_mg);

    alert(new_hv.toJSON());
}

function calcularNPT() {
    //Captura os valores dos campos
    let txt_peso = parseFloat(document.getElementById('np_peso').value);
    let txt_volume = parseFloat(document.getElementById('np_volume').value);
    let txt_vig = parseFloat(document.getElementById('np_vig').value);
    let txt_aac = parseFloat(document.getElementById('np_aac').value);
    let txt_lip = parseFloat(document.getElementById('np_lip').value);
    let dose_na = parseFloat(document.getElementById('np_na').value);
    let dose_k = parseFloat(document.getElementById('np_k').value);
    let dose_ca = parseFloat(document.getElementById('np_ca').value);
    let dose_mg = parseFloat(document.getElementById('np_mg').value);
    let dose_p = parseFloat(document.getElementById('np_p').value);
    let opcao_oligo = parseInt(document.getElementById('np_oligo').value);
    let opcao_vitamina = parseInt(document.getElementById('np_vit').value);

    let new_npt = new NPT(txt_peso, txt_volume, txt_vig, txt_aac, txt_lip);

    new_npt.setCK(1);
    new_npt.setCMg(1);
    new_npt.setNa(dose_na);
    new_npt.setCa(dose_ca);
    new_npt.setMg(dose_mg);
    new_npt.setK(dose_k);
    new_npt.setP(dose_p);
    new_npt.setOpVit(opcao_vitamina);
    new_npt.setOpOligo(opcao_oligo);

    alert(new_npt.toJSON());
}




