
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
	temp.currentFrequencyA1 = jQuery("#edit-sliderfield-submitted-frequency-of-a1-allele-red-container").slider("option", "value");
	temp.currentFrequencyA2 = 1 - temp.startFrequencyA1;

	//Mutation extra
	temp.A1mutateA2 = jQuery("#edit-submitted-a1-to-a2-mutation-rate0000000001-000001").val();
	temp.A2mutateA1 = jQuery("#edit-submitted-a2-to-a1-mutation-rate0000000001-000001").val();
	
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

	var tmp = 0.0;
	var p = temp.currentFrequencyA1;
	
	// Subtract the number of p's which mutate to q and add the 
	// number of q's which mutate to p
	tmp = (1-temp.A1mutateA2)*p + temp.A2mutateA1*(1-p);
	temp.currentFrequencyA1 = tmp;
	temp.currentFrequencyA2 = 1 - tmp;

	temp.currentFrequencyA1A1 = temp.currentFrequencyA1*temp.currentFrequencyA1;
	temp.currentFrequencyA1A2 = 2*temp.currentFrequencyA1*temp.currentFrequencyA2;
	temp.currentFrequencyA2A2 = temp.currentFrequencyA2*temp.currentFrequencyA2;
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
