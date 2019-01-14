//Objeto JSON HV

var hv = {
    "peso" : 0,
    "vig" : 0,
    "volume" : 0,
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

    //Volume de cálculo
    "volumeCalculo" : function () {
        return this.peso * this.volume;
    },

    //Concentração
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