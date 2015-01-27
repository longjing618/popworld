
function init()
{
	var obj = {};
	obj.count = 0;
	obj.data = [];
	var temp = {};
	temp.populationSize = $("#population").val();
	if($("#dominance").val() == "RED")
		temp.dominant = "red";
	else
		temp.dominant = "blue";
	temp.startFrequencyA1 = $("#freq").val();
	temp.startFrequencyA2 = 1 - temp.startFrequencyA1;
	temp.currentFrequencyA1 = $("#freq").val();
	temp.currentFrequencyA2 = 1 - temp.startFrequencyA1;

	//ms extra
	temp.A1mutateA2 = $("#a1toa2").val();
	temp.A2mutateA1 = $("#a2toa1").val();
	
	temp.fitnessA1A1 = $("#a1a1").val();
	temp.fitnessA1A2 = $("#a1a2").val();;
	temp.fitnessA2A2 = $("#a2a2").val();;	

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

//ms custom
	var tmp = 0.0;
	var p = temp.currentFrequencyA1;
	var q = temp.currentFrequencyA2;
	var wAverage = p*p*temp.fitnessA1A1 + 2*p*q*temp.fitnessA1A2 + q*q*temp.fitnessA2A2;
	
	var selectionP = (p*p*temp.fitnessA1A1 + p*q*temp.fitnessA1A2)/wAverage;
	var selectionQ = (p*q*temp.fitnessA1A2 + q*q*temp.fitnessA2A2)/wAverage;
	
	tmp = (1-temp.A1mutateA2)*selectionP + temp.A2mutateA1*selectionQ;
	
	temp.currentFrequencyA1 = tmp;
	temp.currentFrequencyA2 = 1 - tmp;
//

	temp.currentFrequencyA1A1 = temp.currentFrequencyA1*temp.currentFrequencyA1;
	temp.currentFrequencyA1A2 = 2*temp.currentFrequencyA1*temp.currentFrequencyA2;
	temp.currentFrequencyA2A2 = temp.currentFrequencyA2*temp.currentFrequencyA2;
	basics.data[basics.count] = temp;
}

function calculateNextGeneration()
{
	basics.data[basics.count] = $.extend(true, {}, basics.data[basics.count-1]);

	calculateAlleleFrequencies();
	
	calculateAGeneration();
	basics.count++;
}

function calculateNextNGenerations(generations)
{
	for(var i = 0; i < generations; i++)
		calculateNextGeneration();
}
