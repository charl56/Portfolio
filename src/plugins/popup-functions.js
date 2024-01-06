export const popup = (function() {
    return {
        setShowArrows: function(data){      // Show or not arrow on carousels
            if(JSON.stringify(data.length) > 1){
                return 'hover'
            } else {
                return false
            }
        },
        outilSize: function(){              // Size text 'outil' part
            if(window.outerWidth < 400){
                return 'text-h5'
            } else if(window.outerWidth < 600){
                return 'text-body-1'
            } else {   
                return 'text-body-2' 
            }
        },
        textSize: function() {         // Text size responsive
            if (window.outerWidth < 400) {
                return 'text-h4 mt-5 mx-10'
            } else if (window.outerWidth < 600) {
                return 'text-h5 mx-10'
            } else {
                return 'text-body-1'
            }
        },
        dateSize: function(){           // 'date' part size
            if(window.outerWidth < 400){
                return 'text-h6'
            } else if(window.outerWidth < 600){
                return 'text-subtitle-1'
            } else {   
                return 'text-subtitle-2' 
            }
        },
        setWidth: function(){
            let widthScreen = window.innerHeight
            let widthPart = document.getElementById('resizable')
            if(typeof widthPart == 'object' && widthPart != null){
                let value = parseInt((widthPart.offsetHeight*100)/widthScreen)+'vw'
                return value
            }
        },
    };
  })();
  