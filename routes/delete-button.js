<%  $(document).ready(()=>{ 
								 		$('.delete-button').click({ 	
								 			var shouldDelete = confirm('Are you sure you want to delete this task?')	
								 			if(shouldDelete){	
								 				window.location.href('/delete/ <%= task.id %>')	
								 			}	
								 		}) 
								 	}) %>