$(function(){

    $('#variant-size a').click(function(){
        clearVariantSelection('#variant-size a');
        $(this).addClass('js_selected');
    });

    $('#variant-color a').click(function(){
        clearVariantSelection('#variant-color a');
        $(this).addClass('js_selected');
    });

    $('#addToCart').click(function(e){
        e.preventDefault();

        var productObj = {};
        productObj["product_id"] = $("#variant-size a").filter("[class='js_selected']").data('pid').toString();
        productObj["quantity"] = parseInt($('.product-qty select').val());

        $.ajax({

            url : "/addProductToBasket",
            contentType: 'application/json',
            data : JSON.stringify(productObj),
            method : 'POST',
            dataType: "json",
            success : function(data) {
                console.log(data);
            },
            error : function(error) {
              console.log(error);
            }

        });

    });
});

function clearVariantSelection(selector) {
    $(selector).each(function(){
        if ($(this).hasClass('js_selected')) {
            $(this).removeClass('js_selected');
        }
    })
}
