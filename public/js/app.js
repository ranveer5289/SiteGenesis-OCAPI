$(function(){

    /*$('#category_nav').click(function(e){
        e.preventDefault();
        var obj = {};
        obj.cgid = $(this).attr("href");
        $.ajax({
            type : 'GET',
            contentType: 'application/json',
            dataType : 'json',
            data: obj,
            url : '/SearchShow',
            success : function(data) {
                console.log(data);

                var templates = {};
                $("script[type='text/tmpl']").each(function(idx,el) {
                    templates[$(el).attr("data-name")] = swig.compile(el.text, { filename: $(el).attr("data-name") });
                    $(el).remove();
                });

                templates.producthit(data);

            },
            error : function(){
                console.log("error");
            }
        });
    });*/
});
