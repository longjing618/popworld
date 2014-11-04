
function init()
{
	var obj = {};
	obj.count = 0;
	obj.data = [];
	var temp = {};
	temp.populationSize = jQuery("#edit-submitted-population").val();
	//temp.dominant = jQuery("#edit-submitted-dominance").val();
	if(jQuery("#edit-submitted-dominance-1").is(':checked'))
		temp.dominant = "red";
	else
		temp.dominant = "blue";
	temp.startFrequencyA1 = jQuery("#edit-sliderfield-submitted-frequency-of-a1-allele-red-container").slider("option", "value");
	temp.startFrequencyA2 = 1 - temp.startFrequencyA1;
	temp.currentFrequencyA1 = jQuery("#edit-sliderfield-submitted-frequency-of-a1-allele-red-container").slider("option", "value");;
	temp.currentFrequencyA2 = 1 - temp.startFrequencyA1;

	//---------nrmating extra----------//
	temp.probabilityInbreeding = jQuery("#edit-sliderfield-submitted-probability-of-inbreeding-f-container").slider("option","value");
	temp._firstGen = true;

	obj.data[obj.count] = temp;
	return obj;
}

function zeroGeneration()
{
	var temp = basics.data[basics.count];
	temp.currentFrequencyA1A1 = temp.currentFrequencyA1*temp.currentFrequencyA1;
	temp.currentFrequencyA1A2 = 2*temp.currentFrequencyA1*temp.currentFrequencyA2;
	temp.currentFrequencyA2A2 = temp.currentFrequencyA2*temp.currentFrequencyA2;
	basics.data[basics.count] = temp;
	
	calculateAGeneration();
	basics.count++;
}

function calculateAGeneration()
{
	var tempobj = basics.data[basics.count];
	var temp = 0.0;
	if(tempobj.dominant == "red")
	{
		temp = tempobj.populationSize * tempobj.currentFrequencyA2A2;
		tempobj.currentHomozygousRecessiveCount = Math.round(temp);
	
		temp = tempobj.populationSize * tempobj.currentFrequencyA1A1;
		tempobj.currentHomozygousDominantCount = Math.round(temp);
	}
	
	if(tempobj.dominant == "blue"){
		// Calculate the N(a1a1) count as a temporary variable 
		temp = tempobj.populationSize * tempobj.currentFrequencyA1A1;
		
		tempobj.currentHomozygousRecessiveCount = Math.round(temp);
		
		// Calculate the N(a2a2) count as a temporary variable
		temp = tempobj.populationSize * tempobj.currentFrequencyA2A2;
		tempobj.currentHomozygousDominantCount = Math.round(temp);
	}
	// Calculate the N(a1a2) as the remainder of the population size.
	tempobj.currentHeterozygousCount = (tempobj.populationSize - (tempobj.currentHomozygousDominantCount + tempobj.currentHomozygousRecessiveCount));
	tempobj.currentDominantPopCount = tempobj.currentHeterozygousCount + tempobj.currentHomozygousDominantCount;
	tempobj.currentRecessivePopCount = tempobj.currentHomozygousRecessiveCount;
	basics.data[basics.count] = tempobj;
}

function calculateAlleleFrequencies()
{
	var temp = basics.data[basics.count];
	var p = temp.currentFrequencyA1;
	var q = temp.currentFrequencyA2;
	var delta1;
	
	var D = temp.currentFrequencyA1A1;
	var H = temp.currentFrequencyA1A2;
	var R = temp.currentFrequencyA2A2;
	
	var F = temp.probabilityInbreeding;
	var tmp;
	
	var gen = basics.count;
	
	if(temp._firstGen)
	{
		temp._firstGen = false;
		
		temp.currentFrequencyA1A1 = p*p;
		temp.currentFrequencyA1A2 = 2*p*q;
		temp.currentFrequencyA2A2 = q*q;
		
		
		temp.currentFrequencyA1 = p;
		temp.currentFrequencyA2 = 1 - p;
	} 
	else 
	{
		temp.currentFrequencyA1A2 = 2*p*q*Math.pow(1-F,gen);
		temp.currentFrequencyA1A1 = (1-temp.currentFrequencyA1A2)/2;
		temp.currentFrequencyA2A2 = temp.currentFrequencyA1A1;
		p = (2*temp.currentFrequencyA1A1+temp.currentFrequencyA1A2)/2;
		q = 1-p;
		//delta1 = ((1 - F) * H);
		
		// (H - (1-F)*H)/2 = (H - H + HF)/2 = (HF/2)
		//this.currentFrequencyA1A1 = D + delta1/2;
		//this.currentFrequencyA1A2 = H - delta1;
		//this.currentFrequencyA2A2 = R + delta1/2;
		
		/*this.currentFrequencyA1A1 = D + (H - delta1/2;
		this.currentFrequencyA1A2 = H - delta1;
		this.currentFrequencyA2A2 = R + (H - delta1)/2;*/
		
		temp.currentFrequencyA1 = p;
		temp.currentFrequencyA2 = 1 - p;
	}

	basics.data[basics.count] = temp;
}

function calculateNextGeneration()
{
	basics.data[basics.count] = basics.data[basics.count-1];

	calculateAlleleFrequencies();
	
	calculateAGeneration();
	basics.count++;
}

function calculateNextNGenerations(generations)
{
	for(var i = 0; i < generations; i++)
		calculateNextGeneration();
}
