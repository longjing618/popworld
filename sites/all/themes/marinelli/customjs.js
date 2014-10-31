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
	});
}(jQuery));


