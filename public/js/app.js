$(function(){

    $('ul.#variant-size a').click(function(){
        clearVariantSelection('ul.#variant-size a');
        $(this).addClass('js_selected');
    });

    $('ul.#variant-color a').click(function(){
        clearVariantSelection('ul.#variant-color a');
        $(this).addClass('js_selected');
    });
});

function clearVariantSelection(selector) {
    $(selector).each(function(){
        if ($(this).hasClass('js_selected')) {
            $(this).removeClass('js_selected');
        }
    })
}
