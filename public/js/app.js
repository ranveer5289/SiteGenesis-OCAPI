$(function(){

    $('ul.#variant-size a').click(function(){
        $(this).addClass("selected").css({
                "border-color": "red",
                "border-width":"1px",
                "border-style":"solid"
        });
    });

    $('ul.#variant-color a').click(function(){
        $(this).addClass("selected").css({
                "border-color": "red",
                "border-width":"1px",
                "border-style":"solid"
        });
    });
});

