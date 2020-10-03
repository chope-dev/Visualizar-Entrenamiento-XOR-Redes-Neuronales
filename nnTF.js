
//Datos de Configuración
//TODO: Juega con el número de neuronas de la capa oculta y la tasa de aprendizaje, observa que sucede
const NUM_NEURONAS_CAPA_OCULTA = 12;
const TASA_DE_APRENDIZAJE = 0.1;
var noHeParadoAntes=true;
var ciclosDeAprendizaje=0;
// datos para entrenar
    //datos de entrada (XOR)
    const datosEntrada = [[0, 0], [0, 1], [1, 0], [1, 1]];

    // resultados esperados para cada dato de entrada
    const datosEsperados = [[0], [1], [1], [0]];


// inicialización de tensores, pesos y bias (utilizamos los datos y los convertimos al formato esperado por TFjs)
const tensorEntrada = tf.tensor2d(datosEntrada, [4, 2]);
const tensorEsperado = tf.tensor2d(datosEsperados, [4, 1]);

// las variables se registran en tensorflow como variables entrenables
const pesosCapaUno = tf.variable(inicializaPesos([2, NUM_NEURONAS_CAPA_OCULTA], 2));
const biasCapaUno = tf.variable(tf.scalar(0));
const pesosCapaDos = tf.variable(inicializaPesos([NUM_NEURONAS_CAPA_OCULTA, 1], NUM_NEURONAS_CAPA_OCULTA));
const biasCapaDos = tf.variable(tf.scalar(0));

// definición del modelo de red neuronal con TensorFlow.js Core API
// son funciones que toman uno o más tensores y devuelven un tensor
// dichas funciones utilizan tf.variables que son los parámetros entrenables (pesos y bias)

function model(xs) {
    const hiddenLayer = tf.tidy( function ()  {
        // pesos, bias y función RELU (Rectified linear unit )
        return xs.matMul(pesosCapaUno).add(biasCapaUno).relu();
    });
    // pesos, bias y función Sigmoide
    retmodel = hiddenLayer.matMul(pesosCapaDos).add(biasCapaDos).sigmoid(); 
    return retmodel;
}


//stochastic gradient descent with alpha 0.1
const optimizador = tf.train.sgd(TASA_DE_APRENDIZAJE);


// inicialización aleatoria de los pesos
function inicializaPesos(shape, prevLayerSize) {
    return tf.randomNormal(shape).mul(tf.scalar(Math.sqrt(2.0 / prevLayerSize)));
}

// creamos la función de costo (aunque tf tambíen nos provee de varias)
// aquí usamos minimos cuadrados
function calculaCosto(y,output){
    return tf.squaredDifference(y, output).sum().sqrt();
}


//función de entrenamiento que de manera repetitiva optimiza los parámetros  de la función de costo
async function entrena(iteraciones) {
    const regresaCosto = true;
    let costo;
    for (let i = 0; i < iteraciones; i++) {
        
        costo = optimizador.minimize(function() {
            return calculaCosto(tensorEsperado, model(tensorEntrada));
        }, regresaCosto);
        if (i % 100 === 0) {
          costods = costo.dataSync()
          document.getElementById('divEntrenamiento').innerHTML += 'Perdida['+i+']: '+ costods +'<br>'
          updateCiclosDeAprendizaje(ciclosDeAprendizaje);
          if (costods<0.6&& noHeParadoAntes){
            noHeParadoAntes=false;
            break;
          }
        }
        
        await tf.nextFrame();
        ciclosDeAprendizaje +=1;
    }
    updateCiclosDeAprendizaje(ciclosDeAprendizaje);
    return costo.dataSync();
}

function updateCiclosDeAprendizaje(ciclos){
    $("#divCiclosDeAprendizaje")[0].innerHTML="Ciclos de Aprendizaje: " + ciclos;
}



async function aprendeXor() {
    const timeStart = performance.now();
    const iteraciones = Math.floor(Math.random()*200+400); // número aleatorio entre 400 y 600
    document.getElementById('divEntrenamiento').innerHTML += '<br>Número de Iteraciones de entrenamiento (aleatorio): '+iteraciones+'<br><br>'
    const loss = await entrena(iteraciones);
    const time = performance.now() - timeStart;
    document.getElementById('divEntrenamiento').innerHTML += '<br>Perdida: ' + loss[0]+'<br><br>'
    document.getElementById('divEntrenamiento').innerHTML += 'Duración del entrenamiento : '+ Math.round(time/1000).toFixed(2) + ' seconds</br><br>'
}

async function pruebaXor() {
    var timeStart2 = 0
    var time2 = 0
    var strresult = "";
	timeStart2 = performance.now();
    for (i=0; i<datosEntrada.length; i++){
    	
	    const inputData = tf.tensor2d([datosEntrada[i]], [1, 2]);
	    const expectedOutput = tf.tensor1d(datosEsperados[i]);
	    const val = model(inputData);    
	    const myVal = await val.data()
	    strresult =strresult  +  "( " + datosEntrada[i][0] + " , " + datosEntrada[i][1] + " )-->" + await parseFloat(myVal).toFixed(3) + " (esperado: "+ datosEsperados[i] +")<br>";
    }
    
    time2 = performance.now() - timeStart2;
    document.getElementById('divPrueba').innerHTML = '<br>Duración de la prueba : '+ time2.toFixed(3) + ' millisegundos</br><br>'
    document.getElementById('divPrueba').innerHTML +=  strresult;
    document.getElementById('divPrueba').innerHTML +=  "<br>Error: " + calculaCosto(tensorEsperado, model(tensorEntrada));

} 

function imprimePesosYBias(){
    console.log(pesosCapaUno.dataSync());
    console.log(biasCapaUno.dataSync());
    console.log(pesosCapaDos.dataSync());
    console.log(biasCapaDos.dataSync());
}



