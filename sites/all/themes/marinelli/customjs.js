(function ($) 
{
	jQuery( document ).ready(function() 
	{
		//jQuery("#edit-submitted-step-n-generations-forward").val("234");
		jQuery(".accept-help").live( "click", myHandler );

		function myHandler( event ) 
		{
			//alert($( this ).next().html())
			jQuery.ajax({
			      url: 'node/get/ajax/'+$( this ).next().html(),
			      type: 'post',
			      success: function(data, status) 
			      {
			      		;
			      },
			      error: function(xhr, desc, err) {
			      		;
			      }
			    });
		}

		basics = {};

		jQuery("#edit-generate-popworld").click(function()
		{
			var webformid = jQuery("#webform_id").html();
			generatepopworld(webformid);
		});

		function generatepopworld(webformid)
		{
			basics = init();
			switch(webformid) 
			{
			    case "webform_client_form_2":
			        getBasics();
			        break;
			    case "webform_client_form_3":
			        getMigration();
			        break;
			    default:
			        break;
			} 
		}

		function init()
		{
			var obj = {};
			obj.populationSize = jQuery("#edit-submitted-population").val();
			obj.dominant = jQuery("#edit-submitted-dominance").val();
			obj.startFrequencyA1 = jQuery("#edit-sliderfield-submitted-frequency-of-a1-allele-red-container").slider("option", "value");
			obj.startFrequencyA2 = 1 - obj.startFrequencyA1;
			obj.currentFrequencyA1 = jQuery("#edit-sliderfield-submitted-frequency-of-a1-allele-red-container").slider("option", "value");;
			obj.currentFrequencyA2 = 1 - obj.startFrequencyA1;
			return obj;
		}

		function zeroGeneration()
		{
			basics.currentFrequencyA1A1 = basics.currentFrequencyA1*basics.currentFrequencyA1;
			basics.currentFrequencyA1A2 = 2*basics.currentFrequencyA1*basics.currentFrequencyA2;
			basics.currentFrequencyA2A2 = basics.currentFrequencyA2*basics.currentFrequencyA2;
			
			calculateAGeneration();
		}

		function calculateAGeneration()
		{
			var temp = 0.0;
			if(basics.dominant == "red")
			{
				temp = basics.populationSize * basics.currentFrequencyA2A2;
				basics.currentHomozygousRecessiveCount = Math.round(temp);
			
				temp = basics.populationSize * basics.currentFrequencyA1A1;
				basics.currentHomozygousDominantCount = Math.round(temp);
			}
			
			if(basics.dominant == "blue"){
				// Calculate the N(a1a1) count as a temporary variable 
				temp = basics.populationSize * basics.currentFrequencyA1A1;
				
				basics.currentHomozygousRecessiveCount = Math.round(temp);
				
				// Calculate the N(a2a2) count as a temporary variable
				temp = basics.populationSize * basics.currentFrequencyA2A2;
				basics.currentHomozygousDominantCount = Math.round(temp);
			}
			// Calculate the N(a1a2) as the remainder of the population size.
			basics.currentHeterozygousCount = (basics.populationSize - (basics.currentHomozygousDominantCount + basics.currentHomozygousRecessiveCount));
			basics.currentDominantPopCount = basics.currentHeterozygousCount + basics.currentHomozygousDominantCount;
			basics.currentRecessivePopCount = basics.currentHomozygousRecessiveCount;
			
		}

		function calculateAlleleFrequencies()
		{
			basics.currentFrequencyA1A1 = basics.currentFrequencyA1*basics.currentFrequencyA1;
			basics.currentFrequencyA1A2 = 2*basics.currentFrequencyA1*basics.currentFrequencyA2;
			basics.currentFrequencyA2A2 = basics.currentFrequencyA2*basics.currentFrequencyA2;	
		}

		function calculateNextGeneration()
		{
			var currentfA1 = basics.currentFrequencyA1;
			
			//incrementGenerationCount();
			
			basics.currentFrequencyA1 = currentfA1;
			basics.currentFrequencyA2 = 1 - currentfA1;
			
			calculateAlleleFrequencies();
			
			calculateAGeneration();
		}
		
		function calculateNextNGenerations(generations)
		{
			for(var i = 0; i < generations; i++)
				calculateNextGeneration();
		}

		function print()
		{
			var ret = "";
			jQuery.each(basics, function(key,val){
				ret += key+": " + val + "<br/>";
			})
			jQuery("#result").html(ret);
		}

		function getBasics()
		{
			//alert("Basics");
			zeroGeneration();
			count = jQuery("#edit-submitted-step-n-generations-forward").val();
			calculateNextNGenerations(count);
			print();
			//var myLineChart = new Chart(ctx).Line(data, {});
			if(jQuery("#edit-next").length == 0)
				jQuery( '<input id="edit-next" class="form-submit" type="submit" value="Next" name="op" onclick="return false;">' ).insertAfter( "#edit-generate-popworld" );
			
			jQuery("#edit-next").click(function(){
				calculateNextNGenerations(count);
				//print();
			})
		}

		function getMigration()
		{
			alert("Migration");
		}

		var data = {
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 40]
		        },
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
		    ]
		};

		var ctx = document.getElementById("result").getContext("2d");
		
	});
}(jQuery));


