/**
 * This is a very standard jquery function, it triggers a function once the 'document' is ready, intended
 * as rendered. We do this because in order to bind 'elements' such as the button to a function, the element
 * must exist, the element does not exist before rendering. If we didn't do this, the script would have been executed
 * before the rendering, as the execution is faster than the phisical rendering
 */
$(document).ready(function() {
    console.log('[Home Page] : home page rendered')
    ///// BINDINGS

    /**
     here we are binding the button with id buttonTest to a function which will do a simple execution
     of an alert message
     */
    $('#buttonTest').click(function() {
        var text=$('#textArea').val();
        $('#textArea').val('');
        
        $.post( "/sentiment", {message:text}, function( data ) {
            console.log(data);
            $('#textArea').val('[MESSAGE] : '+data.message +'  ------   [SENTIMENT] : '+data.sentiment.score);
        });
    })
})


/*$.post( "/sentiment", {message:'i love cats'}, function( data ) {
 console.log(data);
 //$( ".result" ).html( data );
 });*/