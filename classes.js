//Objeto JSON HV

var hv = {
    "peso" : 0,
    "vig" : 0,
    "volume" : 0,
    "na" : 0,
    "k" : 0,
    "ca" : 0,
    "mg" : 0,

    //Concentrações de eletrólitos
    "na20" : 3.4, //em mEq/mL
    "ca10" : 9.0, //em mg/mL
    "conc_k" : 0,
    "setCK" : function (sel_k) {
        this.conc_k = sel_k;
    },
    "conc_mg" : 0,
    "setCMg" : function (sel_mg) {
        this.conc_mg = sel_mg;
    },


    //Sets e gets
    "setPeso" : function (peso) {
        this.peso = peso;
    },
    "setVIG" : function (vig) {
        this.vig = vig;
    },
    "setVolume" : function (volume) {
        this.volume = volume;
    },
    "getPeso" : function () {
        return this.peso;
    },
    "getVIG" : function () {
        return this.vig;
    },
    "getVolume" : function () {
        return this.volume;
    },
    "setNa" : function (dose) {
        this.na = dose;
    },
    "getNa" : function () {
        return this.na;
    },
    "setCa" : function (dose) {
        this.ca = dose;
    },
    "getCa" : function () {
        return this.ca;
    },
    "setK" : function (dose) {
        this.k = dose;
    },
    "getK" : function () {
        return this.k;
    },
    "setMg" : function (dose) {
        this.mg = dose;
    },
    "getMg" : function () {
        return this.mg;
    }
,

    //Cálculo do volume de eletrólitos
    "volNa" : function () {
        return this.peso * this.na / this.na20;
    },
    "volCa" : function () {
        return this.peso * this.ca;
    },
    "volK" : function () {
        return this.peso * this.k / this.conc_k;
    },
    "volMg" : function () {
        return this.peso * this.mg / this.conc_mg;
    },

    //Volume de cálculo
    "volumeCalculo" : function () {
        return this.peso * this.volume;
    },

    //Concentração Teórica
    "concentracaoTeorica" : function () {
        var gr_glicose = 1.44 * this.peso * this.vig;
        return (100 * gr_glicose) / this.volumeCalculo();
    },

    //Volume de glicose a 50%
    "volumeGlic50" : function () {
        var resultado = 0.0;
        if (this.concentracaoTeorica() > 5.0){
            resultado = (this.volumeCalculo() * (this.concentracao() - 5.0) )/ 45;
        }

        return resultado;
    },

    //Volume de glicose a 10%
    "volumeGlic10" : function () {
        return (this.peso * this.vig * 1.44) * 10;
    },

    //Volume de glicose a 5%
    "volumeGlic5" : function () {
        var resultado = 0.0;
        if (this.concentracaoTeorica() > 5.0){
            resultado = this.volumeCalculo() - this.volumeGlic50()
        }
        return resultado;
    }


}