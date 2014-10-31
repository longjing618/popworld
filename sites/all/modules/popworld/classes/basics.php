<?php
class basics
{
	protected $populationSize;
	
	protected $startFreqA1;
	protected $startFreqA2;
	
	protected $freqA1;
	protected $freqA2;
	
	protected $freqA1A1;
	protected $freqA1A2;
	protected $freqA2A2;
	
	protected $dominant;
	
	protected $dominantCount;
	protected $recessiveCount;
	protected $homoDomCount;
	protected $heteroCount;
	protected $homoRecCount;
	
	protected $precision;
	
	protected $genCount;

	public function basics($populationSize, $freqA1, $dominant) 
	{
		drupal_debug($populationSize,NULL);
		drupal_debug($freqA1,NULL);
		drupal_debug($dominant,NULL);
		$this->initialize();
		
		$this->populationSize = $populationSize;
		$this->dominant = $dominant;

		$this->startFrequencyA1 = $freqA1;
		$this->startFrequencyA2 = 1- $freqA1;
		
		$this->currentFrequencyA1 = $freqA1;
		$this->currentFrequencyA2 = 1 - $freqA1;
		
		$this->zeroGeneration();
	}

	public function initialize() 
	{
		$startFreqA1 = 0.0;
		$startFreqA2 = 0.0;
		
		$freqA1 = array();
		$freqA2 = array();
		
		$freqA1A1 = array();
		$freqA1A2 = array();
		$freqA2A2 = array();
		
		
		$dominantCount = array();
		$recessiveCount= array();
		$homoDomCount = array();
		$heteroCount = array();
		$homoRecCount = array();
		
		$precision = 0.001;
		
		$genCount = 0;
	}

	public function zeroGeneration()
	{
		$this->currentFrequencyA1A1 = $this->currentFrequencyA1*$this->currentFrequencyA1;
		$this->currentFrequencyA1A2 = 2*$this->currentFrequencyA1*$this->currentFrequencyA2;
		$this->currentFrequencyA2A2 = $this->currentFrequencyA2*$this->currentFrequencyA2;
		
		$this->calculateAGeneration();
	}

	public function calculateAGeneration()
	{
		$temp = 0.0;
	
		if($this->dominant == "red")
		{
			// Calculate the N(a2a2) count as a temporary variable 
			$temp = $this->populationSize * $this->currentFrequencyA2A2;
		
			// Checks whether or not the temporary calculation is a whole number 
			// or not, if not, then we round the number.
			$this->currentHomozygousRecessiveCount = floor($temp);

		
			// Calculate the N(a1a1) count as a temporary variable
			$temp = $this->populationSize * $this->currentFrequencyA1A1;
			$this->currentHomozygousDominantCount = floor($temp);
		}
	
		if($this->dominant == "blue"){
			// Calculate the N(a1a1) count as a temporary variable 
			$temp = $this->populationSize * $this->currentFrequencyA1A1;
			
			// Checks whether or not the temporary calculation is a whole number 
			// or not, if not, then we round the number.
			$this->currentHomozygousRecessiveCount = floor($temp);

			
			// Calculate the N(a2a2) count as a temporary variable
			$temp = $this->populationSize * $this->currentFrequencyA2A2;
			$this->currentHomozygousDominantCount = floor($temp);
		}
		// Calculate the N(a1a2) as the remainder of the population size.
		$this->currentHeterozygousCount = ($this->populationSize - ($this->currentHomozygousDominantCount + $this->currentHomozygousRecessiveCount));
		$this->currentDominantPopCount = $this->currentHeterozygousCount + $this->currentHomozygousDominantCount;
		$this->currentRecessivePopCount = $this->currentHomozygousRecessiveCount;
	}
/*
			public function calculateNextGeneration():void{
			var currentfA1:Number = this.currentFrequencyA1;
			
			incrementGenerationCount();
			
			this.currentFrequencyA1 = currentfA1;
			this.currentFrequencyA2 = 1 - currentfA1;
			
			calculateAlleleFrequencies();
			
			calculateAGeneration();
		}
		
		public function calculateNextNGenerations(generations:int):void{
			for(var i:int = 0; i < generations; i++){
				calculateNextGeneration();
			}
		}
		*/

	public function output()
	{
		return array
			(
				"currentHeterozygousCount"=>$this->currentHeterozygousCount,
				"currentDominantPopCount"=>$this->currentDominantPopCount,
				"currentFrequencyA1A1"=>$this->currentFrequencyA1A1,
				"currentFrequencyA1A2"=>$this->currentFrequencyA1A2,
				"currentFrequencyA2A2"=>$this->currentFrequencyA2A2,
			);
	}
	
}
?>