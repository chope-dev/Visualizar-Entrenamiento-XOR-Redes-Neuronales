function xorTradicional(x,y){
	strResultado = 0;
	// completar código
	if(x==0 && y==0){
		resultado = 0;
	}else if (x==1 && y==1){
		resultado = 0;
	}else{
		resultado = 1;
	}
	return resultado;
}

function pruebaXorTradicional(){
	var strResultado = "";
	for (i=0; i<datosEntrada.length; i++){
		var x = datosEntrada[i][0];
		var y = datosEntrada[i][1];
		var esperado = datosEsperados[i];
		var resultado  = xorTradicional(x,y); 
		strResultado =strResultado  +  "( " + x + " , " + y + " )-->" + resultado + " (esperado: " + esperado  + " )<br>";

	}	
	$("#tradresults")[0].innerHTML= strResultado;
}
