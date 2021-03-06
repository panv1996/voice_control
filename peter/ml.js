    // more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/ydki9-B66/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
        for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            for (let i = 0; i < classLabels.length; i++) {
                const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
			
			//define child targets
			var child1 = $( "#label-container div:nth-child(2)" );
			var child2 = $( "#label-container div:nth-child(3)" );
			var child3 = $( "#label-container div:nth-child(4)" );
			
			//extract decimal from string representing confidence from 0 and 1
			var target_1 = parseFloat(child1.text().slice(-4));
			var target_2 = parseFloat(child2.text().slice(-4));
			var target_3 = parseFloat(child3.text().slice(-4));
			
			//Pan called -> reset
			if(target_1 > 0.85){
				console.log("PAN called " + target_1);
				$("#mygif").css("display","none");
				$("#mygif").css("filter",'');
			}
			
			//Peter called -> peter's gif appears
			if(target_2 > 0.9){
				console.log("PETER called " + target_2);
				$("#mygif").css("display",'');
			}
			
			//Tus called -> inverts color
			if(target_3 > 0.85){
				console.log("TUS called " + target_3);
				$("#mygif").css("filter","invert(100%)");
			}
			
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }