
const css = `
		#daodream-container,nexmoe-header,#nexmoe-pendant,#nexmoe-background{
			display: none;
		}
		body{
			 animation: myBody 1s;
		}
		 @keyframes myBody {
		    0% {
		     opacity: 0
		    }
		    30% {
		      opacity: 0.3
		    }
		    60% {
		      opacity: 0.7
		    }
		    100% {
		      opacity: 1
		    }
		}
	`
const js = `
		$("a").each(function(){
		    $(this).attr("href","#");
		    $(this).attr("onClick","return false");
		
		})
	`
export {
	css,
	js
}


